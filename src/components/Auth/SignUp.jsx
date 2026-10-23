import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Phone, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2, 
  Leaf,
  Sparkles
} from 'lucide-react';

export const SignUp = ({ onSwitchToSignIn }) => {
  const { login, showToast } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    nip: '',
    email: '',
    division: 'Divisi Digital Innovation',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const divisions = [
    'Divisi Digital Innovation',
    'Divisi Sustainability & ESG',
    'Divisi Human Capital',
    'Divisi Operasional & Fasilitas',
    'Divisi Keamanan & IT Infrastructure',
    'Divisi Keuangan & Akuntansi',
    'Komunitas Green Office'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.nip || !formData.password) {
      showToast('Mohon lengkapi data registrasi', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok', 'error');
      return;
    }
    if (!formData.agreeTerms) {
      showToast('Harap setujui syarat & komitmen Zero Waste', 'error');
      return;
    }

    // Register placeholder logic
    login({
      name: formData.fullName,
      division: formData.division,
      avatar: '🌱',
      ecoCoins: 50, // Welcome bonus
      level: 1
    });
    showToast(`🎉 Selamat datang ${formData.fullName}! Bonus pendaftaran +50 Eco-Coins didapatkan!`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 py-5 bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <div>
        {/* Top Header with Back Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Bonus +50 Koin Awal
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Daftar Akun T2C
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Lengkapi data diri Anda untuk mulai mengubah sampah anorganik jadi reward finansial & lifestyle.
          </p>
        </div>

        {/* Form Registration */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Contoh: Budi Pratama"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Grid: NIP & Phone */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                ID Karyawan / NIP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                placeholder="80123456"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                No. WhatsApp
              </label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="08123456789"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Perusahaan / Pribadi <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama.user@company.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Divisi / Unit Kerja */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Divisi / Unit Kerja <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400 pointer-events-none">
                <Building2 className="w-4 h-4" />
              </div>
              <select
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs transition-all appearance-none"
              >
                {divisions.map((div, idx) => (
                  <option key={idx} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Passwords Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 8 karakter"
                  className="w-full px-3 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ulangi Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Ulangi sandi"
                  className="w-full px-3 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Agreement */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-600 leading-tight">
                Saya menyetujui <span className="font-semibold text-blue-700">Ketentuan Partisipasi Zero Waste</span> dan bersedia menjaga kebersihan & kejujuran setor pilah sampah.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar & Dapatkan +50 Eco-Coins</span>
          </button>
        </form>
      </div>

      {/* Footer Switch to Sign In */}
      <div className="pt-4 mt-3 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Sudah punya akun T2C?{' '}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="font-bold text-blue-700 hover:underline"
          >
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
};
