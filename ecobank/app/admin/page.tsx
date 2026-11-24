"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWaste } from '@/hooks/useWaste';

// ─── Types ───────────────────────────────────────────────────────────────────
type AdminTab = 'overview' | 'tracking' | 'analitik' | 'masterdata';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function IcHome({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}
function IcMap({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>;
}
function IcChart({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
}
function IcDatabase({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
}
function IcUsers({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
}
function IcLogout({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
}
function IcMenu({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>;
}
function IcSidebar({ c = "w-5 h-5" }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 4v16" />
    </svg>
  );
}
function IcChevronLeft({ c = "w-5 h-5" }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function IcCheck({ c = "w-4 h-4" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>;
}
function IcLeaf({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
}
function IcPin({ c = "w-5 h-5" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function IcTrend({ c = "w-4 h-4" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
}
function IcLock({ c = "w-6 h-6" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
function IcEye({ c = "w-4 h-4" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
}
function IcEyeOff({ c = "w-4 h-4" }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
}
function IcSpin({ c = "w-4 h-4" }: { c?: string }) {
  return <svg className={`${c} animate-spin`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>;
}

// ─── EcoBank Logo Matching Landing Page ───────────────────────────────────────
function EcoBankMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EcoBank Logo"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="adm-lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="adm-lg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dcfce7" />
          <stop offset="100%" stopColor="#bbf7d0" />
        </linearGradient>
      </defs>
      <path d="M24 2 L41.3 11 L41.3 29 L24 38 L6.7 29 L6.7 11 Z" fill="url(#adm-lg1)" />
      <path d="M24 11 C31 14 35 20 32 26 C29 32 22 33 18 29 C14 25 15 17 20 13 C21.5 11.8 23 11 24 11 Z" fill="url(#adm-lg2)" />
      <path d="M24 11 C23 19 21 26 20 32" stroke="#15803d" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M23 16 C26 14.5 29 15.5 31 18" stroke="#15803d" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M22 21 C25 19.5 29 20.5 31 23" stroke="#15803d" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M20 32 L20 37" stroke="#bbf7d0" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="20" cy="37" rx="4" ry="1.5" fill="#bbf7d0" opacity="0.6" />
    </svg>
  );
}

// ─── Mock mitra data ──────────────────────────────────────────────────────────
const mitraData = [
  { id: 'MTR-001', name: 'Bank Sampah Syiah Kuala', area: 'Banda Aceh - Kec. Syiah Kuala', active: 48, status: 'Aktif', x: 28, y: 34 },
  { id: 'MTR-002', name: 'Bank Sampah Ulee Kareng', area: 'Banda Aceh - Kec. Ulee Kareng', active: 31, status: 'Aktif', x: 18, y: 42 },
  { id: 'MTR-003', name: 'Bank Sampah Meuraxa', area: 'Banda Aceh - Kec. Meuraxa', active: 22, status: 'Aktif', x: 12, y: 28 },
  { id: 'MTR-004', name: 'Bank Sampah Baiturrahman', area: 'Banda Aceh - Kec. Baiturrahman', active: 19, status: 'Aktif', x: 48, y: 55 },
  { id: 'MTR-005', name: 'Bank Sampah Lueng Bata', area: 'Banda Aceh - Kec. Lueng Bata', active: 14, status: 'Libur', x: 62, y: 44 },
  { id: 'MTR-006', name: 'Bank Sampah Banda Raya', area: 'Banda Aceh - Kec. Banda Raya', active: 27, status: 'Aktif', x: 72, y: 62 },
];

// ─── Monthly analytics data ───────────────────────────────────────────────────
const monthlyData = [
  { month: 'Jun', kg: 3200, co2: 6.8, nasabah: 980 },
  { month: 'Jul', kg: 3850, co2: 7.9, nasabah: 1050 },
  { month: 'Agu', kg: 4100, co2: 8.4, nasabah: 1180 },
  { month: 'Sep', kg: 3700, co2: 7.6, nasabah: 1240 },
  { month: 'Okt', kg: 4600, co2: 9.5, nasabah: 1380 },
  { month: 'Nov', kg: 5200, co2: 11.2, nasabah: 1420 },
];
const maxKg = Math.max(...monthlyData.map(d => d.kg));

// ─── Active users on map ──────────────────────────────────────────────────────
const activeUsers = [
  { x: 32, y: 38 }, { x: 20, y: 46 }, { x: 50, y: 60 },
  { x: 15, y: 32 }, { x: 68, y: 50 }, { x: 76, y: 65 },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminScrolled, setAdminScrolled] = useState(false);
  const adminScrollRef = useRef<HTMLDivElement>(null);
  const { wasteTypes = [] } = useWaste();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    const el = adminScrollRef.current;
    if (el) {
      const handleScroll = () => setAdminScrolled(el.scrollTop > 20);
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
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

  // ── LOGIN FORM ──────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #031a09 0%, #0a3018 50%, #0f4a24 100%)', fontFamily: 'var(--font-geist-sans, "Plus Jakarta Sans", sans-serif)' }}>
        {/* subtle grid pattern */}
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(22,163,74,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative w-full max-w-sm space-y-5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: 'rgba(134,239,172,0.7)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Kembali ke Beranda
          </Link>

          <div className="p-8 rounded-2xl space-y-6" style={{ background: 'rgba(10,28,17,0.72)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Header */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-4 rounded-2xl" style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <IcLock c="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Portal Administrator</h1>
                <p className="text-sm mt-1" style={{ color: 'rgba(134,239,172,0.6)' }}>Akses terbatas pengelola EcoBank</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold block" style={{ color: 'rgba(255,255,255,0.6)' }}>Kata Sandi Admin</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none pr-12"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {showPass ? <IcEyeOff /> : <IcEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{ background: loading ? '#14532d' : '#16a34a', color: 'white' }}
              >
                {loading ? <><IcSpin c="w-4 h-4" /> Memverifikasi...</> : 'Masuk ke Dashboard Admin'}
              </button>
            </form>

            {/* Hint */}
            <div className="p-3 rounded-xl text-[11px] space-y-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Kredensial Demo</p>
              <p style={{ color: 'rgba(255,255,255,0.35)' }}>Password: <code className="font-mono px-1 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(134,239,172,0.8)' }}>admin123</code></p>
            </div>

            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Bukan Admin?{' '}
              <Link href="/login" className="font-semibold" style={{ color: '#4ade80' }}>Login sebagai Nasabah</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
  const navItems: { tab: AdminTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'overview', label: 'Dashboard', icon: <IcHome /> },
    { tab: 'tracking', label: 'Tracking Lokasi', icon: <IcMap /> },
    { tab: 'analitik', label: 'Analitik Lanjutan', icon: <IcChart /> },
    { tab: 'masterdata', label: 'Master Data', icon: <IcDatabase /> },
  ];

  const headerLabels: Record<AdminTab, string> = {
    overview: 'Dashboard Overview',
    tracking: 'Tracking Lokasi Mitra',
    analitik: 'Analitik Lanjutan',
    masterdata: 'Master Data Jenis Sampah',
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f7f3', fontFamily: 'var(--font-geist-sans, "Plus Jakarta Sans", sans-serif)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR DENGAN TOGGLE COLLAPSE (FULL VIEW MODE) ── */}
      <aside
        className={`fixed md:sticky top-0 h-screen inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out shadow-xl md:shadow-none overflow-hidden flex-shrink-0 ${
          sidebarOpen
            ? 'w-64 translate-x-0 opacity-100'
            : 'w-0 -translate-x-full md:translate-x-0 md:w-0 opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(180deg, #031a09 0%, #0a3018 60%, #0f4a24 100%)',
          borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <div className="w-64 h-full flex flex-col justify-between">
          <div>
            {/* Logo + Close Button */}
            <div className="p-5 pb-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <EcoBankMark size={36} />
                <div>
                  <h1 className="font-bold text-white text-base leading-tight">EcoBank</h1>
                  <p className="text-xs font-medium" style={{ color: '#86efac' }}>Panel Administrator</p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200/60 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                title="Tutup Sidebar"
                aria-label="Tutup Sidebar"
              >
                <IcChevronLeft c="w-5 h-5" />
              </button>
            </div>

            <div className="mx-5 mb-5" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

            <nav className="px-4 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-3" style={{ color: 'rgba(134,239,172,0.5)' }}>Administrasi</p>
              {navItems.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => { setActiveTab(item.tab); if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                    style={isActive
                      ? { background: 'rgba(22,163,74,0.25)', color: '#86efac', borderLeft: '3px solid #16a34a' }
                      : { color: 'rgba(255,255,255,0.55)', borderLeft: '3px solid transparent' }
                    }
                  >
                    <span style={{ color: isActive ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 space-y-2">
            <div className="mx-2 mb-3" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: '#dc2626', color: 'white' }}>A</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Administrator</p>
                <p className="text-[10px] truncate" style={{ color: 'rgba(134,239,172,0.6)' }}>Super Admin</p>
              </div>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all" style={{ color: 'rgba(248,113,113,0.7)' }}>
              <IcLogout c="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto" ref={adminScrollRef}>

        {/* Header */}
        <header
          className="sticky top-0 z-20 px-5 md:px-8 py-4 flex items-center justify-between transition-all duration-300"
          style={adminScrolled ? {
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(22,163,74,0.14)',
            boxShadow: '0 2px 20px rgba(14,61,35,0.08)',
          } : {
            background: 'rgba(240,247,243,0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(22,163,74,0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-xl transition-all flex items-center justify-center border border-emerald-900/15 bg-white/80 hover:bg-white text-emerald-800 shadow-xs active:scale-95"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Tutup Sidebar (Tampilan Layar Penuh)" : "Buka Sidebar"}
              aria-label="Toggle Sidebar"
            >
              <IcSidebar c="w-5 h-5 text-emerald-700" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold" style={{ color: '#14532d' }}>{headerLabels[activeTab]}</h2>
              </div>
              <p className="text-xs hidden md:block" style={{ color: '#6b9e7a' }}>Panel kontrol administrator EcoBank</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl transition-all flex items-center justify-center border border-emerald-900/15 bg-white/80 hover:bg-white text-emerald-800 shadow-xs active:scale-95" title="Keluar dari Admin Panel" aria-label="Logout Admin" onClick={() => setIsAuthenticated(false)}>
              <IcLogout c="w-5 h-5" />
            </button>
          </div>
        </header>
        
        <main className={`flex-1 p-5 md:p-8 w-full mx-auto transition-all duration-300 ${sidebarOpen ? 'max-w-7xl' : 'max-w-full px-6 md:px-12'}`}>

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Nasabah', value: '12,980', sub: '+8.2% bulan ini', icon: <IcUsers c="w-5 h-5" />, accent: '#2563eb', accentBg: 'rgba(37,99,235,0.08)' },
                  { label: 'Jenis Sampah', value: `${wasteTypes.length}`, sub: 'Kategori aktif', icon: <IcDatabase c="w-5 h-5" />, accent: '#16a34a', accentBg: 'rgba(22,163,74,0.08)' },
                  { label: 'Sampah Terkumpul', value: '45.2 Ton', sub: '+12% dari target', icon: <IcLeaf c="w-5 h-5" />, accent: '#d97706', accentBg: 'rgba(217,119,6,0.08)' },
                  { label: 'CO₂ Dikurangi', value: '89 Ton', sub: 'Dampak karbon', icon: <IcLeaf c="w-5 h-5" />, accent: '#059669', accentBg: 'rgba(5,150,105,0.08)' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium" style={{ color: '#6b9e7a' }}>{s.label}</p>
                        <p className="text-2xl font-extrabold mt-1 tracking-tight" style={{ color: '#14532d' }}>{s.value}</p>
                        <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: '#9db8a4' }}>
                          <IcTrend c="w-3 h-3" />
                          {s.sub}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl" style={{ background: s.accentBg, color: s.accent }}>{s.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Two col */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Recent transactions */}
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                  <h3 className="font-bold text-sm mb-4" style={{ color: '#14532d' }}>Transaksi Terbaru</h3>
                  <div className="space-y-2.5">
                    {[
                      { name: 'Nasabah #204', action: 'Menyetor 4.5 kg Botol Plastik', pts: '+225', time: 'Baru saja', type: 'setor' },
                      { name: 'Nasabah #089', action: 'Menukar 500 Poin ke GoFood', pts: '-500', time: '2 menit lalu', type: 'tukar' },
                      { name: 'Nasabah #155', action: 'Menyetor 3.2 kg Kaleng Logam', pts: '+256', time: '8 menit lalu', type: 'setor' },
                      { name: 'Nasabah #312', action: 'Menyetor 2.0 kg Kardus', pts: '+60', time: '15 menit lalu', type: 'setor' },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f8fdf9', border: '1px solid rgba(22,163,74,0.08)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={tx.type === 'setor' ? { background: 'rgba(22,163,74,0.1)', color: '#16a34a' } : { background: 'rgba(217,119,6,0.1)', color: '#d97706' }}>
                          <IcCheck c="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: '#14532d' }}>{tx.name} · {tx.action}</p>
                          <p className="text-[10px]" style={{ color: '#9db8a4' }}>{tx.time}</p>
                        </div>
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: tx.pts.startsWith('+') ? '#16a34a' : '#dc2626' }}>{tx.pts} Pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mitra summary */}
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm" style={{ color: '#14532d' }}>Status Mitra</h3>
                    <button onClick={() => setActiveTab('tracking')} className="text-xs font-semibold" style={{ color: '#16a34a' }}>Lihat peta</button>
                  </div>
                  <div className="space-y-2.5">
                    {mitraData.slice(0, 5).map((m) => (
                      <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f8fdf9', border: '1px solid rgba(22,163,74,0.08)' }}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.status === 'Aktif' ? '#16a34a' : '#d97706' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: '#14532d' }}>{m.name}</p>
                          <p className="text-[10px]" style={{ color: '#9db8a4' }}>{m.area}</p>
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: m.status === 'Aktif' ? '#16a34a' : '#d97706' }}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TRACKING ── */}
          {activeTab === 'tracking' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live · Pembaruan Real-time
                </span>
                <span className="text-xs" style={{ color: '#6b9e7a' }}>{mitraData.filter(m => m.status === 'Aktif').length} mitra aktif · {activeUsers.length} nasabah online</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Map */}
                <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(22,163,74,0.08)' }}>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: '#14532d' }}>Peta Sebaran Mitra & Nasabah</h3>
                      <p className="text-xs mt-0.5" style={{ color: '#6b9e7a' }}>Kawasan Banda Aceh & Sekitarnya</p>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="flex items-center gap-1.5" style={{ color: '#16a34a' }}>
                        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#16a34a' }} />
                        Mitra Aktif
                      </span>
                      <span className="flex items-center gap-1.5" style={{ color: '#d97706' }}>
                        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#d97706' }} />
                        Mitra Libur
                      </span>
                      <span className="flex items-center gap-1.5" style={{ color: '#2563eb' }}>
                        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#2563eb' }} />
                        Nasabah
                      </span>
                    </div>
                  </div>

                  {/* SVG Map */}
                  <div className="relative" style={{ background: '#edf7f1', height: 380 }}>
                    {/* Road grid lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Roads */}
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(22,163,74,0.15)" strokeWidth="0.5" />
                      <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(22,163,74,0.15)" strokeWidth="0.5" />
                      <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(22,163,74,0.08)" strokeWidth="0.3" />
                      <line x1="0" y1="70" x2="100" y2="70" stroke="rgba(22,163,74,0.08)" strokeWidth="0.3" />
                      <line x1="30" y1="0" x2="30" y2="100" stroke="rgba(22,163,74,0.08)" strokeWidth="0.3" />
                      <line x1="70" y1="0" x2="70" y2="100" stroke="rgba(22,163,74,0.08)" strokeWidth="0.3" />
                      {/* River / coast */}
                      <path d="M0,25 Q10,30 5,40 Q0,50 10,55 Q20,60 15,70" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="1.5" />
                      {/* Area blobs */}
                      <ellipse cx="30" cy="38" rx="20" ry="14" fill="rgba(22,163,74,0.06)" />
                      <ellipse cx="62" cy="58" rx="22" ry="16" fill="rgba(22,163,74,0.06)" />
                    </svg>

                    {/* Mitra markers */}
                    {mitraData.map((m) => (
                      <div
                        key={m.id}
                        className="absolute group cursor-pointer"
                        style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -100%)' }}
                      >
                        {/* Ping animation for active */}
                        {m.status === 'Aktif' && (
                          <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(22,163,74,0.3)', width: 24, height: 24 }} />
                        )}
                        <div className="relative flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-md" style={{ background: m.status === 'Aktif' ? '#16a34a' : '#d97706', border: '2px solid white' }}>
                            <IcPin c="w-3 h-3 text-white" />
                          </div>
                          <div className="w-0 h-0" style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `6px solid ${m.status === 'Aktif' ? '#16a34a' : '#d97706'}` }} />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-44">
                          <div className="p-2 rounded-lg shadow-lg text-[10px]" style={{ background: '#14532d', color: 'white' }}>
                            <p className="font-semibold">{m.name}</p>
                            <p style={{ color: '#86efac' }}>{m.active} nasabah aktif</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* User markers */}
                    {activeUsers.map((u, i) => (
                      <div
                        key={i}
                        className="absolute w-4 h-4 rounded-full"
                        style={{ left: `${u.x}%`, top: `${u.y}%`, transform: 'translate(-50%,-50%)', background: '#2563eb', border: '2px solid white', boxShadow: '0 0 6px rgba(37,99,235,0.5)' }}
                      />
                    ))}

                    {/* Map label */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.8)', color: '#14532d' }}>
                      Kawasan Banda Aceh
                    </div>
                  </div>
                </div>

                {/* Mitra list */}
                <div className="rounded-2xl p-5 overflow-auto" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)', maxHeight: 460 }}>
                  <h3 className="font-bold text-sm mb-4" style={{ color: '#14532d' }}>Daftar Mitra</h3>
                  <div className="space-y-3">
                    {mitraData.map((m) => (
                      <div key={m.id} className="p-3 rounded-xl" style={{ background: '#f8fdf9', border: '1px solid rgba(22,163,74,0.08)' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono" style={{ color: '#9db8a4' }}>{m.id}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={m.status === 'Aktif' ? { background: 'rgba(22,163,74,0.1)', color: '#16a34a' } : { background: 'rgba(217,119,6,0.1)', color: '#d97706' }}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold" style={{ color: '#14532d' }}>{m.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#9db8a4' }}>{m.area}</p>
                        <p className="text-[11px] font-semibold mt-1.5" style={{ color: '#16a34a' }}>{m.active} nasabah aktif</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALITIK ── */}
          {activeTab === 'analitik' && (
            <div className="space-y-5">
              {/* Summary impact cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Pohon Setara', value: '890', sub: 'Pohon dewasa/tahun', accent: '#16a34a', accentBg: 'rgba(22,163,74,0.08)' },
                  { label: 'Km Mobil Hemat', value: '534K', sub: 'Setara emisi kendaraan', accent: '#2563eb', accentBg: 'rgba(37,99,235,0.08)' },
                  { label: 'Poin Tersalurkan', value: '1.45 M', sub: 'Total reward nasabah', accent: '#d97706', accentBg: 'rgba(217,119,6,0.08)' },
                  { label: 'Efisiensi Target', value: '94%', sub: 'Realisasi vs target', accent: '#059669', accentBg: 'rgba(5,150,105,0.08)' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                    <div className="inline-flex p-2 rounded-lg mb-3" style={{ background: s.accentBg, color: s.accent }}>
                      <IcLeaf c="w-4 h-4" />
                    </div>
                    <p className="text-xl font-extrabold tracking-tight" style={{ color: '#14532d' }}>{s.value}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: '#14532d' }}>{s.label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#9db8a4' }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: '#14532d' }}>Tren Pengumpulan Sampah</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#6b9e7a' }}>Volume bulanan (kg) — 6 bulan terakhir</p>
                  </div>
                </div>
                <div className="flex items-end gap-3 h-44">
                  {monthlyData.map((d) => {
                    const height = (d.kg / maxKg) * 100;
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#16a34a' }}>{d.kg.toLocaleString()}</span>
                        <div className="w-full rounded-t-lg relative overflow-hidden transition-all" style={{ height: `${height}%`, background: 'rgba(22,163,74,0.15)', minHeight: 8 }}>
                          <div className="absolute inset-x-0 bottom-0 rounded-t-lg" style={{ height: '60%', background: '#16a34a' }} />
                        </div>
                        <span className="text-[10px] font-medium" style={{ color: '#9db8a4' }}>{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Two more charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* CO2 reduction */}
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                  <h3 className="font-bold text-sm mb-4" style={{ color: '#14532d' }}>Reduksi CO₂ (Ton/bulan)</h3>
                  <div className="space-y-2.5">
                    {monthlyData.map((d) => (
                      <div key={d.month} className="flex items-center gap-3">
                        <span className="text-xs w-8 text-right flex-shrink-0" style={{ color: '#9db8a4' }}>{d.month}</span>
                        <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'rgba(37,99,235,0.08)' }}>
                          <div className="h-full rounded-lg flex items-center px-2" style={{ width: `${(d.co2 / 12) * 100}%`, background: 'rgba(37,99,235,0.3)' }}>
                            <span className="text-[10px] font-bold" style={{ color: '#1d4ed8' }}>{d.co2}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nasabah growth */}
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                  <h3 className="font-bold text-sm mb-4" style={{ color: '#14532d' }}>Pertumbuhan Nasabah</h3>
                  <div className="space-y-2.5">
                    {monthlyData.map((d) => (
                      <div key={d.month} className="flex items-center gap-3">
                        <span className="text-xs w-8 text-right flex-shrink-0" style={{ color: '#9db8a4' }}>{d.month}</span>
                        <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'rgba(22,163,74,0.06)' }}>
                          <div className="h-full rounded-lg flex items-center px-2" style={{ width: `${(d.nasabah / 1500) * 100}%`, background: 'rgba(22,163,74,0.2)' }}>
                            <span className="text-[10px] font-bold" style={{ color: '#16a34a' }}>{d.nasabah.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Waste breakdown */}
              <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: '#14532d' }}>Komposisi Jenis Sampah</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Plastik', pct: 42, color: '#16a34a' },
                    { label: 'Kertas', pct: 28, color: '#2563eb' },
                    { label: 'Logam', pct: 20, color: '#d97706' },
                    { label: 'Kaca', pct: 10, color: '#7c3aed' },
                  ].map((w) => (
                    <div key={w.label} className="p-4 rounded-xl" style={{ background: '#f8fdf9', border: '1px solid rgba(22,163,74,0.08)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold" style={{ color: '#14532d' }}>{w.label}</span>
                        <span className="text-xs font-bold" style={{ color: w.color }}>{w.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                        <div className="h-full rounded-full" style={{ width: `${w.pct}%`, background: w.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MASTER DATA ── */}
          {activeTab === 'masterdata' && (
            <div className="space-y-5">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(22,163,74,0.08)' }}>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: '#14532d' }}>Master Data Jenis Sampah</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#6b9e7a' }}>Data dimuat dari <code className="font-mono" style={{ color: '#16a34a' }}>content/wasteTypes.json</code></p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.15)' }}>
                    {wasteTypes.length} Jenis Aktif
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(22,163,74,0.08)', background: '#f8fdf9' }}>
                        {['ID Sampah', 'Nama Jenis Sampah', 'Poin / kg', 'Reduksi CO₂ / kg', 'Status'].map((h, i) => (
                          <th key={h} className={`px-5 py-3 font-semibold text-xs ${i === 4 ? 'text-right' : ''}`} style={{ color: '#6b9e7a' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {wasteTypes.map((item: { id: string; nama?: string; name?: string; poinPerKg: number; emisiPerKg: number }, idx: number) => (
                        <tr key={item.id} style={{ borderBottom: idx < wasteTypes.length - 1 ? '1px solid rgba(22,163,74,0.06)' : 'none' }}>
                          <td className="px-5 py-3.5 font-mono text-xs" style={{ color: '#9db8a4' }}>{item.id}</td>
                          <td className="px-5 py-3.5">
                            <span className="font-semibold" style={{ color: '#14532d' }}>{item.nama || item.name || item.id}</span>
                          </td>
                          <td className="px-5 py-3.5 font-semibold" style={{ color: '#16a34a' }}>+{item.poinPerKg} Poin</td>
                          <td className="px-5 py-3.5 font-semibold" style={{ color: '#2563eb' }}>{item.emisiPerKg} kg CO₂</td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a' }}>
                              <IcCheck c="w-3 h-3" />
                              Aktif
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick links */}
              <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(22,163,74,0.12)' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: '#14532d' }}>Navigasi Cepat</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { href: '/', label: 'Landing Page', desc: 'Halaman publik utama', icon: <IcHome c="w-4 h-4" /> },
                    { href: '/login', label: 'Login Nasabah', desc: 'Halaman masuk pengguna', icon: <IcLock c="w-4 h-4" /> },
                    { href: '/dashboard', label: 'Dashboard User', desc: 'Panel nasabah EcoBank', icon: <IcChart c="w-4 h-4" /> },
                    { href: '/dropoff', label: 'Halaman Dropoff', desc: 'Form setoran sampah', icon: <IcDatabase c="w-4 h-4" /> },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="p-4 rounded-xl transition-all group flex flex-col gap-2"
                      style={{ background: '#f8fdf9', border: '1px solid rgba(22,163,74,0.1)' }}
                    >
                      <span className="inline-flex p-2 rounded-lg" style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a' }}>{link.icon}</span>
                      <div>
                        <p className="font-semibold text-xs" style={{ color: '#14532d' }}>{link.label}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#9db8a4' }}>{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
