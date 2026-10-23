import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REWARD_MARKETPLACE } from '../data/mockData';
import { 
  ShoppingBag, 
  Ticket, 
  Copy, 
  Check, 
  QrCode,
  Sparkles
} from 'lucide-react';

export const Marketplace = () => {
  const { user, myVouchers, redeemReward, setActiveBottomSheet, triggerHaptic } = useApp();
  const [subTab, setSubTab] = useState('CATALOG'); // 'CATALOG' or 'MY_VOUCHERS'
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    triggerHaptic([30]);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenVoucherSheet = (voucher) => {
    triggerHaptic([30]);
    setActiveBottomSheet({ type: 'VOUCHER', data: voucher });
  };

  return (
    <div className="space-y-3.5">
      {/* Sub Tabs */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1">
        <button
          onClick={() => {
            triggerHaptic([20]);
            setSubTab('CATALOG');
          }}
          className={`flex-1 min-h-[44px] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'CATALOG'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Katalog Hadiah
        </button>
        <button
          onClick={() => {
            triggerHaptic([20]);
            setSubTab('MY_VOUCHERS');
          }}
          className={`flex-1 min-h-[44px] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'MY_VOUCHERS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Voucher Saya ({myVouchers.length})
        </button>
      </div>

      {/* CATALOG */}
      {subTab === 'CATALOG' && (
        <div className="space-y-2.5">
          {REWARD_MARKETPLACE.map((reward) => {
            const canAfford = user.ecoCoins >= reward.costCoins;
            return (
              <div
                key={reward.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0">
                    {reward.partnerLogo}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400">{reward.partner}</span>
                    <h4 className="font-bold text-slate-900 truncate">{reward.title}</h4>
                    <div className="text-[11px] font-extrabold text-blue-600">
                      🪙 {reward.costCoins} Koin <span className="text-[10px] font-normal text-slate-400">({reward.originalValue})</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => redeemReward(reward)}
                  disabled={!canAfford}
                  className={`min-h-[44px] px-4 rounded-xl font-bold text-xs flex-shrink-0 transition-all active:scale-95 ${
                    canAfford
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  {canAfford ? 'Tukar' : 'Kurang Koin'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MY VOUCHERS */}
      {subTab === 'MY_VOUCHERS' && (
        <div className="space-y-2.5">
          {myVouchers.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="text-3xl">🎟️</div>
              <div className="text-xs font-bold text-slate-900">Belum Ada Voucher Aktif</div>
              <p className="text-[11px] text-slate-500">Tukarkan koinmu dengan voucher kopi atau saldo di tab katalog.</p>
            </div>
          ) : (
            myVouchers.map((v) => (
              <div
                key={v.id}
                onClick={() => handleOpenVoucherSheet(v)}
                className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs space-y-2 text-xs cursor-pointer hover:border-blue-400 transition-all active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{v.logo}</span>
                    <div>
                      <div className="font-bold text-slate-900">{v.title}</div>
                      <div className="text-[10px] text-slate-400">{v.partner} • Ketuk untuk Barcode</div>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AKTIF
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between border border-slate-200">
                  <span className="font-mono font-bold text-blue-700 text-xs">{v.code}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopy(v.code, e)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[10px] font-semibold"
                    >
                      {copiedCode === v.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCode === v.code ? 'Tersalin' : 'Salin'}
                    </button>
                    <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                      <QrCode className="w-3.5 h-3.5" /> Barcode
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
