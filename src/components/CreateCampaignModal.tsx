import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName);
      setNewName('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
        >
            <div className="glass-card p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-glow">{t('modal.title')}</h3>
                <div className="flex flex-col md:flex-row gap-4">
                   <input 
                      autoFocus
                      type="text" 
                      placeholder={t('modal.namePlaceholder')} 
                      className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-whatsapp-light outline-none"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                   />
                   <div className="flex gap-2">
                       <button 
                          onClick={handleCreate}
                          className="bg-whatsapp-light hover:bg-white text-[#111b21] font-bold px-6 py-2 rounded-lg transition-colors"
                       >
                          {t('modal.create')}
                       </button>
                       <button 
                          onClick={onClose}
                          className="text-gray-400 hover:text-white px-4 py-2"
                       >
                          {t('modal.cancel')}
                       </button>
                   </div>
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
