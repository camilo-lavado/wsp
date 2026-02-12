import React, { useEffect, useState } from 'react';
import { db, BlacklistEntry } from '../db';
import { Search, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BlacklistTable } from './BlacklistTable';

interface BlacklistManagerProps {
  onBack: () => void;
}

export const BlacklistManager: React.FC<BlacklistManagerProps> = ({ onBack }) => {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBlacklist();
  }, []);

  const loadBlacklist = async () => {
    const list = await db.getBlacklist();
    // Sort by addedAt desc
    setBlacklist(list.sort((a,b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()));
  };

  const handleUnblock = async (phone: string) => {
    if (confirm(`Unblock ${phone}? This number will be allowed in future campaigns.`)) {
        await db.removeFromBlacklist(phone);
        setBlacklist(prev => prev.filter(item => item.phone !== phone));
        toast.success(`Unblocked ${phone}`);
    }
  };

  const filteredList = blacklist.filter(item => item.phone.includes(search));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen w-full bg-[#111b21] text-white p-4 md:p-8 font-sans"
    >
       <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-6">
             <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
                <ArrowLeft size={24} />
             </button>
             <div>
                <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
                    <ShieldAlert className="text-red-500" />
                    Blacklist Manager
                </h1>
                <p className="text-gray-400 mt-1">Manage blocked numbers and opt-outs.</p>
             </div>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search phone number..." 
                className="w-full glass-card rounded-lg pl-10 pr-4 py-3 text-white focus:border-whatsapp-light outline-none transition-colors placeholder-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="glass-card rounded-lg overflow-hidden">
             <BlacklistTable 
                entries={filteredList} 
                onUnblock={handleUnblock} 
            />
          </div>
       </div>
    </motion.div>
  );
};
