import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { db, Campaign } from '../db';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { DashboardHeader } from './DashboardHeader';
import { CreateCampaignModal } from './CreateCampaignModal';
import { CampaignCard } from './CampaignCard';
import { EmptyCampaignState } from './EmptyCampaignState';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const list = await db.getAllCampaigns();
    
    // Load contacts for each campaign to show stats
    const listWithContacts = await Promise.all(list.map(async (c) => {
      if (c.id !== undefined) {
        c.contacts = await db.getContactsByCampaign(c.id);
      }
      return c;
    }));

    // Sort by newest first
    setCampaigns(listWithContacts.reverse());
  };

  const handleCreate = async (name: string) => {
    try {
      const id = await db.createCampaign(name);
      toast.success(t('dashboard.created'));
      navigate(`/campaign/${id}`);
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
              onOpenBlacklist={() => navigate('/blacklist')} 
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
                      onClick={(id) => navigate(`/campaign/${id}`)}
                      onDelete={handleDelete} 
                   />
                 );
             })}
          </div>
       </div>
    </motion.div>
  );
};
