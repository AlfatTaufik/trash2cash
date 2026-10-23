import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEADERBOARD_INDIVIDUAL, LEADERBOARD_DIVISIONS } from '../data/mockData';
import { Trophy, Users, User, Medal, Crown } from 'lucide-react';

export const Leaderboard = () => {
  const { user } = useApp();
  const [tab, setTab] = useState('INDIVIDUAL'); // INDIVIDUAL or DIVISION

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1">
        <button
          onClick={() => setTab('INDIVIDUAL')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            tab === 'INDIVIDUAL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Peringkat Individu
        </button>
        <button
          onClick={() => setTab('DIVISION')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            tab === 'DIVISION'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Liga Divisi & Tim
        </button>
      </div>

      {tab === 'INDIVIDUAL' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Leaderboard Bulan Ini</span>
            <span className="text-[10px] text-slate-400 font-medium">Reset 28 Hari</span>
          </div>

          <div className="divide-y divide-slate-100">
            {LEADERBOARD_INDIVIDUAL.map((item) => {
              const isFirst = item.rank === 1;
              const isSecond = item.rank === 2;
              const isThird = item.rank === 3;
              return (
                <div
                  key={item.rank}
                  className={`p-3 flex items-center justify-between text-xs transition-colors ${
                    item.isCurrentUser ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-bold text-xs ${
                      isFirst ? 'text-amber-500' : isSecond ? 'text-slate-400' : isThird ? 'text-amber-700' : 'text-slate-400'
                    }`}>
                      #{item.rank}
                    </span>

                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">
                      {item.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{item.name}</span>
                        {item.isCurrentUser && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.division}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-blue-600">{item.xp.toLocaleString()} XP</div>
                    <div className="text-[10px] text-slate-400">{item.trashKg} kg sampah</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'DIVISION' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Peringkat Divisi Perusahaan</span>
          </div>

          <div className="divide-y divide-slate-100">
            {LEADERBOARD_DIVISIONS.map((div) => {
              return (
                <div key={div.rank} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-bold text-slate-500">#{div.rank}</span>
                    <span className="text-lg">{div.icon}</span>
                    <div>
                      <div className="font-bold text-slate-900">{div.name}</div>
                      <div className="text-[10px] text-slate-500">{div.members} Anggota • {div.prizeBonus}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-emerald-600">{div.totalTrashKg} kg</div>
                    <div className="text-[10px] text-slate-400">{div.co2SavedKg} kg CO₂</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
