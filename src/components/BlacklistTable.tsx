import React from 'react';
import { Trash2 } from 'lucide-react';
import { BlacklistEntry } from '../db';

interface BlacklistTableProps {
  entries: BlacklistEntry[];
  onUnblock: (phone: string) => void;
}

export const BlacklistTable: React.FC<BlacklistTableProps> = ({ entries, onUnblock }) => {
  if (entries.length === 0) {
    return (
        <div className="text-center py-12 text-gray-400">
            <p>No matches found.</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-900/60 text-xs uppercase text-gray-400 backdrop-blur-md">
                <tr>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3">Date Added</th>
                    <th className="px-6 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
                {entries.map((item) => (
                    <tr key={item.phone} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 font-mono text-white/90">{item.phone}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{item.reason || 'Manual Block'}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                            {item.addedAt ? new Date(item.addedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => onUnblock(item.phone)}
                                className="text-gray-500 hover:text-green-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                title="Unblock Number"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};
