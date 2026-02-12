import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { BlacklistManager } from './components/BlacklistManager';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

type ViewState = 'dashboard' | 'editor' | 'blacklist';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [activeCampaignId, setActiveCampaignId] = useState<number | null>(null);

  const handleSelectCampaign = (id: number) => {
    setActiveCampaignId(id);
    setCurrentView('editor');
  };

  const handleOpenBlacklist = () => {
    setCurrentView('blacklist');
  };

  const handleBackToDashboard = () => {
    setActiveCampaignId(null);
    setCurrentView('dashboard');
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="bg-[#111b21] min-h-screen text-white">
        <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
                <Dashboard 
                    key="dashboard"
                    onSelectCampaign={handleSelectCampaign} 
                    onOpenBlacklist={handleOpenBlacklist}
                />
            )}
            {currentView === 'editor' && (
                <Editor 
                    key="editor"
                    campaignId={activeCampaignId} 
                    onBack={handleBackToDashboard} 
                />
            )}
            {currentView === 'blacklist' && (
                <BlacklistManager 
                    key="blacklist"
                    onBack={handleBackToDashboard} 
                />
            )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
