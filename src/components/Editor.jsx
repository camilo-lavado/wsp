import React, { useState, useEffect, useCallback } from 'react';
import { FileUploader } from './FileUploader';
import { MessageEditor } from './MessageEditor';
import { ContactTable } from './ContactTable';
import { CountrySelector } from './CountrySelector';

import { TemplateManager } from './TemplateManager';
import { LayoutDashboard, Download, Filter, Zap, ArrowLeft, Save } from 'lucide-react';
import { normalizePhone } from '../utils/phoneUtils';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { clsx } from 'clsx';
import { db } from '../db';
import { motion } from 'framer-motion';
import { EditorHeader } from './EditorHeader';
import { CampaignStats } from './CampaignStats';
import { FilterTabs } from './FilterTabs';

export const Editor = ({ campaignId, onBack }) => {
  const [contacts, setContacts] = useState([]);
  const [template, setTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [campaignName, setCampaignName] = useState('Campaign');
  const [isSaving, setIsSaving] = useState(false);
  const [country, setCountry] = useState('CL'); // Default country

  // ... useEffects

  const handleDataLoaded = async (data) => {
    const newContacts = data.map((row, idx) => {
      const keys = Object.keys(row);
      const phoneKey = keys.find(k => /tel|phone|cel|movil/i.test(k)) || 'Telefono';
      let rawPhone = row[phoneKey];
      
      if (!rawPhone) {
         const possible = keys.find(k => String(row[k]).replace(/[^0-9]/g, '').length > 7);
         if (possible) rawPhone = row[possible];
      }

      // Pass selected country to normalizePhone
      const { formatted, isValid, display } = normalizePhone(rawPhone, country);

      return {
        id: `${Date.now()}-${idx}`,
        data: { ...row, _phoneDisplay: display, _phoneE164: formatted, _isValid: isValid },
        status: 'pending',
        sentAt: null
      };
    });
    
    // Check blacklist ...
    const checkedContacts = await Promise.all(newContacts.map(async c => {
        if (c.data._isValid && c.data._phoneE164) {
            const isBlocked = await db.isBlacklisted(c.data._phoneE164);
            if (isBlocked) {
                return { ...c, status: 'optout' };
            }
        }
        return c;
    }));
    
    setContacts(prev => [...prev, ...checkedContacts]); 
    toast.success(`Added ${checkedContacts.length} contacts (${country})`);
  };
  
  const handleBlock = async (contact) => {
      if (!contact.data._phoneE164) return toast.error("No valid phone to block");
      if (confirm(`Block ${contact.data._phoneE164} from future campaigns?`)) {
          await db.addToBlacklist(contact.data._phoneE164);
          setContacts(prev => prev.map(c => 
              c.id === contact.id ? { ...c, status: 'optout' } : c
          ));
          toast.success("Number added to blacklist");
      }
  };

  const handleBounce = (contact) => {
      setContacts(prev => prev.map(c => 
          c.id === contact.id ? { ...c, status: 'bounced' } : c
      ));
      toast('Marked as Invalid/Bounced', { icon: '🚫' });
  };

  const handleSaveTemplate = async (name, text) => {
    const newTpl = { name, text };
    await db.saveTemplate(newTpl);
    setTemplates(prev => [...prev, newTpl]);
    toast.success('Template saved');
  };

  const handleDeleteTemplate = async (name) => {
    // We need ID for delete, but our simplistic manager passed name. 
    // Adapting for now to find by name or refactor manager.
    // Let's assume name is unique for simple UX or find the object.
    const tpl = templates.find(t => t.name === name);
    if (tpl) {
        await db.deleteTemplate(tpl.id || tpl.name); // IDB auto-generates ID usually.
        // Wait, I defined keyPath 'id' autoIncrement.
        // I need to reload templates to get IDs or use name as key.
        // Let's reload for consistency.
        const tpls = await db.getTemplates();
        setTemplates(tpls);
        toast.success('Template deleted');
    }
  };

  const handleLoadTemplate = (t) => {
    setTemplate(t.text);
    toast.success(`Loaded "${t.name}"`);
  };

  const generateLink = (contact) => {
    let msg = template;
    Object.keys(contact.data).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'gi');
        msg = msg.replace(regex, contact.data[key] || '');
    });
    
    let phone = contact.data._phoneE164;
    if (!contact.data._isValid) {
         const keys = Object.keys(contact.data);
         const phoneKey = keys.find(k => /tel|phone|cel|movil/i.test(k)) || 'Telefono';
         phone = contact.data[phoneKey] || '';
    }
    const cleanPhone = String(phone || '').replace(/[^0-9]/g, ''); 
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleSend = (contact) => {
    if (!contact.data._isValid) {
        toast.error("Invalid phone number format");
    }
    const link = generateLink(contact);
    window.open(link, '_blank');
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, status: 'sent', sentAt: new Date().toISOString() } : c
    ));
    toast.success("Message link opened");
  };

  const handleExport = () => {
    if (contacts.length === 0) return toast.error("No data to export");
    const exportData = contacts.map(c => ({
      ...c.data,
      Status: c.status,
      SentTime: c.sentAt ? new Date(c.sentAt).toLocaleString() : ''
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${campaignName}_Report.xlsx`);
    toast.success("Report downloaded!");
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.altKey && e.key === 'Enter') {
            const nextPending = contacts.find(c => c.status === 'pending');
            if (nextPending) {
                e.preventDefault();
                handleSend(nextPending);
                toast('Sending next...', { icon: '🚀' });
            } else {
                toast("No more pending contacts!");
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contacts, template]); 

  const filteredContacts = contacts.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'pending') return c.status === 'pending';
    if (filter === 'sent') return c.status === 'sent';
    if (filter === 'error') return c.status === 'failed' || !c.data._isValid;
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen w-full text-white p-4 md:p-8 font-sans"
    >
       <div className="max-w-6xl mx-auto space-y-8 backdrop-blur-sm">
        
        {/* Header */}
        <EditorHeader 
            campaignName={campaignName} 
            isSaving={isSaving} 
            onBack={onBack} 
            onExport={handleExport} 
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card p-4 rounded-lg bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
               <div className="flex items-center gap-2 mb-2 text-whatsapp-light">
                 <Zap size={18} />
                 <span className="font-bold text-sm text-glow">Speed Mode Active</span>
               </div>
               <p className="text-xs text-gray-300">Use <code className="bg-white/10 px-1 rounded text-white">Alt + Enter</code> to send to the next pending contact automatically.</p>
            </div>

            <div className="glass-card p-4 rounded-lg">
                <CountrySelector selected={country} onChange={setCountry} />
                <FileUploader onDataLoaded={handleDataLoaded} />
            </div>
            
            <div>
                <TemplateManager 
                    currentTemplate={template}
                    templates={templates}
                    onSave={handleSaveTemplate}
                    onLoad={handleLoadTemplate}
                    onDelete={handleDeleteTemplate}
                />
                <MessageEditor 
                  template={template} 
                  setTemplate={setTemplate} 
                  contacts={contacts} 
                />
            </div>
            
            {/* Stats */}
            <CampaignStats contacts={contacts} />
          </div>

          {/* Right Column: Data Table */}
          <div className="md:col-span-2 space-y-4">
            {/* Filter Tabs */}
            <FilterTabs 
                filter={filter} 
                setFilter={setFilter} 
                contacts={contacts} 
            />

            <ContactTable 
                contacts={filteredContacts} 
                onSend={handleSend} 
                onBlock={handleBlock}
                onBounce={handleBounce}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
