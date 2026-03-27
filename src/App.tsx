import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { BlacklistManager } from './components/BlacklistManager';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="bg-[#111b21] min-h-screen text-white">
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/campaign/:id" element={<Editor />} />
                <Route path="/blacklist" element={<BlacklistManager />} />
            </Routes>
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;
