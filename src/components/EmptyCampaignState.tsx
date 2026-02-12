import React from 'react';
import { Ghost } from 'lucide-react';

interface EmptyCampaignStateProps {
  onCreate: () => void;
}

export const EmptyCampaignState: React.FC<EmptyCampaignStateProps> = () => {
  return (
    <div className="text-center py-20 text-gray-500">
        <Ghost size={48} className="mx-auto mb-4 opacity-30" />
        <p>No active campaigns</p>
        <p className="text-sm">Click "New Campaign" to begin.</p>
    </div>
  );
};
