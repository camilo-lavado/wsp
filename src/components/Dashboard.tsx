import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { db, Campaign } from '../db';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { DashboardHeader } from './DashboardHeader';
import { CreateCampaignModal } from './CreateCampaignModal';
import { CampaignCard } from './CampaignCard';
import { EmptyCampaignState } from './EmptyCampaignState';

interface DashboardProps {
  onSelectCampaign: (id: number) => void;
  onOpenBlacklist: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectCampaign, onOpenBlacklist }) => {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const list = await db.getAllCampaigns();
    // Sort by newest first
    setCampaigns(list.reverse());
  };

  const handleCreate = async (name: string) => {
    try {
      const id = await db.createCampaign(name);
      toast.success(t('dashboard.created'));
      onSelectCampaign(id);
    } catch (e) {
      toast.error(t('dashboard.createError'));
      console.error(e);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm(t('dashboard.deleteConfirm'))) {
        await db.deleteCampaign(id);
        loadCampaigns();
        toast.success(t('dashboard.deleted'));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen w-full text-white p-4 md:p-8 font-sans"
    >
       <div className="max-w-6xl mx-auto space-y-8 backdrop-blur-sm">
          <DashboardHeader 
              onOpenBlacklist={onOpenBlacklist} 
              onNewCampaign={() => setIsCreating(true)} 
          />

          <CreateCampaignModal 
              isOpen={isCreating} 
              onClose={() => setIsCreating(false)} 
              onCreate={handleCreate} 
          />

          {/* List */}
          <div className="space-y-4">
             {campaigns.length === 0 && !isCreating && (
                 <EmptyCampaignState onCreate={() => setIsCreating(true)} />
             )}
             
             {campaigns.map(c => {
                 if (c.id === undefined) return null;
                 return (
                   <CampaignCard 
                      key={c.id} 
                      campaign={c} 
                      onClick={onSelectCampaign} 
                      onDelete={handleDelete} 
                   />
                 );
             })}
          </div>
       </div>
    </motion.div>
  );
};
