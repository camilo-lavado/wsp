import React from 'react';
import { Ghost } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyCampaignStateProps {
  onCreate: () => void;
}

export const EmptyCampaignState: React.FC<EmptyCampaignStateProps> = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-20 text-gray-500">
        <Ghost size={48} className="mx-auto mb-4 opacity-30" />
        <p>{t('dashboard.empty.title')}</p>
        <p className="text-sm">{t('dashboard.empty.subtitle')}</p>
    </div>
  );
};
