import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  ScanLine, 
  Box, 
  Flame, 
  ShoppingBag
} from 'lucide-react';

export const AndroidBottomNav = ({ activeTab, setActiveTab }) => {
  const { dropPasses } = useApp();

  return (
    <div className="sticky bottom-0 w-full z-40 bg-white border-t border-slate-200 px-2 py-2">
      <div className="max-w-md mx-auto flex items-center justify-between relative px-2">
        {/* Tab 1: Beranda */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Beranda</span>
        </button>

        {/* Tab 2: Smart Bin */}
        <button
          onClick={() => setActiveTab('smartbin')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
            activeTab === 'smartbin' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Box className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Smart Bin</span>
          {dropPasses.length > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center">
              {dropPasses.length}
            </span>
          )}
        </button>

        {/* Center AI Scan Button (Clean Blue Circle FAB) */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => setActiveTab('prescan')}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-md transition-all active:scale-95 ${
              activeTab === 'prescan'
                ? 'bg-blue-700 text-white ring-4 ring-blue-100'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <ScanLine className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[8px] font-bold">SCAN</span>
          </button>
        </div>

        {/* Tab 3: Misi */}
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'quests' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Misi</span>
        </button>

        {/* Tab 4: Hadiah */}
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'marketplace' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Hadiah</span>
        </button>
      </div>
    </div>
  );
};
