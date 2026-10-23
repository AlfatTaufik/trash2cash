import React from 'react';
import { useApp } from '../context/AppContext';
import { TREE_STAGES } from '../data/mockData';
import { Sparkles, Droplets, Info, ArrowUpRight } from 'lucide-react';

export const EcoTree = () => {
  const { user, hasDewToHarvest, harvestDew } = useApp();

  // Determine stage based on user level
  const currentStageIndex = Math.min(Math.floor((user.level - 1) / 2), TREE_STAGES.length - 1);
  const currentStage = TREE_STAGES[currentStageIndex];
  const nextStage = TREE_STAGES[currentStageIndex + 1];

  const xpPercent = Math.min(100, Math.round((user.currentXp / user.maxXp) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-emerald-950/20 to-slate-900/90 border border-emerald-500/20 p-6 shadow-2xl backdrop-blur-xl">
      {/* Background ambient light */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Tree Display & Animation */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Aura */}
            <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-400/20 to-emerald-300/10 animate-pulse-glow"></div>

            {/* Tree Stage Graphic */}
            <div className="relative z-10 w-36 h-36 rounded-full bg-slate-900/80 border-2 border-emerald-500/30 flex flex-col items-center justify-center p-4 shadow-inner">
              <div className="text-5xl md:text-6xl animate-float drop-shadow-[0_10px_20px_rgba(16,185,129,0.4)]">
                {currentStage.graphic}
              </div>
              <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Tahap {currentStage.stage}/5
              </span>
            </div>

            {/* Daily Dew collector floating button */}
            {hasDewToHarvest && (
              <button
                onClick={harvestDew}
                className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 animate-bounce hover:scale-110 transition-transform"
                title="Panen embun koin harian!"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>+25 Koin</span>
              </button>
            )}
          </div>

          <h3 className="mt-3 text-lg font-black text-white font-['Outfit']">
            {currentStage.name}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mt-0.5">
            {currentStage.description}
          </p>
        </div>

        {/* Level Progression & Multiplier Perks */}
        <div className="flex-1 w-full max-w-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Pohon Kehidupan Virtual
              </span>
              <h4 className="text-xl font-black text-white font-['Outfit']">
                Level {user.level} • {user.rankTitle}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Total XP</span>
              <div className="text-sm font-black text-emerald-300">
                {user.currentXp} <span className="text-slate-500">/ {user.maxXp} XP</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-950/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-700 relative overflow-hidden"
                style={{ width: `${xpPercent}%` }}
              >
                <div className="absolute inset-0 shimmer-badge"></div>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{xpPercent}% menuju Level {user.level + 1}</span>
              {nextStage && (
                <span className="text-emerald-400 font-medium">
                  Tahap berikutnya di Lv. {nextStage.minLevel}
                </span>
              )}
            </div>
          </div>

          {/* Tree Passive Perks */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                ✨
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Bonus Multiplier</div>
                <div className="text-xs font-bold text-slate-200">1.2x Poin Aktif</div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                💧
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Panen Embun Harian</div>
                <div className="text-xs font-bold text-slate-200">
                  {hasDewToHarvest ? 'Tersedia Sekarang' : 'Sudah Dipanen'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
