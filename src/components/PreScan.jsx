import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_WASTE_ITEMS } from '../data/mockData';
import { 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  QrCode, 
  Check, 
  Layers, 
  Scale, 
  Info,
  ShieldCheck,
  ShieldAlert,
  Zap
} from 'lucide-react';

export const PreScan = ({ onPassGenerated }) => {
  const { issueDropPass, triggerHaptic } = useApp();

  const [selectedItem, setSelectedItem] = useState(PRESET_WASTE_ITEMS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedItem, setAnalyzedItem] = useState(PRESET_WASTE_ITEMS[0]);
  const [lastGeneratedPass, setLastGeneratedPass] = useState(null);

  const handleSelectItem = (item) => {
    triggerHaptic([30]);
    setSelectedItem(item);
    setIsAnalyzing(true);
    setLastGeneratedPass(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedItem(item);
    }, 600);
  };

  const handleIssuePass = () => {
    if (analyzedItem.status === 'REJECTED') return;
    const pass = issueDropPass(analyzedItem);
    setLastGeneratedPass(pass);
    if (onPassGenerated) onPassGenerated(pass);
  };

  const isEligible = analyzedItem.status === 'ELIGIBLE';
  const rupiahValue = analyzedItem.estimatedCoins * 100;

  return (
    <div className="space-y-3.5">
      {/* Title & Value Proposition */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-blue-600" />
          AI Pre-Scan Verifikator
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Verifikasi kebersihan & kunci nilai koin di rumah sebelum menyetor. Dijamin tidak akan ditolak!
        </p>
      </div>

      {/* Preset Item Selector (Large 48dp Touch Targets) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-700 px-1">Pilih Sampel Foto Sampah:</span>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_WASTE_ITEMS.map((item) => {
            const isSelected = selectedItem.id === item.id;
            const isRejected = item.status === 'REJECTED';
            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`min-h-[52px] p-2.5 rounded-xl border text-left transition-all flex items-center justify-between active:scale-98 ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5 pr-1">
                  <div className="text-[11px] font-bold text-slate-900 line-clamp-1">{item.name}</div>
                  <div className={`text-[10px] font-semibold ${isRejected ? 'text-rose-600' : 'text-blue-700'}`}>
                    {isRejected ? 'Tercemar Minyak (0 Koin)' : `+${item.estimatedCoins} Koin (Rp ${(item.estimatedCoins * 100).toLocaleString('id-ID')})`}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Viewfinder Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden flex items-center justify-center">
          <img src={selectedItem.imageUrl} alt="Sample" className="w-full h-full object-cover" />

          {/* Clean Box Overlay */}
          {!isAnalyzing && (
            <div className={`absolute inset-4 rounded-xl border-2 border-dashed flex flex-col justify-between p-2.5 ${
              isEligible ? 'border-emerald-400 bg-emerald-500/10' : 'border-rose-400 bg-rose-500/10'
            }`}>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded self-start ${
                isEligible ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {isEligible ? `CONFIDENCE ${analyzedItem.confidenceScore}%` : 'REJECTED: CONTAMINATED'}
              </span>
              <span className="text-[9px] font-medium bg-black/75 text-white px-2 py-0.5 rounded self-end">
                {analyzedItem.boundingInfo}
              </span>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              Menganalisis Mutu Sampah...
            </div>
          )}
        </div>

        {/* Inspection Result Card */}
        <div className="p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-medium">Material Terdeteksi</span>
              <div className="text-xs font-bold text-slate-900">{analyzedItem.category}</div>
            </div>

            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isEligible ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {isEligible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {isEligible ? 'Lolos Verifikasi' : 'Tidak Lolos'}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 leading-snug">
            <span className="font-bold text-slate-800">Ulasan AI: </span>
            {analyzedItem.aiFeedback}
          </div>

          {/* Reward estimation with explicit Rupiah Conversion */}
          {isEligible ? (
            <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs">
              <div>
                <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Nilai Hadiah Terkunci</span>
                <div className="font-black text-blue-900 text-sm mt-0.5">
                  🪙 +{analyzedItem.estimatedCoins} Koin <span className="text-xs font-bold text-emerald-600 ml-1">(≈ Rp {rupiahValue.toLocaleString('id-ID')})</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-medium">Estimasi Berat</span>
                <div className="font-bold text-slate-800 text-xs">{analyzedItem.weightKg} kg</div>
              </div>
            </div>
          ) : null}

          {/* 48dp Minimum Touch Target Button */}
          {isEligible ? (
            <button
              onClick={handleIssuePass}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <QrCode className="w-4 h-4" />
              <span>Terbitkan Drop Pass & Buka QR (Kunci Rp {rupiahValue.toLocaleString('id-ID')})</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full min-h-[48px] py-3 px-4 rounded-xl font-medium text-xs bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            >
              Sampah Kotor - Bilas Dulu & Scan Ulang
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
