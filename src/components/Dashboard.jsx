import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ScanLine, 
  QrCode, 
  ArrowRight, 
  Leaf, 
  Scale, 
  Trees, 
  Zap, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Droplets,
  Sparkles
} from 'lucide-react';

export const Dashboard = ({ setActiveTab }) => {
  const { user, impact, dropPasses, activities, setActiveBottomSheet, hasDewToHarvest, harvestDew, triggerHaptic } = useApp();

  const xpPercent = Math.min(100, Math.round((user.currentXp / user.maxXp) * 100));

  const handleOpenPass = (pass) => {
    triggerHaptic([30]);
    setActiveBottomSheet({ type: 'DROP_PASS', data: pass });
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Clean Impact Stats (Budget Tracker Metric Cards) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Sampah</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold text-slate-900 font-['Outfit']">{impact.totalKgTrash}</span>
            <span className="text-[10px] text-slate-400 font-medium ml-0.5">kg</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>CO₂ Saved</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold text-emerald-600 font-['Outfit']">{impact.totalCo2Saved}</span>
            <span className="text-[10px] text-slate-400 font-medium ml-0.5">kg</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Trees className="w-3.5 h-3.5 text-teal-600" />
            <span>Pohon</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold text-teal-600 font-['Outfit']">{impact.treesEquivalent}</span>
            <span className="text-[10px] text-slate-400 font-medium ml-0.5">btg</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Eco-Tree Widget with Micro-Delight */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div 
              onClick={() => {
                triggerHaptic([40]);
                if (hasDewToHarvest) harvestDew();
              }}
              className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shadow-xs cursor-pointer active:scale-95 transition-transform relative"
              title="Ketuk untuk berinteraksi dengan pohon"
            >
              🌳
              {hasDewToHarvest && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-white animate-pulse"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs">Pohon Kehidupan (Tahap 3/5)</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">
                  1.2x Boost
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                {hasDewToHarvest ? '💧 Ada embun koin siap dipanen!' : 'Tumbuh sehat & subur'}
              </div>
            </div>
          </div>

          {hasDewToHarvest ? (
            <button
              onClick={harvestDew}
              className="py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all active:scale-95"
            >
              <Droplets className="w-3.5 h-3.5" />
              +5 Koin
            </button>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              Level {user.level}
            </span>
          )}
        </div>

        {/* Level XP Progress bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>{user.currentXp} / {user.maxXp} XP</span>
            <span>{xpPercent}% Menuju Level {user.level + 1}</span>
          </div>
        </div>
      </div>

      {/* 3. Active Drop Pass Section with Bottom Sheet trigger */}
      {dropPasses.length > 0 && (
        <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs space-y-2 bg-gradient-to-r from-blue-50/40 via-emerald-50/30 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              Drop Pass Terverifikasi ({dropPasses.length})
            </span>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              SIAP SCAN DI LOKASI
            </span>
          </div>

          {dropPasses.map((pass) => (
            <div
              key={pass.id}
              onClick={() => handleOpenPass(pass)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 flex items-center justify-between cursor-pointer transition-all shadow-xs active:scale-98"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{pass.itemTitle}</div>
                <div className="text-[10px] text-slate-500">
                  {pass.weightKg} kg • <span className="font-bold text-emerald-600">+{pass.coins} Koin (Rp {pass.rupiahValue?.toLocaleString('id-ID')})</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-100">
                <QrCode className="w-3.5 h-3.5" />
                <span>Buka QR</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Transaction Statement (Clean Budget Tracker List Style) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Riwayat Mutasi Koin</span>
          <span className="text-[10px] text-slate-400 font-medium">Real-time Statement</span>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.map((act) => {
            const isEarn = act.type === 'DROP_SUCCESS';
            return (
              <div key={act.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    isEarn ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {isEarn ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 line-clamp-1">{act.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{act.timestamp}</span>
                      <span>•</span>
                      <span>{act.tag}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {isEarn ? (
                    <div>
                      <div className="font-extrabold text-emerald-600 text-xs">+{act.coinsEarned} 🪙</div>
                      <div className="text-[9px] text-slate-400">≈ +Rp {act.rupiahEquivalent?.toLocaleString('id-ID')}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-extrabold text-rose-600 text-xs">-{act.coinsSpent} 🪙</div>
                      <div className="text-[9px] text-slate-400">Ditukar</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
