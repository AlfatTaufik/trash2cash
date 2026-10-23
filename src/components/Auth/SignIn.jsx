import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  KeyRound,
  ArrowRight,
  Leaf
} from 'lucide-react';

export const SignIn = ({ onSwitchToSignUp }) => {
  const { login, showToast } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrNip: 'budi.pratama@company.com',
    password: 'password123',
    rememberMe: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.emailOrNip || !formData.password) {
      showToast('Mohon isi email/ID Pengguna dan password', 'error');
      return;
    }
    // Preview login logic
    login({
      name: 'Budi Pratama',
      division: 'Divisi Digital Innovation',
      avatar: '👨‍💼',
      ecoCoins: 340,
      level: 3
    });
    showToast('👋 Selamat datang kembali, Budi Pratama!');
  };

  const handleQuickDemoLogin = (role) => {
    if (role === 'budi') {
      login({
        name: 'Budi Pratama',
        division: 'Divisi Digital Innovation',
        avatar: '👨‍💼',
        ecoCoins: 340,
        level: 3
      });
      showToast('Masuk sebagai Budi Pratama (Digital Innovation)');
    } else {
      login({
        name: 'Citra Kirana',
        division: 'Divisi Sustainability',
        avatar: '👩‍💼',
        ecoCoins: 580,
        level: 4
      });
      showToast('Masuk sebagai Citra Kirana (Sustainability)');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 py-6 bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-600/20 text-white font-bold">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 font-['Outfit']">
                  EcoReward <span className="text-blue-600">T2C</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ESG App
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Trash to Cash Innovation</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Secure SSO
          </span>
        </div>

        {/* Greeting Banner */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Selamat Datang 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Masuk dengan akun Anda untuk mulai setor sampah anorganik dan kumpulkan <span className="text-blue-600 font-semibold">Eco-Coins</span>.
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email / ID Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email / ID Karyawan
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.emailOrNip}
                onChange={(e) => setFormData({ ...formData, emailOrNip: e.target.value })}
                placeholder="nama.lengkap@company.com atau 80123456"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => showToast('Tautan reset password dikirim ke email terdaftar', 'levelup')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Lupa Sandi?
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan kata sandi akun Anda"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600 font-medium">Ingat akun saya di perangkat ini</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white text-xs font-bold shadow-md shadow-blue-700/25 hover:shadow-lg hover:shadow-blue-700/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Akun</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white/80 px-2 tracking-wider">
            atau gunakan
          </div>
        </div>

        {/* Corporate SSO Action */}
        <button
          type="button"
          onClick={() => {
            login({
              name: 'Budi Pratama',
              division: 'Divisi Digital Innovation',
              avatar: '👨‍💼',
              ecoCoins: 340,
              level: 3
            });
            showToast('🔐 Login Berhasil dengan Single Sign-On');
          }}
          className="w-full py-2.5 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50/70 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <KeyRound className="w-4 h-4 text-blue-600" />
          <span>Masuk dengan Corporate SSO</span>
        </button>

        {/* Quick Demo Switcher for Preview */}
        <div className="mt-4 p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-[11px] text-slate-600">
          <div className="font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Preset Akun Demo (Klik untuk Coba Langsung):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('budi')}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 font-semibold text-[10px] text-left text-slate-700 hover:text-blue-700 transition-colors shadow-2xs"
            >
              👨‍💼 Budi (Innovation)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('citra')}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 font-semibold text-[10px] text-left text-slate-700 hover:text-blue-700 transition-colors shadow-2xs"
            >
              👩‍💼 Citra (Sustainability)
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Switch to Sign Up */}
      <div className="pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Belum terdaftar di program T2C?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
          >
            <span>Daftar Akun Baru</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </p>
        <p className="text-[10px] text-slate-400 mt-2 font-medium">
          Trash to Cash (T2C) • Sustainability & Zero Waste Platform
        </p>
      </div>
    </div>
  );
};
