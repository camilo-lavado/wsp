import React, { useState } from 'react';
import { Save, FileText, Trash2, Plus, ChevronDown } from 'lucide-react';

export const TemplateManager = ({ currentTemplate, onLoad, onSave, onDelete, templates }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    if (!newName.trim()) return;
    onSave(newName, currentTemplate);
    setNewName('');
    setIsSaving(false);
  };

  return (
    <div className="mb-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-xs font-semibold text-gray-400 uppercase">Templates</h3>
         <button 
           onClick={() => setIsSaving(!isSaving)}
           className="text-xs text-whatsapp-light hover:text-white flex items-center gap-1"
         >
           <Plus size={12} /> New
         </button>
      </div>

      {isSaving && (
        <div className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="Template Name (e.g. Promo)" 
            className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-whatsapp-light outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button 
            onClick={handleSave}
            disabled={!newName.trim()}
            className="bg-whatsapp-dark text-white px-3 py-1 rounded text-xs hover:bg-whatsapp-teal disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {templates.length === 0 && !isSaving && (
           <span className="text-gray-600 text-xs italic">No templates saved.</span>
        )}
        {templates.map(t => (
          <div key={t.name} className="group flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-2 py-1.5 rounded-md border border-gray-600 transition-colors cursor-pointer">
            <div className="flex items-center gap-2" onClick={() => onLoad(t)}>
                <FileText size={12} className="text-blue-400" />
                <span className="text-xs text-gray-200">{t.name}</span>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(t.name); }}
                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
