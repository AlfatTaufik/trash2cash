import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Box, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  MapPin, 
  Clock 
} from 'lucide-react';

export const SmartBinSim = ({ setActiveTab }) => {
  const { dropPasses, completeDrop } = useApp();

  const [selectedPassId, setSelectedPassId] = useState(dropPasses[0]?.id || null);
  const [binState, setBinState] = useState('IDLE'); // IDLE, DEPOSITING, SUCCESS
  const [completedItem, setCompletedItem] = useState(null);

  const selectedPass = dropPasses.find((p) => p.id === selectedPassId);

  const handleDeposit = () => {
    if (!selectedPass) return;
    setBinState('DEPOSITING');

    setTimeout(() => {
      const item = { ...selectedPass };
      completeDrop(selectedPass.id);
      setCompletedItem(item);
      setBinState('SUCCESS');
      setSelectedPassId(null);
    }, 1500);
  };

  const handleReset = () => {
    setBinState('IDLE');
    setCompletedItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Location Banner */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Smart Bin Eco Hub (Lantai 14)</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              Sensor Timbangan Terhubung
            </div>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          ONLINE
        </span>
      </div>

      {/* Passes List or Empty state */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-600 px-1">Pilih Drop Pass yang Ingin Disetor:</span>

        {dropPasses.length === 0 && binState !== 'SUCCESS' ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center space-y-2">
            <div className="text-2xl">🎟️</div>
            <div className="text-xs font-bold text-slate-800">Tidak Ada Drop Pass Aktif</div>
            <p className="text-[11px] text-slate-500">
              Lakukan AI Pre-Scan terlebih dahulu untuk mendapatkan tiket setor.
            </p>
            <button
              onClick={() => setActiveTab('prescan')}
              className="py-1.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1 mt-1"
            >
              Buka AI Pre-Scan
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {dropPasses.map((pass) => {
              const isSelected = selectedPassId === pass.id;
              return (
                <div
                  key={pass.id}
                  onClick={() => binState === 'IDLE' && setSelectedPassId(pass.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{pass.itemTitle}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {pass.id} • {pass.weightKg} kg • Berlaku {pass.expiresAt}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-blue-700">+{pass.coins} Koin</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulator Machine Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-4">
        {binState === 'IDLE' && (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl mx-auto">
              📲
            </div>
            <div className="text-xs text-slate-600">
              {selectedPass
                ? `Tiket ${selectedPass.id} siap dipindai ke sensor.`
                : 'Pilih salah satu tiket di atas untuk memulai penyetoran.'}
            </div>

            {selectedPass && (
              <button
                onClick={handleDeposit}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <QrCode className="w-4 h-4" />
                Scan Tiket QR & Masukkan Sampah
              </button>
            )}
          </div>
        )}

        {binState === 'DEPOSITING' && (
          <div className="py-6 space-y-2">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-xs font-bold text-slate-800">Menimbang & Memproses Koin...</div>
          </div>
        )}

        {binState === 'SUCCESS' && completedItem && (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Penyetoran Selesai!</div>
              <div className="text-xs text-emerald-600 font-bold mt-0.5">
                +{completedItem.coins} Koin & +{completedItem.xp} XP Masuk ke Saldo
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Setor Lagi
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Tukar Hadiah
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
