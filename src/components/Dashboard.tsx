import React, { useEffect, useState } from 'react';
import { db, Campaign } from '../db';
import { Plus, Clock, ChevronRight, Trash2, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface DashboardProps {
  onSelectCampaign: (id: number) => void;
  onOpenBlacklist: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectCampaign, onOpenBlacklist }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const list = await db.getAllCampaigns();
    // Sort by newest first
    setCampaigns(list.reverse());
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const id = await db.createCampaign(newName);
      toast.success('Campaign created');
      onSelectCampaign(id);
    } catch (e) {
      toast.error('Failed to create campaign');
      console.error(e);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Delete this campaign totally?')) {
        await db.deleteCampaign(id);
        loadCampaigns();
        toast.success('Campaign deleted');
    }
  };

  const getStats = (c: Campaign) => {
    const total = c.contacts?.length || 0;
    const sent = c.contacts?.filter(x => x.status === 'sent').length || 0;
    const percent = total > 0 ? Math.round((sent / total) * 100) : 0;
    return { total, sent, percent };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen w-full text-white p-4 md:p-8 font-sans"
    >
       <div className="max-w-6xl mx-auto space-y-8 backdrop-blur-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-6 gap-4">
             <div>
                <h1 className="text-3xl font-bold text-gray-100">Campaign Dashboard</h1>
                <p className="text-gray-400 mt-1">Manage your messaging campaigns</p>
             </div>
             <div className="flex gap-3">
                 <button 
                    onClick={onOpenBlacklist}
                    className="glass-card hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg transition-colors"
                 >
                    Blacklist
                 </button>
                 <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-whatsapp-dark hover:bg-whatsapp-teal text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-whatsapp-teal/50"
                 >
                    <Plus size={20} />
                    New Campaign
                 </button>
             </div>
          </div>

          {/* Create Modal Area */}
          <AnimatePresence>
            {isCreating && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-8"
                >
                    <div className="glass-card p-6 rounded-xl border border-white/10">
                        <h3 className="text-lg font-bold mb-4 text-glow">Create New Campaign</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                           <input 
                              autoFocus
                              type="text" 
                              placeholder="Campaign Name (e.g. October Promo)" 
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
                                  Start
                               </button>
                               <button 
                                  onClick={() => setIsCreating(false)}
                                  className="text-gray-400 hover:text-white px-4 py-2"
                               >
                                  Cancel
                               </button>
                           </div>
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          <div className="space-y-4">
             {campaigns.length === 0 && !isCreating && (
                 <div className="text-center py-20 text-gray-500">
                     <Ghost size={48} className="mx-auto mb-4 opacity-30" />
                     <p>No active campaigns</p>
                     <p className="text-sm">Click "New Campaign" to begin.</p>
                 </div>
             )}
             
             {campaigns.map(c => {
                 // Ensure ID is present for key and handling
                 if (c.id === undefined) return null;
                 const stats = getStats(c);
                 return (
                   <div 
                      key={c.id}
                      onClick={() => c.id !== undefined && onSelectCampaign(c.id)}
                      className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
                   >
                      <div className="absolute top-0 left-0 w-1 h-full bg-whatsapp-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h3 className="text-xl font-bold text-gray-100 group-hover:text-whatsapp-light transition-colors">{c.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                <Clock size={14} />
                                <span>{new Date(c.updatedAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button
                                onClick={(e) => { e.stopPropagation(); c.id !== undefined && handleDelete(e, c.id); }}
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
                              {stats.sent} / {stats.total} sent ({stats.percent}%)
                          </div>
                      </div>
                   </div>
                 );
             })}
          </div>
       </div>
    </motion.div>
  );
};
