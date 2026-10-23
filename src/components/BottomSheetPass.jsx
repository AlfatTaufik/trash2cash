import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const BottomSheetPass = ({ setActiveTab }) => {
  const { activeBottomSheet, setActiveBottomSheet, completeDrop, triggerHaptic } = useApp();
  const [copied, setCopied] = useState(false);

  if (!activeBottomSheet) return null;

  const { type, data } = activeBottomSheet;
  const isPass = type === 'DROP_PASS';

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    triggerHaptic([30]);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstantDrop = () => {
    if (isPass) {
      completeDrop(data.id);
      setActiveBottomSheet(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={() => setActiveBottomSheet(null)}></div>

      {/* Material 3 Bottom Sheet Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-t-3xl p-5 space-y-4 shadow-2xl border-t border-slate-200 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Android Bottom Sheet Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2"></div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{isPass ? '🎟️' : '🎁'}</span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isPass ? 'Pre-Approved Drop Pass' : 'Voucher Hadiah Digital'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {isPass ? 'Tunjukkan QR ini di depan sensor Smart Bin' : 'Gunakan saat transaksi pembayaran'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveBottomSheet(null)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR / Barcode Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-xs">
            {/* High-fidelity Clean QR Graphic */}
            <div className="w-36 h-36 mx-auto bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
              <QrCode className="w-28 h-28 text-white stroke-[1.5]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 rounded-md bg-blue-600 border border-white text-[9px] font-black text-white flex items-center justify-center shadow">
                  T2C
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-slate-700 mt-2 block tracking-wider">
              {isPass ? data.id : data.code}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900">{data.itemTitle || data.title}</div>
            <div className="text-[11px] text-slate-500">
              {isPass ? (
                <>
                  Berat: <span className="font-semibold text-slate-700">{data.weightKg} kg</span> • Nilai: <span className="font-bold text-emerald-600">+{data.coins} Koin (Rp {data.rupiahValue?.toLocaleString('id-ID')})</span>
                </>
              ) : (
                <>
                  Mitra: <span className="font-semibold text-slate-700">{data.partner}</span> • Berlaku s/d: <span className="text-slate-600">{data.validUntil}</span>
                </>
              )}
            </div>
          </div>

          {/* Code copy box if Voucher */}
          {!isPass && (
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-mono font-bold text-blue-700 text-sm">{data.code}</span>
              <button
                onClick={() => handleCopy(data.code)}
                className="py-1 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          )}
        </div>

        {/* Action Button: Quick test deposit */}
        {isPass ? (
          <div className="space-y-2">
            <button
              onClick={handleInstantDrop}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <Check className="w-4 h-4" />
              Simulasi Setor di Smart Bin Sekarang (Cairkan {data.coins} Koin)
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Drop Pass ini berlaku di seluruh Smart Bin Eco Tower.
            </p>
          </div>
        ) : (
          <button
            onClick={() => setActiveBottomSheet(null)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            Tutup
          </button>
        )}
      </div>
    </div>
  );
};
