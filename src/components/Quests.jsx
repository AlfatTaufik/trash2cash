import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  CheckCircle2, 
  Gift, 
  Sparkles, 
  Award,
  ChevronRight
} from 'lucide-react';

export const Quests = ({ setActiveTab }) => {
  const { user, quests, badges, claimQuestReward, applySpinReward } = useApp();
  const [hasSpun, setHasSpun] = useState(false);

  const handleSimpleSpin = () => {
    if (hasSpun) return;
    setHasSpun(true);
    applySpinReward({ type: 'coins', value: 50, label: '+50 Coins' });
  };

  return (
    <div className="space-y-4">
      {/* Streak Tracker Header */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
            🔥
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Streak {user.streakDays} Hari Berturut-turut</div>
            <div className="text-[10px] text-slate-500">1.2x Pengganda Koin Aktif</div>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
          Streak Berjalan
        </span>
      </div>

      {/* Daily Quests List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Daftar Misi Harian</span>
          <span className="text-[10px] text-slate-400 font-medium">Reset 24 Jam</span>
        </div>

        <div className="divide-y divide-slate-100">
          {quests.map((q) => {
            return (
              <div key={q.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{q.title}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {q.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{q.description}</p>
                  <div className="text-[10px] font-bold text-blue-600">+{q.rewardCoins} Koin • +{q.rewardXp} XP</div>
                </div>

                <div className="flex-shrink-0">
                  {q.isClaimed ? (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      Diklaim
                    </span>
                  ) : q.isCompleted ? (
                    <button
                      onClick={() => claimQuestReward(q.id)}
                      className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Klaim
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('prescan')}
                      className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                    >
                      Mulai
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean Lucky Daily Gift Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎁</div>
          <div>
            <div className="text-xs font-bold text-slate-900">Bonus Hadiah Harian</div>
            <div className="text-[10px] text-slate-500">Ambil 10 koin gratis (Rp 1.000) setiap hari</div>
          </div>
        </div>

        <button
          onClick={handleSimpleSpin}
          disabled={hasSpun}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            hasSpun
              ? 'bg-slate-200 text-slate-500 cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
          }`}
        >
          {hasSpun ? 'Sudah Diambil' : 'Klaim +10'}
        </button>
      </div>

      {/* Badges List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Lencana Pencapaian
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            {badges.filter(b => b.unlocked).length}/{badges.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                b.unlocked ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/40 border-slate-100 opacity-50'
              }`}
            >
              <span className="text-xl flex-shrink-0">{b.icon}</span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-[11px] truncate">{b.name}</div>
                <div className="text-[9px] text-slate-400 truncate">
                  {b.unlocked ? 'Terbuka' : b.progress}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
