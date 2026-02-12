import React, { useState, useEffect } from 'react';
import { RefreshCw, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';

export const MessageEditor = ({ template, setTemplate, contacts = [] }) => {
  const [preview, setPreview] = useState('');

  // Extract variables from the first contact to show as available
  const availableVars = contacts.length > 0 ? Object.keys(contacts[0]).filter(k => k !== 'id' && k !== 'status' && k !== 'sentAt') : ['name', 'phone'];

  useEffect(() => {
    if (contacts.length > 0) {
      let msg = template;
      const contact = contacts[0];
      Object.keys(contact).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'gi'); // Case insensitive replacement
        msg = msg.replace(regex, contact[key] || '');
      });
      setPreview(msg);
    } else {
      setPreview(template);
    }
  }, [template, contacts]);

  const insertVariable = (varName) => {
    setTemplate(prev => prev + `{${varName}}`);
  };

  return (
    <div className="bg-surface-card p-6 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-whatsapp-light" />
        <h2 className="text-xl font-semibold text-white">Message Template</h2>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">Editor</label>
        <textarea
          className="w-full h-32 bg-gray-800 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-whatsapp-light focus:border-transparent font-mono text-sm"
          placeholder="Hello {name}, here is your update..."
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {availableVars.map(v => (
            <button 
              key={v}
              onClick={() => insertVariable(v)}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
            >
              &#123;{v}&#125;
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-400">Preview (First Contact)</label>
          <button className="text-gray-500 hover:text-white" title="Refresh Preview">
            <RefreshCw size={14} />
          </button>
        </div>
        <div className="bg-whatsapp-dark/10 p-4 rounded-lg border border-whatsapp-dark/20 text-gray-200 text-sm whitespace-pre-wrap min-h-[60px] relative">
          {/* Mock WhatsApp Bubble Style */}
          <div className="bg-[#202c33] p-2 rounded-br-none rounded-lg inline-block max-w-full shadow-sm">
             {preview ? (
                preview.split('\n').map((line, i) => (
                  <div key={i} className="min-h-[1.2em]">
                    {line.split(/(\*.*?\*|_.*?_|~.*?~)/g).map((part, j) => {
                      if (part.startsWith('*') && part.endsWith('*')) return <strong key={j} className="font-bold text-gray-100">{part.slice(1, -1)}</strong>;
                      if (part.startsWith('_') && part.endsWith('_')) return <em key={j} className="italic text-gray-100">{part.slice(1, -1)}</em>;
                      if (part.startsWith('~') && part.endsWith('~')) return <del key={j} className="opacity-70">{part.slice(1, -1)}</del>;
                      return <span key={j}>{part}</span>;
                    })}
                  </div>
                ))
             ) : <span className="text-gray-500 italic">No content...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
