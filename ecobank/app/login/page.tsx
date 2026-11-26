"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mitraLocations } from '@/lib/mitraLocations';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulasi login — ganti dengan API call nyata jika tersedia
    await new Promise((r) => setTimeout(r, 1000));

    if (form.email === 'user@ecobank.id' && form.password === 'user123') {
      const existingProfile = localStorage.getItem('ecobank_user_profile');
      if (!existingProfile) {
        localStorage.setItem(
          'ecobank_user_profile',
          JSON.stringify({
            nama: 'Rahmat Hidayat',
            email: 'user@ecobank.id',
            phone: '0812-3456-7890',
            address: 'Kec. Syiah Kuala, Kota Banda Aceh',
            joinDate: 'September 2026',
            level: 'Level 2 · Green Pioneer',
            idNasabah: 'EB-2026-089',
            dropPointFavorit: mitraLocations[0].name,
            avatarInitial: 'R',
          })
        );
      }
      router.push('/dashboard');
    } else {
      setError('Email atau password salah. Gunakan demo: user@ecobank.id / user123');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between px-4 py-6 sm:px-8 font-sans bg-neutral-950">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }} />
      <div className="absolute inset-0 bg-neutral-950/70" />

      <header className="relative z-10 w-full max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white px-3 py-1.5 rounded-lg bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2">
          <span aria-hidden="true">←</span> Kembali ke beranda
        </Link>
      </header>

      <main className="relative z-10 w-full max-w-3xl mx-auto my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="md:col-span-2 bg-emerald-800 text-white p-8 flex flex-col justify-between gap-8">
            <div>
              <p className="text-base font-semibold">EcoBank</p>
              <p className="text-sm text-emerald-100 mt-1.5 leading-relaxed">Kelola akun dan mulai ubah sampah menjadi poin nyata.</p>
            </div>
            <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto shrink-0">
              <img src="/images/maskot_ecobank3.png" alt="Maskot EcoBank" className="w-full h-full object-contain anim-float" />
            </div>
            <p className="text-sm text-emerald-100">Masuk untuk melihat poin dan aktivitas daur ulang kamu.</p>
          </div>

          <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
            <h1 className="text-xl font-semibold text-slate-900">Masuk ke akun EcoBank</h1>
            <p className="text-sm text-slate-600 mt-1.5 mb-6">Masukkan email dan kata sandi untuk melanjutkan.</p>

          {/* Error */}
          {error && (
            <div role="alert" className="mb-4 text-sm text-red-700 border-l-2 border-red-600 pl-3 py-1">
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user-email" className="!block text-sm font-medium text-slate-800 mb-1.5">Email</label>
              <input
                id="user-email"
                type="email"
                name="email"
                required
                placeholder="email@kamu.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="user-password" className="!block text-sm font-medium text-slate-800 mb-1.5">Kata sandi</label>
                <a href="#" className="text-xs text-emerald-700 hover:text-emerald-800 font-medium mb-1.5">Lupa password?</a>
              </div>
              <div className="relative">
                <input
                  id="user-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 pr-11 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-800 rounded-md"
                  aria-label={showPass ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium transition-colors disabled:opacity-60 w-full"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Memproses...
                </>
              ) : 'Masuk ke Dashboard'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-emerald-800">Akun demo nasabah</p>
            <p className="mt-1">Email: <span className="font-mono text-slate-900">user@ecobank.id</span></p>
            <p>Password: <span className="font-mono text-slate-900">user123</span></p>
          </div>

          {/* Register link */}
          <div className="mt-5">
            <p className="text-sm text-slate-500">
              Belum punya akun?{' '}
              <Link href="/register" className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-800 hover:bg-emerald-200 transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
        </div>
        <p className="mt-5 text-center text-sm text-white/80">
          Anda Admin?{' '}
          <Link href="/admin" className="text-white underline underline-offset-2 hover:text-emerald-100">
            Masuk ke Portal Admin
          </Link>
        </p>
      </main>

      <footer className="relative z-10 text-center text-sm text-white/70">&copy; EcoBank</footer>
    </div>
  );
}

