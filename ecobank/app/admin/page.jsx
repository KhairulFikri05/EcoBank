"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useWaste } from '@/hooks/useWaste';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { wasteTypes = [] } = useWaste();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (password === 'admin123' || password === 'ecobank2026') {
      setIsAuthenticated(true);
    } else {
      alert('Password Admin Salah! Gunakan: admin123');
    }
    setLoading(false);
  };

  /* ── LOGIN FORM ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4 font-sans antialiased">
        {/* Background blobs */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-emerald-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-72 h-72 bg-emerald-900/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative w-full max-w-md space-y-5">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Kembali ke Beranda
          </Link>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 space-y-7 shadow-2xl">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-lg">
                🔒
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Portal Administrator</h1>
                <p className="text-slate-400 text-sm mt-1">Akses terbatas untuk pengelola sistem EcoBank</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Kata Sandi Admin</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPass
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      }
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Memverifikasi...
                  </>
                ) : 'Masuk ke Dashboard Admin'}
              </button>
            </form>

            {/* Demo hint */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">🧪 Kredensial Demo:</p>
              <p>Password: <code className="font-mono bg-white/10 px-1 rounded text-slate-200">admin123</code> atau <code className="font-mono bg-white/10 px-1 rounded text-slate-200">ecobank2026</code></p>
            </div>

            <p className="text-center text-xs text-slate-500">
              Bukan Admin?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Login sebagai Nasabah
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── DASHBOARD ADMIN ── */
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 px-5 md:px-10 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-base">🌱</div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base leading-none">EcoBank Admin</h1>
              <p className="text-xs text-slate-400 font-medium">Panel Kontrol Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Sesi Admin Aktif
            </span>
            <Link href="/" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all">
              🏠 Beranda
            </Link>
            <Link href="/dashboard" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all">
              Dashboard User
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-all"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 md:px-10 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '👥', value: '12,980', label: 'Total Nasabah', color: 'border-blue-500' },
            { icon: '🗑️', value: `${wasteTypes.length}`, label: 'Jenis Sampah', color: 'border-emerald-500' },
            { icon: '🪙', value: '45.2 Ton', label: 'Sampah Terkumpul', color: 'border-amber-500' },
            { icon: '🌍', value: '89 Ton', label: 'CO₂ Dikurangi', color: 'border-green-500' },
          ].map((s) => (
            <div key={s.label} className={`bg-white border border-slate-200/80 border-t-4 ${s.color} rounded-2xl p-5 shadow-sm`}>
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{s.value}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Master Data Jenis Sampah */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Master Data Jenis Sampah</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Data dimuat dari <code className="text-emerald-600 font-mono">content/wasteTypes.json</code>
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
              {wasteTypes.length} Jenis Aktif
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="p-3 font-semibold rounded-tl-xl">ID Sampah</th>
                  <th className="p-3 font-semibold">Nama Jenis Sampah</th>
                  <th className="p-3 font-semibold">Perolehan Poin / kg</th>
                  <th className="p-3 font-semibold">Reduksi CO₂ / kg</th>
                  <th className="p-3 font-semibold text-right rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wasteTypes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{item.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span className="text-base">
                          {item.id === 'plastik' ? '🧴' : item.id === 'kertas' ? '📦' : item.id === 'logam' ? '🥫' : '🍾'}
                        </span>
                        {item.nama || item.name || item.id}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-emerald-600">+{item.poinPerKg} Poin</td>
                    <td className="p-3 font-semibold text-blue-600">{item.emisiPerKg} kg CO₂</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-semibold border border-emerald-200/50">
                        ✓ Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Navigasi Cepat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/', icon: '🏠', label: 'Landing Page', desc: 'Halaman utama publik' },
              { href: '/login', icon: '👤', label: 'Login Nasabah', desc: 'Halaman masuk pengguna' },
              { href: '/dashboard', icon: '📊', label: 'Dashboard User', desc: 'Panel nasabah EcoBank' },
              { href: '/dropoff', icon: '📲', label: 'Halaman Dropoff', desc: 'Form setoran sampah' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition-all group"
              >
                <span className="text-2xl block mb-2">{link.icon}</span>
                <p className="font-bold text-slate-800 text-xs group-hover:text-emerald-700 transition-colors">{link.label}</p>
                <p className="text-slate-400 text-[10px] mt-0.5">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
