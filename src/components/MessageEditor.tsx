import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Contact } from '../db';
import { VariablePicker } from './VariablePicker';
import { MessagePreview } from './MessagePreview';

interface MessageEditorProps {
  template: string;
  setTemplate: React.Dispatch<React.SetStateAction<string>>;
  contacts?: Contact[];
}

export const MessageEditor: React.FC<MessageEditorProps> = ({ template, setTemplate, contacts = [] }) => {
  const [preview, setPreview] = useState('');

  const getAvailableVars = () => {
      if (contacts.length === 0) return ['name', 'phone'];
      const contactData = contacts[0].data || {};
      return Object.keys(contactData).filter(k => !k.startsWith('_'));
  };

  const vars = getAvailableVars();

  useEffect(() => {
    if (contacts.length > 0) {
      let msg = template;
      const contact = contacts[0];
      const data = contact.data || {};
      
      Object.keys(data).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'gi'); // Case insensitive replacement
        msg = msg.replace(regex, data[key] || '');
      });
      setPreview(msg);
    } else {
      setPreview(template);
    }
  }, [template, contacts]);

  const insertVariable = (varName: string) => {
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
        <VariablePicker availableVars={vars} onInsert={insertVariable} />
      </div>

      <MessagePreview previewText={preview} />
    </div>
  );
};
