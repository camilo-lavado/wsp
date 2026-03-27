import React from 'react';
import { Save, Download, ArrowLeft, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EditorHeaderProps {
  campaignName: string;
  isSaving: boolean;
  onBack: () => void;
  onExport: () => void;
  onCleanDuplicates: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ campaignName, isSaving, onBack, onExport, onCleanDuplicates }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center bg-gray-900/40 p-4 rounded-xl border border-white/5 shadow-lg">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {campaignName}
            {isSaving && <span className="text-xs font-normal text-gray-500 animate-pulse"><Save size={12} className="inline mr-1"/>Saving...</span>}
          </h1>
          <p className="text-gray-400 text-sm">Editor View</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onCleanDuplicates}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-sm border border-gray-700"
          title={t('editor.cleanDuplicatesTitle')}
        >
          <Trash2 size={16} />
          {t('editor.cleanDuplicates')}
        </button>
        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-whatsapp-dark text-white hover:bg-whatsapp-teal transition-all text-sm shadow-lg"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
};
