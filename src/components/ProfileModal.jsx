import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  LogOut, 
  User, 
  ShieldCheck, 
  Award, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  ChevronRight, 
  Leaf, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Lock
} from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, impact, logout, showToast } = useApp();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  if (!isOpen) return null;

  const handleConfirmSignOut = () => {
    setShowSignOutConfirm(false);
    onClose();
    logout();
    showToast('🚪 Anda telah berhasil keluar dari akun (Sign Out).');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        onClick={() => {
          if (!showSignOutConfirm) onClose();
        }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Main Sheet / Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Top Handle & Close Header */}
        <div className="pt-3 px-5 pb-2 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Profil & Pengaturan Akun</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold truncate text-white">{user.name}</h2>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950">
                    Lv. {user.level}
                  </span>
                </div>
                <div className="text-xs text-blue-200 truncate">{user.division}</div>
                <div className="text-[11px] text-blue-300/80 font-mono mt-0.5">ID: 80192834 • Verified Member</div>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-3 pt-3 border-t border-white/15">
              <div className="flex justify-between text-[11px] text-blue-200 mb-1 font-medium">
                <span>{user.rankTitle}</span>
                <span>{user.currentXp} / {user.maxXp} XP</span>
              </div>
              <div className="w-full h-1.5 bg-blue-950/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"
                  style={{ width: `${Math.min(100, (user.currentXp / user.maxXp) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-medium">Saldo Koin</div>
              <div className="text-sm font-extrabold text-blue-700 font-['Outfit'] mt-0.5">
                🪙 {user.ecoCoins}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-medium">Sampah Setor</div>
              <div className="text-sm font-extrabold text-emerald-600 font-['Outfit'] mt-0.5">
                {impact.totalKgTrash} kg
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-medium">Trust Score</div>
              <div className="text-sm font-extrabold text-amber-600 font-['Outfit'] mt-0.5">
                {user.trustScore}%
              </div>
            </div>
          </div>

          {/* Account Menu Items */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Pengaturan & Keamanan
            </div>

            <button 
              type="button"
              onClick={() => showToast('Rekening Bank / E-Wallet Terhubung: 1234567890 (Budi Pratama)')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Rekening Bank & E-Wallet</div>
                  <div className="text-[10px] text-slate-500">Auto-cair saldo voucher & loyalty</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              type="button"
              onClick={() => showToast('Notifikasi WhatsApp & Email Aktif')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Notifikasi & WhatsApp Alert</div>
                  <div className="text-[10px] text-slate-500">Pemberitahuan Drop Pass & Koin</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              type="button"
              onClick={() => showToast('Helpdesk Sustainability & Support: support@t2c-eco.id')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Bantuan & FAQ Eco Support</div>
                  <div className="text-[10px] text-slate-500">Panduan pilah sampah & Smart Bin</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Keluar Akun (Sign Out)</span>
            </button>
          </div>
        </div>

        {/* Sign Out Confirmation Overlay Dialog */}
        {showSignOutConfirm && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-5 z-20 animate-fade-in">
            <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-2xl border border-slate-200 text-center space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <LogOut className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Keluar dari Akun?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin keluar dari aplikasi T2C? Anda dapat masuk kembali kapan saja.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(false)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignOut}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
