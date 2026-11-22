"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
      router.push('/dashboard');
    } else {
      setError('Email atau password salah. Gunakan demo: user@ecobank.id / user123');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 font-sans antialiased">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Back to home */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Beranda
        </Link>

        {/* Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/60 p-8 md:p-10 space-y-7">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-200">
              🌱
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Selamat Datang!</h1>
              <p className="text-slate-500 text-sm mt-1">Masuk ke akun EcoBank kamu</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a href="#" className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold">Lupa password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-emerald-200 flex items-center justify-center gap-2 text-sm"
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-[11px] text-emerald-700 space-y-1">
            <p className="font-bold">🧪 Akun Demo Nasabah:</p>
            <p>Email: <code className="font-mono bg-emerald-100 px-1 rounded">user@ecobank.id</code></p>
            <p>Password: <code className="font-mono bg-emerald-100 px-1 rounded">user123</code></p>
          </div>

          {/* Register link */}
          <p className="text-center text-xs text-slate-500">
            Belum punya akun?{' '}
            <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-bold">
              Daftar gratis sekarang
            </Link>
          </p>
        </div>

        {/* Admin link */}
        <p className="text-center text-xs text-slate-400">
          Anda Admin?{' '}
          <Link href="/admin" className="text-slate-600 hover:text-slate-800 font-semibold">
            🔒 Masuk ke Portal Admin
          </Link>
        </p>
      </div>
    </div>
  );
}

