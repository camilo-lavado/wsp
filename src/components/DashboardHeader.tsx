import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface DashboardHeaderProps {
  onOpenBlacklist: () => void;
  onNewCampaign: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenBlacklist, onNewCampaign }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-6 gap-4">
       <div>
          <h1 className="text-3xl font-bold text-gray-100">{t('dashboard.title')}</h1>
          <p className="text-gray-400 mt-1">{t('dashboard.subtitle')}</p>
       </div>
       <div className="flex gap-3 items-center">
           <LanguageSwitcher />
           <button 
              onClick={onOpenBlacklist}
              className="glass-card hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg transition-colors"
           >
              {t('dashboard.blacklist')}
           </button>
           <button 
              onClick={onNewCampaign}
              className="bg-whatsapp-dark hover:bg-whatsapp-teal text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-whatsapp-teal/50"
           >
              <Plus size={20} />
              {t('dashboard.newCampaign')}
           </button>
       </div>
    </div>
  );
};
