"use client";

import { useState } from 'react';
import { useWaste } from '@/hooks/useWaste';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { wasteTypes = [] } = useWaste();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'ecobank2026') {
      setIsAuthenticated(true);
    } else {
      alert('Password Admin Salah! Gunakan: admin123');
    }
  };

  // TAMPILAN 1: FORM LOGIN DI AWAL
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
            🔒
          </div>
          
          <div>
            <h1 className="font-extrabold text-slate-900 text-xl tracking-tight">Portal Administrator EcoBank</h1>
            <p className="text-xs text-slate-500 mt-1">Sistem Otentikasi Terproteksi untuk Pengelolaan Data Master</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi</label>
              <input
                type="password"
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-sm"
            >
              Masuk ke Dashboard Admin
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
            <span>Password Demo: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700 font-bold">admin123</code></span>
            <a href="/" className="text-emerald-600 hover:underline font-semibold">← Kembali ke App</a>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN 2: DASHBOARD ADMIN SETELAH LOGIN SUKSES
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Admin */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-xl">Panel Kontrol Administrator</h1>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Sesi Aktif</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Mengelola Data Sampah</p>
          </div>

          <div className="flex items-center gap-3">
            <a href="/" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all">
              Halaman Utama
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-all"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Tabel Master Data Jenis Sampah */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Master Data Jenis Sampah</h3>
            <p className="text-xs text-slate-400">Data dimuat langsung dari <code className="text-emerald-600 font-mono">content/wasteTypes.json</code></p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="p-3 font-semibold">ID Sampah</th>
                  <th className="p-3 font-semibold">Nama Jenis Sampah</th>
                  <th className="p-3 font-semibold">Perolehan Poin / kg</th>
                  <th className="p-3 font-semibold">Reduksi CO₂ / kg</th>
                  <th className="p-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wasteTypes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-slate-500">{item.id}</td>
                    <td className="p-3 font-bold text-slate-800">{item.nama || item.name || item.id}</td>
                    <td className="p-3 font-semibold text-emerald-600">+{item.poinPerKg} Poin</td>
                    <td className="p-3 font-semibold text-blue-600">{item.emisiPerKg} kg CO₂</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold border border-emerald-200/50">Aktif</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
