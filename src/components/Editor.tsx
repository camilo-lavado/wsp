import React, { useState, useEffect } from 'react';
import { FileUploader } from './FileUploader';
import { MessageEditor } from './MessageEditor';
import { ContactTable } from './ContactTable';
import { CountrySelector, CountrySelection } from './CountrySelector';
import { TemplateManager } from './TemplateManager';
import { Zap } from 'lucide-react';
import { normalizePhone } from '../utils/phoneUtils';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { db, Contact, Template } from '../db';
import { motion } from 'framer-motion';
import { EditorHeader } from './EditorHeader';
import { CampaignStats } from './CampaignStats';
import { FilterTabs } from './FilterTabs';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useCampaign } from '../hooks/useCampaign';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const campaignId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [filter, setFilter] = useState('all');
  const [country, setCountry] = useState<CountrySelection>('CL'); // Default country

  const { campaignName, contacts, setContacts, template, setTemplate, isSaving } = useCampaign(campaignId);
  const { templates, handleSaveTemplate, handleDeleteTemplate, handleLoadTemplate } = useTemplateManager(setTemplate);


  const handleDataLoaded = async (data: any[]) => {
    // 1. Get currently existing phone numbers in the campaign to a Set for O(1) lookup
    const existingPhones = new Set<string>();
    contacts.forEach(c => {
      if (c.data._phoneE164) {
         existingPhones.add(c.data._phoneE164);
      }
    });

    let duplicateCount = 0;

    const newContacts: Contact[] = [];
    
    data.forEach((row, idx) => {
      const keys = Object.keys(row);
      const phoneKey = keys.find(k => /tel|phone|cel|movil/i.test(k)) || 'Telefono';
      let rawPhone = row[phoneKey];
      
      if (!rawPhone) {
         const possible = keys.find(k => String(row[k]).replace(/[^0-9]/g, '').length > 7);
         if (possible) rawPhone = row[possible];
      }

      // Pass selected country to normalizePhone
      const { formatted, isValid, display } = normalizePhone(rawPhone, country === 'XX' ? undefined : country);
      
      // Duplicate detection
      if (formatted && existingPhones.has(formatted)) {
        duplicateCount++;
        return; // Skip adding this contact
      }

      if (formatted) {
        existingPhones.add(formatted); // Add to set so we catch duplicates within the same CSV upload
      }

      newContacts.push({
        id: `${Date.now()}-${idx}`,
        data: { ...row, _phoneDisplay: display, _phoneE164: formatted, _isValid: isValid },
        status: 'pending',
        sentAt: null
      });
    });
    
    // Check blacklist ...
    const checkedContacts = await Promise.all(newContacts.map(async c => {
        if (c.data && c.data._isValid && c.data._phoneE164) {
            const isBlocked = await db.isBlacklisted(c.data._phoneE164);
            if (isBlocked) {
                return { ...c, status: 'optout' } as Contact;
            }
        }
        return c;
    }));
    
    setContacts(prev => [...prev, ...checkedContacts]); 
    
    if (duplicateCount > 0) {
      toast(`${duplicateCount} duplicated numbers skipped`, { icon: 'ℹ️' });
    }
    if (checkedContacts.length > 0) {
      toast.success(t('editor.addedContacts', { count: checkedContacts.length, country }));
    }
  };
  
  const handleBlock = async (contact: Contact) => {
      if (!contact.data._phoneE164) return toast.error(t('editor.noValidPhone'));
      if (confirm(t('editor.blockConfirm', { phone: contact.data._phoneE164 }))) {
          await db.addToBlacklist(contact.data._phoneE164);
          setContacts(prev => prev.map(c => 
              c.id === contact.id ? { ...c, status: 'optout' } : c
          ));
          toast.success(t('editor.blocked'));
      }
  };

  const handleBounce = (contact: Contact) => {
      setContacts(prev => prev.map(c => 
          c.id === contact.id ? { ...c, status: 'bounced' } : c
      ));
      toast(t('editor.markedBounced'), { icon: '🚫' });
  };

  const generateLink = (contact: Contact) => {
    let msg = template;
    Object.keys(contact.data).forEach(key => {
        const escapedKey = String(key).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\{${escapedKey}\\}`, 'gi');
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

  const handleSend = (contact: Contact) => {
    if (!contact.data._isValid) {
        toast.error(t('editor.invalidPhone'));
    }
    const link = generateLink(contact);
    window.open(link, '_blank');
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, status: 'sent', sentAt: new Date().toISOString() } : c
    ));
    toast.success(t('editor.linkOpened'));
  };

  const handleExport = () => {
    if (contacts.length === 0) return toast.error(t('editor.noDataExport'));
    const exportData = contacts.map(c => ({
      ...c.data,
      Status: c.status,
      SentTime: c.sentAt ? new Date(c.sentAt).toLocaleString() : ''
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${campaignName}_Report.xlsx`);
    toast.success(t('editor.reportDownloaded'));
  };

  const handleCleanDuplicates = () => {
    const existingPhones = new Set<string>();
    const uniqueContacts: Contact[] = [];
    let duplicatesRemoved = 0;

    contacts.forEach(c => {
      const phone = c.data._phoneE164;
      if (phone && existingPhones.has(phone)) {
        duplicatesRemoved++;
        // Optionally, if we want to delete them from DB right away, we could.
        // But the auto-save will handle updating the state, and the DB cleanup
        // happens naturally since we replace the entire Contacts list.
      } else {
        if (phone) existingPhones.add(phone);
        uniqueContacts.push(c);
      }
    });

    if (duplicatesRemoved > 0) {
      setContacts(uniqueContacts);
      toast.success(t('editor.removedDuplicates', { count: duplicatesRemoved }));
    } else {
      toast(t('editor.noDuplicatesFound'), { icon: '✨' });
    }
  };

  // Keyboard Shortcuts
  useKeyboardShortcuts(contacts, handleSend);

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
            onBack={() => navigate('/')} 
            onExport={handleExport} 
            onCleanDuplicates={handleCleanDuplicates}
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
                    onSave={async (name, text) => { await handleSaveTemplate(name, text); }}
                    onLoad={handleLoadTemplate}
                    onDelete={async (name) => { await handleDeleteTemplate(name); }}
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
