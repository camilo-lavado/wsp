import React from 'react';
import { Contact } from '../db';

interface CampaignStatsProps {
  contacts: Contact[];
}

export const CampaignStats: React.FC<CampaignStatsProps> = ({ contacts }) => {
  return (
    <div className="bg-surface-card p-4 rounded-lg border border-gray-700">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Campaign Progress</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-3 rounded">
          <span className="block text-2xl font-mono text-white">{contacts.length}</span>
          <span className="text-xs text-gray-500">Total</span>
        </div>
        <div className="bg-whatsapp-dark/20 p-3 rounded border border-whatsapp-dark/30">
          <span className="block text-2xl font-mono text-whatsapp-light">
            {contacts.filter(c => c.status === 'sent').length}
          </span>
          <span className="text-xs text-green-400/70">Sent</span>
        </div>
      </div>
    </div>
  );
};
