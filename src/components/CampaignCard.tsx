import React from 'react';
import { Campaign } from '../db';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (id: number) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick, onDelete }) => {
  const { t, i18n } = useTranslation();

  const getStats = (c: Campaign) => {
    const total = c.contacts?.length || 0;
    const sent = c.contacts?.filter(x => x.status === 'sent').length || 0;
    const percent = total > 0 ? Math.round((sent / total) * 100) : 0;
    return { total, sent, percent };
  };

  const stats = getStats(campaign);

  return (
    <div 
       onClick={() => campaign.id !== undefined && onClick(campaign.id)}
       className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
    >
       <div className="absolute top-0 left-0 w-1 h-full bg-whatsapp-dark opacity-0 group-hover:opacity-100 transition-opacity" />
       
       <div className="flex justify-between items-start mb-4">
           <div>
               <h3 className="text-xl font-bold text-gray-100 group-hover:text-whatsapp-light transition-colors">{campaign.name}</h3>
               <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                 <Clock size={14} />
                 <span>{new Date(campaign.updatedAt || Date.now()).toLocaleDateString(i18n.language)}</span>
               </div>
           </div>
           <div className="flex items-center gap-2">
              <button
                 onClick={(e) => { e.stopPropagation(); campaign.id !== undefined && onDelete(e, campaign.id); }}
                 className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors z-10"
              >
                 <Trash2 size={18} />
              </button>
              <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
           </div>
       </div>

       {/* Progress and Stats */}
       <div className="flex items-center gap-4">
           <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-whatsapp-light shadow-[0_0_10px_rgba(37,211,102,0.5)]" 
                  style={{ width: `${stats.percent}%` }}
               ></div>
           </div>
           <div className="text-sm text-gray-400 min-w-[120px] text-right">
               {t('dashboard.stats', { sent: stats.sent, total: stats.total, percent: stats.percent })}
           </div>
       </div>
    </div>
  );
};
