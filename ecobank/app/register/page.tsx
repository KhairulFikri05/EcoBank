"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mitraLocations } from '@/lib/mitraLocations';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: '', email: '', password: '', konfirmasi: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.konfirmasi) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    localStorage.setItem(
      'ecobank_user_profile',
      JSON.stringify({
        nama: form.nama,
        email: form.email,
        phone: '0812-xxxx-xxxx',
        address: 'Kota Banda Aceh',
        joinDate: 'Hari Ini',
        level: 'Level 1 · Nasabah Baru',
        idNasabah: `EB-${Date.now().toString().slice(-4)}`,
        dropPointFavorit: mitraLocations[0].name,
        avatarInitial: form.nama ? form.nama[0].toUpperCase() : 'N',
      })
    );
    alert(`Akun berhasil dibuat untuk ${form.nama}! Silakan login.`);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 font-sans antialiased">
      <div className="fixed top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative w-full max-w-md space-y-5">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Beranda
        </Link>

        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/60 p-8 md:p-10 space-y-7">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <svg width="48" height="48" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="22" r="20" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
                <path d="M22 6C13.163 6 6 13.163 6 22C6 30.837 13.163 38 22 38C27.5 38 31 34 31 29C31 24.5 27.5 21 23 21C18.5 21 16 17.5 16 13C16 8.5 19.5 6 22 6Z" fill="#10B981" />
                <path d="M22 13C26.97 13 31 17.03 31 22C31 25.5 28.5 28 25 28C21.5 28 19 25.5 19 22C19 18.5 20.5 16 22 13Z" fill="#FFFFFF" />
                <circle cx="25" cy="22" r="2.8" fill="#F59E0B" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Akun EcoBank</h1>
              <p className="text-slate-500 text-xs mt-1">Bergabunglah dan mulai ubah sampah menjadi poin nyata</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                required
                placeholder="Nama lengkap kamu"
                value={form.nama}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="email@kamu.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Konfirmasi Password</label>
              <input
                type="password"
                name="konfirmasi"
                required
                placeholder="Ulangi password"
                value={form.konfirmasi}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" required className="mt-0.5 accent-emerald-600 w-4 h-4" id="terms" />
              <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed">
                Saya menyetujui{' '}
                <a href="#" className="text-emerald-600 font-semibold hover:underline">Syarat & Ketentuan</a>
                {' '}serta{' '}
                <a href="#" className="text-emerald-600 font-semibold hover:underline">Kebijakan Privasi</a>
                {' '}EcoBank.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-emerald-200 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Membuat akun...
                </>
              ) : 'Buat Akun Gratis'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

