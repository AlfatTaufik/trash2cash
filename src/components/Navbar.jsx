import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Coins, 
  Flame, 
  ShieldCheck, 
  ScanLine, 
  Box, 
  Trophy, 
  ShoppingBag, 
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, dropPasses } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prescan', label: 'AI Pre-Scan', icon: ScanLine, badge: 'Solusi Utama' },
    { id: 'smartbin', label: 'Smart Bin Sim', icon: Box, count: dropPasses.length },
    { id: 'quests', label: 'Misi & Gamifikasi', icon: Flame },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'marketplace', label: 'Reward Store', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      {/* Top status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 border-b border-slate-800/40 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Prototype T2C (Trash-to-Cash)
          </span>
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI Verifier Active (Pre-Approval Enabled)
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Trust Score */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-500/20 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Trust Score:</span>
            <span className="font-black text-emerald-400">{user.trustScore}%</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="font-black">{user.streakDays} Hari</span>
            <span className="hidden md:inline text-[10px] text-amber-400/80 font-medium">(1.2x Boost)</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <span className="text-xl">🌱</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white font-['Outfit',sans-serif]">
                EcoReward <span className="text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">T2C</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Turn Trash into Points & Rewards</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>

                {item.badge && (
                  <span className="hidden xl:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {item.badge}
                  </span>
                )}

                {item.count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Wallet & Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Eco Coins */}
          <div 
            onClick={() => setActiveTab('marketplace')}
            className="cursor-pointer group flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 hover:border-amber-400/60 px-3 py-1.5 rounded-xl transition-all shadow-sm shadow-amber-500/10"
            title="Klik untuk belanja di Reward Store"
          >
            <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-inner">
              🪙
            </div>
            <div>
              <div className="text-[10px] font-medium text-amber-400/80 leading-tight">Eco-Coins</div>
              <div className="text-sm font-black text-amber-300 font-['Outfit'] leading-tight">
                {user.ecoCoins.toLocaleString()}
              </div>
            </div>
          </div>

          {/* User Level & Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-base shadow-inner">
              {user.avatar}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
              <div className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                <span>Lv. {user.level}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{user.division}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
