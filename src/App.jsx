import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { BottomSheetPass } from './components/BottomSheetPass';
import { ProfileModal } from './components/ProfileModal';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { Dashboard } from './components/Dashboard';
import { PreScan } from './components/PreScan';
import { SmartBinSim } from './components/SmartBinSim';
import { Quests } from './components/Quests';
import { Leaderboard } from './components/Leaderboard';
import { Marketplace } from './components/Marketplace';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    toast, 
    isAuthenticated, 
    authView, 
    setAuthView, 
    isProfileOpen, 
    setIsProfileOpen,
    logout 
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex justify-center selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 z-50 max-w-xs px-4">
          <div className="p-3 rounded-xl bg-slate-900 text-white shadow-lg flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <span>{toast.type === 'error' ? '❌' : '✓'}</span>
            <div>{toast.message}</div>
          </div>
        </div>
      )}

      {/* Clean Mobile Ratio Container */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col shadow-sm border-x border-slate-200/80 relative">
        {/* Conditional Screen Rendering based on Authentication */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col">
            {authView === 'signin' ? (
              <SignIn onSwitchToSignUp={() => setAuthView('signup')} />
            ) : (
              <SignUp onSwitchToSignIn={() => setAuthView('signin')} />
            )}
          </div>
        ) : (
          <>
            {/* Top Header & EcoWallet Card */}
            <AndroidTopBar setActiveTab={setActiveTab} />

            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4">
              {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
              {activeTab === 'prescan' && <PreScan onPassGenerated={() => {}} />}
              {activeTab === 'smartbin' && <SmartBinSim setActiveTab={setActiveTab} />}
              {activeTab === 'quests' && <Quests setActiveTab={setActiveTab} />}
              {activeTab === 'leaderboard' && <Leaderboard />}
              {activeTab === 'marketplace' && <Marketplace />}
            </main>

            {/* Bottom Navigation Bar */}
            <AndroidBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Material 3 Bottom Sheet Modal for QR / Vouchers */}
            <BottomSheetPass setActiveTab={setActiveTab} />

            {/* Profile & Sign Out Bottom Sheet / Modal */}
            <ProfileModal 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

