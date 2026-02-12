import React, { useState, useEffect } from 'react';
import { FileUploader } from './components/FileUploader';
import { MessageEditor } from './components/MessageEditor';
import { ContactTable } from './components/ContactTable';
import { LayoutDashboard, Save, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'wsp_sender_state_v1';

function App() {
  const [contacts, setContacts] = useState([]);
  const [template, setTemplate] = useState('Hola {nombre}, este es un mensaje de prueba.');
  
  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContacts(parsed.contacts || []);
        setTemplate(parsed.template || '');
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save state on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ contacts, template }));
  }, [contacts, template]);

  const handleDataLoaded = (data) => {
    // Map raw data to contact objects with status
    // Basic ID generation using timestamp + index
    const newContacts = data.map((row, idx) => ({
      id: `${Date.now()}-${idx}`,
      data: row,
      status: 'pending',
      sentAt: null
    }));
    setContacts(newContacts);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setContacts([]);
      setTemplate('');
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const generateLink = (contact) => {
    let msg = template;
    // Replace variables
    Object.keys(contact.data).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'gi');
        msg = msg.replace(regex, contact.data[key] || '');
    });
    
    // Find phone number
    // Heuristic: look for 'telefon', 'phone', 'celular', 'movil' or just first column that looks like a number?
    // For now, check specific keys or first key that has "phone" or "tel" in name.
    const keys = Object.keys(contact.data);
    const phoneKey = keys.find(k => /tel|phone|cel|movil/i.test(k)) || 'Telefono'; // Default to 'Telefono' if not found
    
    let phone = contact.data[phoneKey];
    if (!phone) {
      // Fallback: try to find any field with numbers > 7 digits
       const possible = keys.find(k => String(contact.data[k]).replace(/[^0-9]/g, '').length > 7);
       if (possible) phone = contact.data[possible];
    }
    
    const cleanPhone = String(phone || '').replace(/[^0-9]/g, ''); // basic cleanup
    
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleSend = (contact) => {
    const link = generateLink(contact);
    window.open(link, '_blank');
    
    // Update status
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, status: 'sent', sentAt: new Date().toISOString() } : c
    ));
  };

  return (
    <div className="min-h-screen w-full bg-[#242424] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-whatsapp-dark p-2 rounded-lg">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">WhatsApp Sender</h1>
              <p className="text-gray-400 text-sm">Operative Dashboard</p>
            </div>
          </div>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-gray-400 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900 border border-transparent transition-all text-sm"
          >
            <Trash2 size={16} />
            Clear Data
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="md:col-span-1 space-y-6">
            <FileUploader onDataLoaded={handleDataLoaded} />
            <MessageEditor 
              template={template} 
              setTemplate={setTemplate} 
              contacts={contacts} 
            />
            
            {/* Stats */}
            <div className="bg-surface-card p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Campaign Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded">
                  <span className="block text-2xl font-mono text-white">{contacts.length}</span>
                  <span className="text-xs text-gray-500">Total</span>
                </div>
                <div className="bg-whatsapp-dark/20 p-3 rounded border border-whatsapp-dark/30">
                  <span className="block text-2xl font-mono text-whatsapp-light">
                    {contacts.filter(c => c.status === 'sent').length}
                  </span>
                  <span className="text-xs text-green-400/70">Sent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Data Table */}
          <div className="md:col-span-2">
            <ContactTable contacts={contacts} onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
