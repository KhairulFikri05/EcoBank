"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TabId,
  Transaction,
  Impact,
  DropoffPayload,
  RewardItem,
  UserProfile,
  nearbyDropPoints,
} from '@/components/dashboard/types';
import {
  EcoBankMark,
  IconHome,
  IconRecycle,
  IconHistory,
  IconBook,
  IconUser,
  IconLeaf,
  IconChevronRight,
  IconChevronLeft,
  IconSidebar,
  IconStar,
  IconLogout,
  IconCheck,
  IconMapPin,
  IconShield,
  IconEdit,
  WasteIcon,
  IconNavigation,
  RewardIcon,
} from '@/components/dashboard/DashboardIcons';
import { HeroStatSlider } from '@/components/dashboard/HeroStatSlider';
import { CalculatorSection } from '@/components/dashboard/SetorSampahSection';
import { RiwayatTransaksiSection } from '@/components/dashboard/RiwayatTransaksiSection';
import { EdukasiSection } from '@/components/dashboard/EdukasiSection';

// ─── Popular Rewards Catalog ──────────────────────────────────────────────────
const availableRewards: RewardItem[] = [
  { id: 'rew-1', title: 'Voucher GoPay Rp 10.000', category: 'e-Wallet · Instan', points: 100, provider: 'GoPay', iconBg: '#00aa13' },
  { id: 'rew-2', title: 'Pulsa Seluler Rp 25.000', category: 'e-Wallet · Instan', points: 240, provider: 'Telkomsel', iconBg: '#e11932' },
  { id: 'rew-3', title: 'Token Listrik PLN Rp 20.000', category: 'Utilitas · Instan', points: 200, provider: 'PLN', iconBg: '#0284c7' },
  { id: 'rew-4', title: 'Adopsi Bibit Pohon Mangrove', category: 'Penghijauan · EcoGreen', points: 150, provider: 'EcoGreen Foundation', iconBg: '#16a34a' },
];


// ─── Dynamic Time Greeting Function ───────────────────────────────────────────
function getDynamicGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}


// ─── Main Page Component ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('beranda');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Selamat Datang');
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // ─── User Profile State ─────────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nama: 'Rahmat Hidayat',
    email: 'user@ecobank.id',
    phone: '0812-3456-7890',
    address: 'Kec. Syiah Kuala, Kota Banda Aceh',
    joinDate: 'September 2026',
    level: 'Level 2 · Green Pioneer',
    idNasabah: 'EB-2026-089',
    dropPointFavorit: 'Bank Sampah Syiah Kuala',
    avatarInitial: 'R',
  });

  // Client-side hydration: update greeting, sidebar, and scroll-aware header
  useEffect(() => {
    setGreeting(getDynamicGreeting());
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    const el = mainScrollRef.current;
    if (el) {
      const handleScroll = () => setHeaderScrolled(el.scrollTop > 20);
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
    try {
      const saved = localStorage.getItem('ecobank_user_profile');
      if (saved) {
        setUserProfile(JSON.parse(saved));
      } else {
        const rawUser = localStorage.getItem('ecobank_user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          if (parsed.nama || parsed.name) {
            setUserProfile((prev) => ({
              ...prev,
              nama: parsed.nama || parsed.name,
              email: parsed.email || prev.email,
              avatarInitial: (parsed.nama || parsed.name)[0].toUpperCase(),
            }));
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('ecobank_user_profile', JSON.stringify(userProfile));
      setProfileSuccessMsg('Profil berhasil diperbarui!');
      setTimeout(() => setProfileSuccessMsg(''), 3500);
    } catch (e) {
      console.warn('Save profile error:', e);
    }
  };

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      trxCode: '#TRX-2026-1012',
      type: 'Setor',
      description: 'Botol Plastik (2.0 kg)',
      amount: 100,
      date: '12 Okt 2026',
      monthGroup: 'OKTOBER 2026',
      dropPoint: 'Bank Sampah Syiah Kuala',
      status: 'Terverifikasi',
      photoUrl: '/images/plastik.jpeg',
      emisi: 3.0,
      weight: 2.0,
      wasteDetail: '2.0 kg Botol Plastik',
    },
    {
      id: '2',
      trxCode: '#TRX-2026-1010',
      type: 'Tukar',
      description: 'Voucher e-Wallet GoPay Rp 10.000',
      amount: -50,
      date: '10 Okt 2026',
      monthGroup: 'OKTOBER 2026',
      dropPoint: 'Penukaran Instan',
      status: 'Berhasil',
    },
    {
      id: '3',
      trxCode: '#TRX-2026-1008',
      type: 'Setor',
      description: 'Kardus & Kertas Bekas (5.0 kg)',
      amount: 150,
      date: '08 Okt 2026',
      monthGroup: 'OKTOBER 2026',
      dropPoint: 'Bank Sampah Ulee Kareng',
      status: 'Terverifikasi',
      photoUrl: '/images/kertas.jpeg',
      emisi: 4.0,
      weight: 5.0,
      wasteDetail: '5.0 kg Kardus & Kertas',
    },
  ]);

  const [impact, setImpact] = useState<Impact>({
    totalKg: 7.0,
    totalPoin: 200,
    totalEmisi: 3.8,
  });

  const handleRedeemReward = (reward: RewardItem) => {
    if (impact.totalPoin < reward.points) {
      alert(`Poin Anda tidak mencukupi (${impact.totalPoin} / ${reward.points} Pts). Silakan setor sampah lagi untuk menambah poin!`);
      return;
    }

    if (confirm(`Tukarkan ${reward.points} Poin dengan "${reward.title}"?`)) {
      setImpact((prev) => ({
        ...prev,
        totalPoin: prev.totalPoin - reward.points,
      }));

      const newTx: Transaction = {
        id: Date.now().toString(),
        trxCode: `#TRX-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
        type: 'Tukar',
        description: reward.title,
        amount: -reward.points,
        date: 'Hari ini',
        monthGroup: 'NOVEMBER 2026',
        dropPoint: 'Penukaran Instan',
        status: 'Berhasil',
      };
      setTransactions((prev) => [newTx, ...prev]);
      alert(`Selamat! Penukaran "${reward.title}" berhasil diproses.`);
    }
  };

  const handleSaveDropoff = async (calculatedData: DropoffPayload) => {
    const trxCode = `#TRX-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const dropPointName = calculatedData.dropPoint || 'Bank Sampah Syiah Kuala';
    const desc = calculatedData.wasteDetail
      ? `Setoran ${calculatedData.wasteDetail}`
      : `Setoran Sampah (${(calculatedData.weight || 0).toFixed(1)} kg)`;

    try {
      const res = await fetch('/api/dropoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.idNasabah,
          userName: userProfile.nama,
          wasteType: calculatedData.wasteType || 'sampah-campuran',
          weight: calculatedData.weight || 1,
          totalPoin: calculatedData.totalPoin,
          totalEmisi: calculatedData.totalEmisi,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        alert(`Berhasil! Tiket setoran: ${result.data?.ticketId || 'DROP-OK'} (+${calculatedData.totalPoin} Poin)`);
        const newTx: Transaction = {
          id: Date.now().toString(),
          trxCode: result.data?.ticketId ? `#${result.data.ticketId}` : trxCode,
          type: 'Setor',
          description: desc,
          amount: calculatedData.totalPoin,
          date: 'Hari ini',
          monthGroup: 'NOVEMBER 2026',
          dropPoint: dropPointName,
          status: 'Terverifikasi',
          photoUrl: calculatedData.photoUrl || null,
          emisi: calculatedData.totalEmisi,
          weight: calculatedData.weight,
          wasteDetail: calculatedData.wasteDetail,
        };
        setTransactions((prev) => [newTx, ...prev]);
        setImpact((prev) => ({
          totalKg: Number((prev.totalKg + (calculatedData.weight || 0)).toFixed(1)),
          totalPoin: prev.totalPoin + calculatedData.totalPoin,
          totalEmisi: Number((prev.totalEmisi + calculatedData.totalEmisi).toFixed(2)),
        }));
      } else {
        alert('Gagal menyimpan setoran.');
      }
    } catch (err) {
      console.error(err);
      alert('Setoran berhasil dicatat ke sistem.');
      const newTx: Transaction = {
        id: Date.now().toString(),
        trxCode,
        type: 'Setor',
        description: desc,
        amount: calculatedData.totalPoin,
        date: 'Hari ini',
        monthGroup: 'NOVEMBER 2026',
        dropPoint: dropPointName,
        status: 'Menunggu',
        photoUrl: calculatedData.photoUrl || null,
        emisi: calculatedData.totalEmisi,
        weight: calculatedData.weight,
        wasteDetail: calculatedData.wasteDetail,
      };
      setTransactions((prev) => [newTx, ...prev]);
      setImpact((prev) => ({
        totalKg: Number((prev.totalKg + (calculatedData.weight || 0)).toFixed(1)),
        totalPoin: prev.totalPoin + calculatedData.totalPoin,
        totalEmisi: Number((prev.totalEmisi + calculatedData.totalEmisi).toFixed(2)),
      }));
    }
  };

  const navItems: { tab: TabId; label: string; icon: React.ReactNode }[] = [
    { tab: 'beranda', label: 'Beranda', icon: <IconHome /> },
    { tab: 'setor', label: 'Setor Sampah', icon: <IconRecycle /> },
    { tab: 'riwayat', label: 'Riwayat Transaksi', icon: <IconHistory /> },
    { tab: 'edukasi', label: 'Edukasi Sampah', icon: <IconBook /> },
    { tab: 'profil', label: 'Profil Saya', icon: <IconUser /> },
  ];

  const headerLabels: Record<TabId, { title: string; sub: string }> = {
    beranda: { title: 'Beranda Nasabah', sub: 'Ringkasan dampak lingkungan, reward, dan aktivitas Anda' },
    setor: { title: 'Setor Sampah', sub: 'Hitung estimasi poin & upload foto bukti setoran' },
    riwayat: { title: 'Riwayat Transaksi', sub: 'Catatan seluruh setoran dan penukaran saldo poin' },
    edukasi: { title: 'Pusat Edukasi Sampah', sub: 'Panduan praktis pemilahan, jenis sampah, dan ekonomi sirkular' },
    profil: { title: 'Profil Nasabah', sub: 'Kelola informasi identitas akun dan preferensi drop point Anda' },
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f6fbf7', fontFamily: 'var(--font-sans), "Plus Jakarta Sans", -apple-system, sans-serif' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR DENGAN HIJAU LEBIH SOFT & GRADASI HALUS ── */}
      <aside
        className={`fixed md:sticky top-0 h-screen inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out shadow-xl md:shadow-none overflow-hidden flex-shrink-0 ${
          sidebarOpen
            ? 'w-64 translate-x-0 opacity-100'
            : 'w-0 -translate-x-full md:translate-x-0 md:w-0 opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0d3820 0%, #12492a 45%, #185a34 100%)',
          borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <div className="w-64 h-full flex flex-col justify-between">
          <div>
            {/* Logo Match Landing Page + Close Button */}
            <div className="p-5 pb-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group select-none">
                <EcoBankMark size={36} />
                <div className="leading-tight">
                  <span className="block font-bold text-[17px] text-white tracking-tight group-hover:text-emerald-200 transition-colors">
                    EcoBank
                  </span>
                  <span className="block text-[10px] font-medium tracking-wider uppercase text-emerald-300 mt-0.5">
                    Bank Sampah Digital
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                title="Tutup Sidebar"
                aria-label="Tutup Sidebar"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="mx-5 mb-5" style={{ height: 1, background: 'rgba(255,255,255,0.09)' }} />

            {/* Navigation */}
            <nav className="px-4 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider px-3.5 mb-2.5 text-emerald-200/80">
                Menu Utama
              </p>
              {navItems.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => { setActiveTab(item.tab); if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all text-left"
                    style={isActive
                      ? {
                          background: 'linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.25))',
                          color: '#6ee7b7',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontWeight: 600,
                        }
                      : {
                          color: 'rgba(255,255,255,0.75)',
                          borderLeft: '4px solid transparent',
                          fontWeight: 500,
                        }
                    }
                  >
                    <span style={{ color: isActive ? '#6ee7b7' : 'rgba(255,255,255,0.5)' }}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar: Profil Pengguna Dinamis */}
          <div className="p-4 space-y-3">
            <div className="mx-2 mb-2" style={{ height: 1, background: 'rgba(255,255,255,0.09)' }} />

            {/* Interactive User Card -> navigasi ke tab Profil */}
            <button
              onClick={() => { setActiveTab('profil'); if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group"
              style={{
                background: activeTab === 'profil' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md" style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', color: '#064e3b' }}>
                {userProfile.avatarInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-emerald-200 transition-colors">
                  {userProfile.nama}
                </p>
                <p className="text-[10px] font-medium truncate text-emerald-300">
                  {userProfile.idNasabah} · Profil
                </p>
              </div>
              <IconChevronRight className="w-4 h-4 text-emerald-300 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>

          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div
        ref={mainScrollRef}
        onScroll={(e) => setHeaderScrolled(e.currentTarget.scrollTop > 20)}
        className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto"
      >
        {/* ── SCROLL-AWARE STICKY HEADER ── */}
        <header
          className="sticky top-0 z-40 shrink-0 px-5 md:px-8 py-3.5 flex items-center justify-between transition-all duration-300"
          style={
            headerScrolled
              ? {
                  background: "rgba(255, 255, 255, 0.96)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderBottom: "1px solid rgba(22, 163, 74, 0.14)",
                  boxShadow: "0 4px 20px rgba(14, 61, 35, 0.08)",
                }
              : {
                  background: "linear-gradient(135deg, #0e3d23 0%, #155431 40%, #1b6a3e 75%, #237b49 100%)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }
          }
        >

          <div className="flex items-center gap-3">

            <button
              className="p-2 rounded-xl transition-all flex items-center justify-center active:scale-95"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Tutup Sidebar (Tampilan Penuh)" : "Buka Sidebar"}
              aria-label="Toggle Sidebar"
              style={headerScrolled ? {
                background: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.18)',
                color: '#14532d',
              } : {
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
              }}
            >
              <IconSidebar className="w-5 h-5" />
            </button>
            <div>
              <h2
                className="text-base md:text-lg font-bold tracking-tight leading-snug"
                style={{ color: headerScrolled ? '#14532d' : 'white' }}
              >
                {headerLabels[activeTab].title}
              </h2>
              <p
                className="text-xs leading-normal hidden md:block mt-0.5 font-normal"
                style={{ color: headerScrolled ? '#6b9e7a' : 'rgba(209,250,229,0.8)' }}
              >
                {headerLabels[activeTab].sub}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md"
              style={headerScrolled ? {
                background: 'rgba(22,163,74,0.08)',
                color: '#15803d',
                borderColor: 'rgba(22,163,74,0.2)',
              } : {
                background: 'rgba(5,46,22,0.5)',
                color: '#a7f3d0',
                borderColor: 'rgba(52,211,153,0.3)',
              }}
            >
              <IconLogout className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </span>
          </div>
        </header>

        {/* ── HERO BANNER: SOFT NATURE GRADIENT DENGAN AMBIENT GLOW & WAVE ── */}
        <div
          className="relative overflow-hidden shrink-0"
          style={{
            background: 'linear-gradient(135deg, #0e3d23 0%, #155431 40%, #1b6a3e 75%, #237b49 100%)',
          }}
        >
          {/* Ambient Lighting Gradient Blobs */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 85% 20%, rgba(110, 231, 183, 0.22) 0%, transparent 55%),
                radial-gradient(circle at 10% 80%, rgba(52, 211, 153, 0.16) 0%, transparent 50%)
              `,
            }}
          />

        {/* Hero Banner Content (Beranda) dengan Sapaan Menyesuaikan Pengguna */}
          {activeTab === 'beranda' && (
            <div className="relative z-10 px-5 md:px-8 pt-20 pb-20 w-full max-w-6xl mx-auto transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end">
                
                {/* Greeting & Personal Info (Sisi Kiri - Proporsi 7 Kolom agar Lega saat Sidebar Buka) */}
                <div className="lg:col-span-7 space-y-5">

                  <div className="space-y-3">
                    <h1
                      suppressHydrationWarning
                      className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.18]"
                    >
                      {greeting}, <br />
                      <span className="text-emerald-300">{userProfile.nama}!</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl font-normal">
                      Halo <strong className="font-semibold text-white">{userProfile.nama}</strong> ({userProfile.idNasabah}), kontribusi pilah sampah Anda telah mencegah{' '}
                      <strong className="font-semibold text-emerald-200">{impact.totalEmisi} kg CO₂</strong> mencemari lingkungan.
                    </p>
                  </div>

                  {/* Quick Action Buttons (Tampilan Lebih Bersih & Terstruktur) */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-2">
                    <button
                      onClick={() => setActiveTab('setor')}
                      className="group inline-flex items-center gap-2.5 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                      style={{
                        background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                        boxShadow: '0 10px 24px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
                      }}
                    >
                      <IconRecycle className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                      <span>Setor Sampah Sekarang</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('profil')}
                      className="inline-flex items-center gap-2.5 font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-2xl text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 backdrop-blur-md"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1.5px solid rgba(255, 255, 255, 0.22)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                      }}
                    >
                      <IconUser className="w-4 h-4 text-emerald-300" />
                      <span>Lihat Profil Saya</span>
                    </button>
                  </div>
                </div>

                {/* Target Hijau Card + Mascot Besar & Gelembung Sapaan (Sisi Kanan - 5 Kolom) */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end pt-36 sm:pt-40 lg:pt-28">
                  <div className="relative w-full max-w-md">
                    
                    {/* Ambient Glow Lembut di Belakang Maskot */}
                    <div
                      className="absolute -top-36 right-0 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-45"
                      style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }}
                    />

                    {/* Maskot Besar (Diturunkan ke -top-36 sm:-top-40 agar ujung daun tidak terpotong header) */}
                    <div className="absolute -top-30 sm:-top-45 -right-2 sm:right-0 w-60 h-60 sm:w-64 sm:h-64 z-0 pointer-events-none select-none">
                      <Image
                        src="/images/maskot_ecobank2.png"
                        alt="Maskot EcoBank"
                        fill
                        sizes="(max-width: 640px) 240px, 256px"
                        className="object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.35)]"
                        priority
                      />
                    </div>

                    {/* Speech Bubble Sapaan Personal (Ikut diturunkan agar sejajar kepala maskot) */}
                    <div
                      className="flex items-center gap-2 absolute -top-20 sm:-top-24 right-48 sm:right-52 z-20 px-3.5 py-2 rounded-2xl rounded-br-sm backdrop-blur-md"
                      style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.28)',
                        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
                      }}
                    >
                      <span className="text-xs font-bold text-white whitespace-nowrap">
                        Halo, {userProfile.nama.split(' ')[0]}!
                      </span>
                    </div>

                    {/* Target Hijau Card (Lapisan Atas z-10) */}
                    <div
                      className="relative z-10 w-full rounded-2xl p-6 backdrop-blur-xl text-white shadow-xl space-y-3.5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.06) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                          Target Bulan Ini
                        </span>
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                          {Math.min(100, Math.round((impact.totalKg / 10) * 100))}% Tercapai
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-100/90 font-normal">
                            Terkumpul: <strong className="font-semibold text-white">{impact.totalKg} kg</strong>
                          </span>
                          <span className="text-emerald-200 font-semibold">Target: 10.0 kg</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2.5 rounded-full bg-black/25 overflow-hidden p-0.5 border border-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(100, (impact.totalKg / 10) * 100)}%`,
                              background: 'linear-gradient(90deg, #34d399, #86efac)',
                            }}
                          />
                        </div>

                        <p className="text-[11px] text-emerald-100/85 leading-relaxed font-normal pt-0.5">
                          Setor <strong className="font-semibold text-white">{Math.max(0, +(10 - impact.totalKg).toFixed(1))} kg</strong> lagi untuk klaim bonus{' '}
                          <strong className="font-semibold text-amber-200">+100 Poin</strong> &amp; naik ke{' '}
                          <strong className="font-semibold text-white">Level 3</strong>!
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Spacer halus untuk tab selain Beranda agar wave pembatas selaras dengan header */}
          {activeTab !== 'beranda' && (
            <div className="h-4 sm:h-6" />
          )}

          {/* ── GELOMBANG HALUS / WAVE DIVIDER DENGAN TRANSISI LEMBUT ── */}
          <div className="w-full overflow-hidden leading-none pointer-events-none">
            <svg
              className={`relative block w-full ${activeTab === 'beranda' ? 'h-8 sm:h-12 md:h-16' : 'h-7 sm:h-9 md:h-11'}`}
              viewBox="0 0 1440 90"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 90 L0 40 Q180 0 360 30 Q540 60 720 25 Q900 0 1080 35 Q1260 65 1440 20 L1440 90 Z"
                fill="#f6fbf7"
              />
            </svg>
          </div>
        </div>

        {/* ── WORKSPACE AREA ── */}
        <main className={`flex-1 p-5 md:p-8 w-full mx-auto space-y-6 transition-all duration-300 ${sidebarOpen ? 'max-w-6xl' : 'max-w-7xl'}`}>

{/* ══════════════════════════════════════
              TAB 1: BERANDA
          ══════════════════════════════════════ */}
          {activeTab === 'beranda' && (
            <div className="space-y-7 pt-1.5">

              {/* 1. Hero Statistic Slider — 4-in-1 Modern Auto Carousel */}
              <HeroStatSlider
                impact={impact}
                setorCount={transactions.filter((t) => t.type === 'Setor').length}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />

              {/* 2. UNIFIED DASHBOARD ACTIONS WRAPPER (Pembungkus Luar Pemersatu 3 Bagian) */}
              <div className="rounded-3xl p-5 sm:p-7 bg-[#edf5f0]/70 border border-emerald-900/10 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                  {/* LEFT: Komposisi Sampah & Drop Point (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-5">

                    {/* Komposisi Sampah Anda */}
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-950/10 shadow-xs space-y-4">
                      {/* Header: Judul + 7.0 kg total + Setor Baru */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-bold text-base tracking-tight text-emerald-950">
                            Komposisi Sampah Anda
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                            {impact.totalKg.toFixed(1)} kg total
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveTab('setor')}
                          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors inline-flex items-center gap-1 shrink-0"
                        >
                          + Setor Baru <IconChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* 4 Baris Sampah */}
                      <div className="space-y-3.5 pt-1">
                        {[
                          { label: 'Botol Plastik (PET/HDPE)', weight: '3.5 kg', pct: 50, barClass: 'bg-emerald-700', icon: 'plastik' },
                          { label: 'Kardus & Kertas', weight: '2.0 kg', pct: 29, barClass: 'bg-emerald-600', icon: 'kertas' },
                          { label: 'Kaleng Logam & Alumunium', weight: '1.0 kg', pct: 14, barClass: 'bg-teal-700', icon: 'logam' },
                          { label: 'Botol & Pecahan Kaca', weight: '0.5 kg', pct: 7, barClass: 'bg-lime-700', icon: 'kaca' },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1.5">
                            <div className="flex items-center justify-between gap-3 text-xs">
                              <span className="flex items-center gap-2.5 font-semibold text-slate-800 min-w-0">
                                <span className="w-7 h-7 rounded-lg bg-emerald-50/90 text-emerald-800 border border-emerald-200/60 flex items-center justify-center shrink-0">
                                  <WasteIcon id={item.icon} className="w-3.5 h-3.5" />
                                </span>
                                <span className="truncate">{item.label}</span>
                              </span>
                              <span className="text-slate-600 font-medium tabular-nums shrink-0">
                                <strong className="font-bold text-slate-900">{item.weight}</strong> · {item.pct}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${item.barClass}`}
                                style={{ width: `${item.pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lokasi Drop Point Terdekat */}
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-950/10 shadow-xs space-y-3.5">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-base tracking-tight text-emerald-950">
                          Lokasi Drop Point Terdekat
                        </h3>
                        <span className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <IconMapPin className="w-4 h-4" />
                        </span>
                      </div>

                      {/* 2 Lokasi Vertikal Berjenjang */}
                      <div className="space-y-3">
                        {/* 1. Terdekat (Highlighted) */}
                        <div className="rounded-xl p-3.5 bg-emerald-50/40 border-2 border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300/80 shrink-0">
                              <IconNavigation className="w-3 h-3 text-emerald-700" />
                              0.8 km · Terdekat
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Bank Sampah Syiah Kuala</h4>
                              <p className="text-[11px] text-slate-500 truncate">Jl. Teuku Nyak Arief No. 42</p>
                              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                                Buka · 08:00 - 16:00
                              </span>
                            </div>
                          </div>
                          <button className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#135431] hover:bg-[#0e4025] text-white shadow-xs flex items-center justify-center gap-1 shrink-0 whitespace-nowrap active:scale-95 transition-all">
                            Petunjuk Rute →
                          </button>
                        </div>

                        {/* 2. Ulee Kareng */}
                        <div className="rounded-xl p-3.5 bg-white border border-slate-200/90 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 shrink-0">
                              <IconNavigation className="w-3 h-3 text-slate-400" />
                              1.6 km
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Bank Sampah Ulee Kareng</h4>
                              <p className="text-[11px] text-slate-500 truncate">Jl. Lamreung No. 18</p>
                              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                                Buka · 09:00 - 17:00
                              </span>
                            </div>
                          </div>
                          <button className="px-3.5 py-1.5 rounded-xl text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 shrink-0 whitespace-nowrap active:scale-95 transition-all">
                            Rute →
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT: Tukar Poin Cepat (5 cols) */}
                  <div className="lg:col-span-5 h-full">
                    <div id="section-tukar-poin" className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-950/10 shadow-xs space-y-4 scroll-mt-24 h-full flex flex-col justify-between">
                      <div className="space-y-3.5">
                        {/* Header: title + 200 Pts */}
                        <div className="flex items-center justify-between gap-3 pb-1">
                          <h3 className="font-bold text-base tracking-tight text-emerald-950">
                            Tukar Poin Cepat
                          </h3>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200/80 shadow-xs tabular-nums">
                            <IconStar className="w-3.5 h-3.5 text-amber-500" />
                            {impact.totalPoin} Pts
                          </span>
                        </div>

                        {/* 4 Green Reward Cards */}
                        <div className="space-y-2.5">
                          {availableRewards.map((rew) => {
                            const canAfford = impact.totalPoin >= rew.points;
                            const deficit = Math.max(0, rew.points - impact.totalPoin);
                            return (
                              <div
                                key={rew.id}
                                className={`rounded-2xl p-3.5 sm:p-4 text-white flex items-center justify-between gap-3 shadow-xs transition-all ${
                                  canAfford
                                    ? 'bg-[#155a36] hover:bg-[#124f2f]'
                                    : 'bg-[#185334]/85 opacity-90'
                                }`}
                              >
                                {/* Left icon */}
                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-white">
                                  <RewardIcon id={rew.id} className="w-5 h-5" />
                                </div>

                                {/* Middle: Title, Category, Points */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-bold text-white truncate leading-snug">
                                    {rew.title}
                                  </p>
                                  <p className="text-[11px] text-emerald-200/80 truncate mt-0.5">
                                    {rew.category}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold text-emerald-300 tabular-nums">
                                      {rew.points} Pts
                                    </span>
                                    {!canAfford && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/25 text-amber-200 border border-amber-300/40 tabular-nums">
                                        (- {deficit} Pts)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Right button */}
                                {canAfford ? (
                                  <button
                                    onClick={() => handleRedeemReward(rew)}
                                    className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-xs"
                                  >
                                    Tukar
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white/50 cursor-not-allowed shrink-0"
                                  >
                                    Kurang
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════
              TAB 2: SETOR SAMPAH (Kalkulator + Live Kamera)
          ══════════════════════════════════════ */}
          {activeTab === 'setor' && (
            <div className="w-full pt-1">
              <CalculatorSection onSave={handleSaveDropoff} />
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB 3: RIWAYAT TRANSAKSI
          ══════════════════════════════════════ */}
          {activeTab === 'riwayat' && (
            <div className="w-full pt-1">
              <RiwayatTransaksiSection transactions={transactions} />
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB 4: EDUKASI SAMPAH
          ══════════════════════════════════════ */}
          {activeTab === 'edukasi' && (
            <EdukasiSection
              onNavigateSetor={() => setActiveTab('setor')}
              expandedArticle={expandedArticle}
              setExpandedArticle={setExpandedArticle}
            />
          )}

          {/* ══════════════════════════════════════
              TAB 5: FITUR PROFIL PENGGUNA
          ══════════════════════════════════════ */}
          {activeTab === 'profil' && (
            <div className="max-w-4xl mx-auto space-y-6">

              {profileSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
                  <IconCheck className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {/* Profile Header Card */}
              <div
                className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
                style={{ background: 'linear-gradient(135deg, #104929 0%, #165b34 50%, #1f7746 100%)' }}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-300 text-slate-900 flex items-center justify-center text-3xl font-black shadow-xl border-2 border-white/30">
                    {userProfile.avatarInitial}
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl font-extrabold text-white">{userProfile.nama}</h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400/25 text-emerald-200 border border-emerald-300/30">
                        <IconShield className="w-3 h-3" />
                        Nasabah Terverifikasi
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100/80">
                      ID Nasabah: <strong className="text-white">{userProfile.idNasabah}</strong> · Bergabung sejak {userProfile.joinDate}
                    </p>
                    <p className="text-xs text-emerald-200 font-medium">
                      Peringkat: <strong className="text-white">{userProfile.level}</strong>
                    </p>
                  </div>
                </div>

                {/* Quick stats on banner */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15 text-center">
                  <div>
                    <p className="text-[10px] text-emerald-200 font-medium">Total Sampah</p>
                    <p className="text-lg font-extrabold text-white mt-0.5">{impact.totalKg} kg</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-200 font-medium">Saldo Poin</p>
                    <p className="text-lg font-extrabold text-amber-300 mt-0.5">{impact.totalPoin} Pts</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-200 font-medium">CO₂ Dicegah</p>
                    <p className="text-lg font-extrabold text-white mt-0.5">{impact.totalEmisi} kg</p>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Informasi Pribadi & Kontak</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Perubahan nama akan langsung memperbarui sapaan Anda di Beranda</p>
                  </div>
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <IconEdit className="w-4 h-4" />
                  </span>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                      <input
                        type="text"
                        value={userProfile.nama}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUserProfile((prev) => ({
                            ...prev,
                            nama: val,
                            avatarInitial: val ? val[0].toUpperCase() : 'U',
                          }));
                        }}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Alamat Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nomor Handphone / WhatsApp</label>
                      <input
                        type="text"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Mitra Drop Point Utama</label>
                      <select
                        value={userProfile.dropPointFavorit}
                        onChange={(e) => setUserProfile({ ...userProfile, dropPointFavorit: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Bank Sampah Syiah Kuala">Bank Sampah Syiah Kuala (0.8 km)</option>
                        <option value="Bank Sampah Ulee Kareng">Bank Sampah Ulee Kareng (1.6 km)</option>
                        <option value="Bank Sampah Baiturrahman">Bank Sampah Baiturrahman (3.2 km)</option>
                        <option value="Bank Sampah Banda Raya">Bank Sampah Banda Raya (4.5 km)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Alamat Tempat Tinggal (Penjemputan Sampah)</label>
                    <textarea
                      rows={2}
                      value={userProfile.address}
                      onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                    >
                      Simpan Perubahan Profil
                    </button>
                  </div>
                </form>
              </div>

              {/* Achievements & Badges */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-4">
                <h4 className="text-base font-bold text-slate-900">Lencana & Prestasi Lingkungan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: 'Pioneer Perdana', desc: 'Menyetor sampah pertama kali', status: 'Diraih', color: '#16a34a' },
                    { title: 'Penyelamat 3kg CO₂', desc: 'Mencegah emisi > 3 kg karbon', status: 'Diraih', color: '#0284c7' },
                    { title: 'Sahabat Daur Ulang', desc: 'Menyetor 3 jenis sampah berbeda', status: 'Diraih', color: '#d97706' },
                  ].map((b) => (
                    <div key={b.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{b.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-100">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{b.desc}</p>
                    </div>
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
