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
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700/50 text-gray-300 text-sm whitespace-pre-wrap min-h-[60px]">
          {preview || <span className="text-gray-600 italic">No content...</span>}
        </div>
      </div>
    </div>
  );
};
