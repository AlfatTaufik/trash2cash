import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  Trophy, 
  ScanLine, 
  QrCode, 
  Droplets,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Bell
} from 'lucide-react';

export const AndroidTopBar = ({ setActiveTab }) => {
  const { user, hasDewToHarvest, harvestDew, dropPasses, setIsProfileOpen } = useApp();

  return (
    <div className="bg-white px-4 pt-3 pb-4 space-y-3.5 border-b border-slate-100">
      {/* User Info Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3 text-left group p-1 -ml-1 rounded-2xl hover:bg-slate-50 transition-colors"
          title="Buka Profil & Pengaturan Akun"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
            {user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {user.name}
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                Lv. {user.level}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Eco Innovation • <span className="text-blue-600 font-semibold underline underline-offset-2">Profil & Keluar</span>
            </div>
          </div>
        </button>

        {/* Action Badges: Streak & Rank */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 text-amber-700 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{user.streakDays} Hari</span>
          </div>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all"
            title="Peringkat"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Clean Eco Gradient Budget Tracker Card */}
      <div className="rounded-2xl eco-gradient-card p-4 text-white shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-blue-100 font-medium">Saldo Eco-Coins</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black font-['Outfit'] tracking-tight">
                🪙 {user.ecoCoins.toLocaleString()}
              </span>
              <span className="text-xs text-blue-200 font-medium">
                ≈ Rp {(user.ecoCoins * 100).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-800/80 text-blue-200 border border-blue-400/30">
            Trust: {user.trustScore}%
          </span>
        </div>

        {/* Income / Expense Style Stats */}
        <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-blue-900/40 px-2.5 py-1.5 rounded-xl">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
            <div>
              <div className="text-[10px] text-blue-200">Total Terkumpul</div>
              <div className="font-bold text-white text-[11px]">+520 Koin (Rp 52rb)</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-blue-900/40 px-2.5 py-1.5 rounded-xl">
            <TrendingDown className="w-3.5 h-3.5 text-rose-300" />
            <div>
              <div className="text-[10px] text-blue-200">Total Ditukar</div>
              <div className="font-bold text-white text-[11px]">-180 Koin (Rp 18rb)</div>
            </div>
          </div>
        </div>

        {/* 4 Clean Quick Actions */}
        <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-4 gap-2 text-center">
          <button
            onClick={() => setActiveTab('prescan')}
            className="flex flex-col items-center gap-1 py-1 rounded-xl hover:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center shadow-sm">
              <ScanLine className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white">AI Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('smartbin')}
            className="flex flex-col items-center gap-1 py-1 rounded-xl hover:bg-white/10 transition-all relative"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white">Drop Pass</span>
            {dropPasses.length > 0 && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className="flex flex-col items-center gap-1 py-1 rounded-xl hover:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white">Tukar</span>
          </button>

          <button
            onClick={harvestDew}
            disabled={!hasDewToHarvest}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${
              hasDewToHarvest ? 'hover:bg-white/10' : 'opacity-60 cursor-default'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              hasDewToHarvest ? 'bg-amber-400 text-slate-900 shadow-sm animate-pulse' : 'bg-white/10 text-white'
            }`}>
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white">
              {hasDewToHarvest ? '+5 Koin' : 'Panen'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
