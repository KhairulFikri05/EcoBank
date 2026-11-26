"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import CommunityImpactCard from "@/components/CommunityImpactCard";

/* ─────────────────────────────────────────────
   SVG Logo — custom leaf + coin mark
───────────────────────────────────────────── */
function EcoBankMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EcoBank Logo"
    >
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dcfce7" />
          <stop offset="100%" stopColor="#bbf7d0" />
        </linearGradient>
      </defs>
      {/* Hexagon base */}
      <path
        d="M24 2 L41.3 11 L41.3 29 L24 38 L6.7 29 L6.7 11 Z"
        fill="url(#lg1)"
      />
      {/* Leaf shape */}
      <path
        d="M24 11 C31 14 35 20 32 26 C29 32 22 33 18 29 C14 25 15 17 20 13 C21.5 11.8 23 11 24 11 Z"
        fill="url(#lg2)"
      />
      {/* Leaf midrib */}
      <path
        d="M24 11 C23 19 21 26 20 32"
        stroke="#15803d"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaf veins */}
      <path d="M23 16 C26 14.5 29 15.5 31 18" stroke="#15803d" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M22 21 C25 19.5 29 20.5 31 23" stroke="#15803d" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Stem */}
      <path
        d="M20 32 L20 37"
        stroke="#bbf7d0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Coin base hint at bottom */}
      <ellipse cx="20" cy="37" rx="4" ry="1.5" fill="#bbf7d0" opacity="0.6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navScrolled = scrollY > 60;

  const navLinks = ["Beranda", "Tentang", "Layanan", "Cara Kerja", "Kontak"];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "var(--font-geist-sans, 'Plus Jakarta Sans', system-ui, sans-serif)" }}>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: navScrolled ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(22,163,74,0.12)" : "none",
          boxShadow: navScrolled ? "0 1px 24px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <EcoBankMark size={40} />
            <div className="leading-tight">
              <span
                className="block font-extrabold text-[18px] tracking-tight transition-colors"
                style={{ color: navScrolled ? "#0a1f0e" : "#ffffff", letterSpacing: "-0.03em" }}
              >
                EcoBank
              </span>
              <span
                className="block text-[10px] font-semibold tracking-widest uppercase transition-colors"
                style={{ color: navScrolled ? "#16a34a" : "rgba(134,239,172,0.9)" }}
              >
                Bank Sampah Digital
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-semibold transition-colors duration-200 hover:opacity-80"
                style={{ color: navScrolled ? "#374151" : "rgba(255,255,255,0.88)" }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200"
              style={{
                color: navScrolled ? "#16a34a" : "white",
                background: navScrolled ? "transparent" : "rgba(255,255,255,0.1)",
                border: navScrolled ? "1.5px solid #16a34a" : "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "white",
                boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
              }}
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2.5 rounded-xl transition-colors"
            style={{ color: navScrolled ? "#1f2937" : "white" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: menuOpen ? "400px" : "0",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="px-5 py-4 space-y-1 border-t border-green-100">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="block py-3 px-3 text-sm font-semibold text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-3 pb-1 flex flex-col gap-2">
              <Link href="/login" className="text-center text-sm font-bold py-3 border-2 border-green-600 text-green-700 rounded-xl hover:bg-green-50 transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="text-center text-sm font-bold py-3 rounded-xl text-white" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO SECTION (Photographic & Modern)
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="beranda"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(3, 22, 11, 0.78) 0%, rgba(4, 28, 14, 0.65) 50%, rgba(2, 14, 7, 0.92) 100%),
            url('https://6af1ee3684dbf461b656a2b4.imgix.net/lucas-van-oort-mhtPKJrG_EU-unsplash.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* ── Hero content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10 w-full pt-28 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">

            {/* LEFT — Text & Primary Actions */}
            <div className="lg:col-span-6 space-y-6">
              {/* Headline */}
              <h1
                className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.12] text-white"
                style={{ letterSpacing: "-0.04em" }}
              >
                Ubah Sampah Jadi{" "}
                <span className="text-emerald-300">Poin Nyata</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base text-slate-200/90 leading-relaxed max-w-lg">
                EcoBank hadir sebagai ekosistem bank sampah digital. Setor sampah, kumpulkan poin, dan tukarkan dengan reward sambil menjaga bumi tetap hijau.
              </p>

              {/* Action row with Rating (Reference 1 style) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                >
                  <span>Mulai Sekarang</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                {/* Rating Badge (Reference 1 style) */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white text-xs">
                  <span className="font-extrabold text-sm text-amber-300">4.9 ★</span>
                  <span className="text-slate-300">1.458 reviews</span>
                </div>
              </div>

              {/* Quick Link */}
              <div className="pt-2">
                <a
                  href="#cara-kerja"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  <span>Pelajari cara kerja penukaran sampah</span>
                  <span>↓</span>
                </a>
              </div>
            </div>

            {/* RIGHT — Dual Aesthetic Floating Cards (Reference 1 style) */}
            <div className="lg:col-span-6 hidden lg:flex justify-end items-center">
              <CommunityImpactCard />
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%" }}>
            <path d="M0 90 L0 40 Q180 0 360 30 Q540 60 720 25 Q900 0 1080 35 Q1260 65 1440 20 L1440 90 Z" fill="#f8fdf9" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PARTNER LOGOS
      ══════════════════════════════════════ */}
      <section style={{ background: "#f8fdf9", borderBottom: "1px solid #e5f7ea" }} className="py-10">
        <div className="max-w-6xl mx-auto px-5 lg:px-10">
           <p className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-7" style={{ color: "#9ca3af" }}>
            Didukung & Dipercaya Oleh
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-14">
            {["Kemenkes RI", "KLHK", "Bank BRI", "Dinas Lingkungan", "GoPay", "OVO"].map((b) => (
              <span
                key={b}
                className="text-sm font-black tracking-tight"
                style={{ color: "#c4cfc7", letterSpacing: "-0.02em" }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

 {/* ══════════════════════════════════════
          ABOUT SECTION
      ══════════════════════════════════════ */}
      <section id="tentang" className="py-24 md:py-32" style={{ background: "#f8fdf9" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

            {/* LEFT — Foto Nyata + Floating Stat Card */}
            <div className="relative">
              {/* Bingkai Foto Utama */}
              <div
                className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] relative"
                style={{ border: "1px solid #dcfce7" }}
              >
                <img
                  src="https://6af1ee3684dbf461b656a2b4.imgix.net/sandbox/vitaly-gariev-_RInM2eMgLQ-unsplash.jpg"
                  alt="Kegiatan Pengelolaan Sampah EcoBank"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradien tipis di bagian bawah foto agar menyatu halus */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, transparent 60%, rgba(10, 31, 14, 0.35) 100%)",
                  }}
                />
              </div>

              {/* Floating Card 1: Dampak Kolektif (Pojok Kanan Bawah) */}
              <div
                className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:right-6 bg-white rounded-2xl p-4 md:p-5 flex items-center gap-4 max-w-xs transition-transform duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid #dcfce7",
                  boxShadow: "0 16px 36px rgba(10, 31, 14, 0.12)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #0f4a24, #16a34a)",
                    boxShadow: "0 6px 16px rgba(22, 163, 74, 0.25)",
                  }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#16a34a" }}>
                    Dampak Kolektif
                  </p>
                  <p className="text-base font-extrabold" style={{ color: "#0a1f0e", letterSpacing: "-0.02em" }}>
                    12.450+ kg CO₂
                  </p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>
                    Berhasil dikurangi bersama
                  </p>
                </div>
              </div>

              {/* Floating Card 2: Badge Kecil Terverifikasi (Pojok Kiri Atas) */}
              <div
                className="hidden sm:flex items-center gap-2.5 absolute -top-4 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full"
                style={{
                  border: "1px solid #bbf7d0",
                  boxShadow: "0 8px 20px rgba(10, 31, 14, 0.08)",
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold" style={{ color: "#15803d" }}>
                  100% Transparan & Real-Time
                </span>
              </div>
            </div>

{/* RIGHT — Text */}
            <div className="space-y-7 pt-2 sm:pt-4 lg:pt-0">
              {/* Eyebrow & Judul */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[2px] rounded-full" style={{ background: "#16a34a" }} />
                  <span
                    className="text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: "#15803d" }}
                  >
                    Tentang EcoBank
                  </span>
                </div>

                <h2
                  className="text-3xl md:text-4xl xl:text-[42px] font-extrabold leading-[1.15]"
                  style={{ color: "#0a1f0e", letterSpacing: "-0.03em" }}
                >
                  Mengubah Kebiasaan Pilah Sampah Menjadi Nilai Nyata
                </h2>

                <p className="text-base leading-relaxed" style={{ color: "#4b5563" }}>
                  EcoBank hadir menjembatani rumah tangga dan komunitas dengan pengelolaan bank sampah yang modern. Setiap botol, kertas, dan kaleng yang kamu pilah tercatat secara transparan dan langsung terkonversi menjadi saldo poin.
                </p>
              </div>

              {/* 2 Kartu Highlight — Light Glassmorphism & Gradasi Lembut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1: 4 Kategori */}
                <div
                  className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-md"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 253, 244, 0.75) 100%)",
                    border: "1px solid #bbf7d0",
                    boxShadow: "0 10px 25px rgba(10, 31, 14, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ background: "#dcfce7", color: "#15803d" }}
                    >
                      Terintegrasi
                    </span>
                  </div>
                  <p
                    className="text-2xl font-extrabold"
                    style={{ color: "#0a1f0e", letterSpacing: "-0.03em" }}
                  >
                    4 Kategori
                  </p>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: "#4b5563" }}>
                    Plastik, kertas, logam, hingga kaca terkelola rapi
                  </p>
                </div>

                {/* Card 2: Real-Time */}
                <div
                  className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-md"
                  style={{
                    background: "linear-gradient(135deg, rgba(220, 252, 231, 0.65) 0%, rgba(255, 255, 255, 0.85) 100%)",
                    border: "1px solid #86efac",
                    boxShadow: "0 10px 25px rgba(22, 163, 74, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ background: "rgba(22, 163, 74, 0.12)", color: "#16a34a" }}
                    >
                      Otomatis
                    </span>
                  </div>
                  <p
                    className="text-2xl font-extrabold"
                    style={{ color: "#16a34a", letterSpacing: "-0.03em" }}
                  >
                    Real-Time
                  </p>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: "#4b5563" }}>
                    Perhitungan poin &amp; jejak reduksi CO₂ otomatis
                  </p>
                </div>
              </div>

              {/* Tombol Utama & Tombol Sekunder Glass Sejajar */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #0a1f0e 0%, #14532d 100%)",
                    color: "white",
                    boxShadow: "0 8px 20px rgba(10, 31, 14, 0.22)",
                  }}
                >
                  <span>Bergabung Sekarang</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <a
                  href="#cara-kerja"
                  className="group inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-md"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    color: "#15803d",
                    border: "1.5px solid #bbf7d0",
                    boxShadow: "0 4px 14px rgba(10, 31, 14, 0.05)",
                  }}
                >
                  <span>Pelajari Alur Setor</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

 {/* ══════════════════════════════════════
          SERVICES
      ══════════════════════════════════════ */}
      <section
        id="layanan"
        className="relative py-28 md:py-36 overflow-hidden"
        style={{ background: "radial-gradient(circle at center, #0e4424 0%, #031a09 80%)" }}
      >
        {/* Wave Divider Atas (Transisi dari Hero Section) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            className="relative block w-full h-12 md:h-20"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L1440,0 L1440,45 C1200,115 960,10 720,65 C480,120 240,25 0,80 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full"
              style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}
            >
              Layanan Kami
            </span>
            <h2
              className="text-3xl md:text-4xl xl:text-5xl font-extrabold"
              style={{ color: "#ffffff", letterSpacing: "-0.04em" }}
            >
              Pilihan Terbaik untuk Lingkunganmu
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#f3f4f6" }}>
              Berbagai layanan unggulan yang kami sediakan untuk kemudahan pengelolaan sampahmu.
            </p>
          </div>

          {/* Service cards - Centered Frosted White Glass */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                iconUrl: "https://cdn-icons-png.flaticon.com/512/3976/3976961.png",
                title: "Setor Sampah",
                desc: "Setorkan plastik, kertas, logam, dan kaca untuk dapatkan poin instan.",
              },
              {
                iconUrl: "https://cdn-icons-png.flaticon.com/512/18098/18098110.png",
                title: "Tukar Poin",
                desc: "Redeem poin menjadi voucher belanja, saldo e-wallet, atau kebutuhan harian.",
              },
              {
                iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828911.png",
                title: "Pantau Dampak",
                desc: "Pantau total pengurangan emisi CO₂ kamu secara real-time di dashboard.",
              },
              {
                iconUrl: "https://cdn-icons-png.flaticon.com/512/681/681494.png",
                title: "Komunitas Hijau",
                desc: "Ikuti aksi bersih lingkungan dan kolaborasi bareng komunitas sekitar.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group rounded-3xl p-8 flex flex-col items-center text-center justify-between gap-6 transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-xl"
                style={{
                  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.05) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
                }}
              >
                {/* Lingkaran Ikon Kaca Putih */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                  }}
                >
                  <img
                    src={s.iconUrl}
                    alt={s.title}
                    className="w-7 h-7 object-contain brightness-0 invert"
                  />
                </div>

                {/* Judul & Deskripsi Rata Tengah */}
                <div className="space-y-2.5 flex-1">
                  <h3 className="font-bold text-base text-white tracking-tight">
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {s.desc}
                  </p>
                </div>

                {/* Tautan Bawah Kuning */}
                <a
                  href="#cara-kerja"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80 pt-1"
                  style={{ color: "#facc15" }}
                >
                  <span>Pelajari lebih lanjut</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider Bawah (Transisi ke Section Berikutnya) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            className="relative block w-full h-12 md:h-20"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C320,125 640,-10 960,65 C1200,115 1350,70 1440,50 L1440,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="cara-kerja" className="py-24 md:py-32" style={{ background: "#f8fdf9" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full"
              style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}
            >
              Cara Kerja
            </span>
            <h2
              className="text-3xl md:text-4xl xl:text-5xl font-extrabold"
              style={{ color: "#0a1f0e", letterSpacing: "-0.04em" }}
            >
              Mudah dalam 4 Langkah
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#6b7280" }}>
              Mulai perjalanan hijaumu bersama EcoBank dalam beberapa langkah sederhana.
            </p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/10735/10735262.png",
                title: "Daftar Akun",
                desc: "Buat akun EcoBank gratis dengan email dan data diri.",
              },
              {
                step: "02",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/3976/3976961.png",
                title: "Pilah Sampah",
                desc: "Pisahkan sampah berdasarkan jenis: plastik, kertas, logam, kaca.",
              },
              {
                step: "03",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/4248/4248547.png",
                title: "Setor & Hitung",
                desc: "Input jenis dan berat sampah, poin langsung terhitung otomatis.",
              },
              {
                step: "04",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/18098/18098110.png",
                title: "Tukar Reward",
                desc: "Gunakan poin untuk voucher, e-wallet, dan hadiah menarik.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className="relative group"
              >
                {/* Connector line */}
                {i < 3 && (
                  <div
                    className="hidden lg:block absolute top-9 left-[calc(50%+40px)] right-[-50%] h-px z-0"
                    style={{ background: "linear-gradient(90deg, #bbf7d0, transparent)" }}
                  />
                )}

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* Icon circle */}
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center relative transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg,#16a34a,#0d6a2e)",
                      boxShadow: "0 8px 24px rgba(22,163,74,0.3)",
                    }}
                  >
                    <img
                      src={s.iconUrl}
                      alt={s.title}
                      className="w-9 h-9 object-contain brightness-0 invert"
                    />
                    <span
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-[11px] font-black flex items-center justify-center"
                      style={{
                        background: "white",
                        color: "#16a34a",
                        border: "2px solid #16a34a",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      }}
                    >
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm" style={{ color: "#111827", letterSpacing: "-0.02em" }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed max-w-[160px]" style={{ color: "#6b7280" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 font-bold text-sm px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                color: "white",
                boxShadow: "0 8px 24px rgba(22,163,74,0.35)",
              }}
            >
              Mulai Perjalanan Hijau Kamu →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WASTE TYPES (dark section)
      ══════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(145deg,#031a09,#0a3018,#071c0e)" }}>
        {/* BG glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-96 h-96 rounded-full" style={{ top: "-100px", right: "-100px", background: "radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)" }} />
          <div className="absolute w-64 h-64 rounded-full" style={{ bottom: "-50px", left: "-50px", background: "radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ letterSpacing: "-0.04em" }}>
              Jenis Sampah yang Kami Terima
            </h2>
            <p className="text-sm" style={{ color: "rgba(187,247,208,0.65)" }}>
              Setorkan berbagai jenis sampah dan raih poin lebih banyak!
            </p>
          </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              {
                image: "/images/plastik.jpeg",
                name: "Plastik",
                rate: "50 Poin/kg",
                co2: "0.6 kg CO₂/kg",
                glow: "rgba(59,130,246,0.1)",
                border: "rgba(96,165,250,0.2)",
              },
              {
                image: "/images/kertas.jpeg",
                name: "Kertas & Kardus",
                rate: "30 Poin/kg",
                co2: "0.4 kg CO₂/kg",
                glow: "rgba(245,158,11,0.1)",
                border: "rgba(251,191,36,0.2)",
              },
              {
                image: "/images/kaleng.jpeg",
                name: "Logam & Kaleng",
                rate: "70 Poin/kg",
                co2: "0.9 kg CO₂/kg",
                glow: "rgba(148,163,184,0.1)",
                border: "rgba(203,213,225,0.2)",
              },
              {
                image: "/images/kaca.jpeg",
                name: "Kaca & Botol",
                rate: "40 Poin/kg",
                co2: "0.5 kg CO₂/kg",
                glow: "rgba(52,211,153,0.1)",
                border: "rgba(52,211,153,0.2)",
              },
            ].map((w) => (
              <div
                key={w.name}
                className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1"
                style={{ background: w.glow, border: `1px solid ${w.border}`, backdropFilter: "blur(8px)" }}
              >
                {/* Gambar memenuhi bagian atas kartu */}
                <div className="w-full h-40 bg-white overflow-hidden">
                  <img
                    src={w.image}
                    alt={w.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Bagian konten teks di bawah */}
                <div className="p-5 text-center space-y-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-sm text-white" style={{ letterSpacing: "-0.02em" }}>
                    {w.name}
                  </h3>
                  <div className="space-y-1.5">
                    <span
                      className="inline-block text-[11px] font-bold px-3 py-1 rounded-full"
                      style={{ background: "rgba(74,222,128,0.15)", color: "#86efac", border: "1px solid rgba(74,222,128,0.2)" }}
                    >
                      {w.rate}
                    </span>
                    <p className="text-[11px]" style={{ color: "rgba(187,247,208,0.55)" }}>
                      {w.co2}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: "#ffffff" }}>
        {/* Pembatas Lengkung Simetris Atas (Menyatu dengan section sebelumnya #f8fdf9) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            className="relative block w-full h-12 md:h-20"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L1440,0 L1440,20 Q720,100 0,20 Z"
              fill="#f8fdf9"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-14 space-y-4">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full"
              style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}
            >
              Testimoni
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#0a1f0e", letterSpacing: "-0.04em" }}>
              Kata Mereka tentang EcoBank
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Budi Santoso",
                role: "Nasabah, Jakarta",
                rating: 5,
                text: "Sejak pakai EcoBank, saya sudah kumpulkan 15 kg sampah plastik dan dapat voucher GoPay Rp75.000! Aplikasinya mudah banget dipakai.",
                avatar: "B",
                avatarBg: "#dcfce7",
                avatarColor: "#15803d",
              },
              {
                name: "Siti Rahayu",
                role: "Ibu Rumah Tangga, Bandung",
                rating: 5,
                text: "Senang banget ada aplikasi seperti ini. Sampah rumah tangga kami sekarang tidak terbuang sia-sia, malah dapat poin yang bermanfaat.",
                avatar: "S",
                avatarBg: "#fef3c7",
                avatarColor: "#b45309",
              },
              {
                name: "Ahmad Fajar",
                role: "Mahasiswa, Surabaya",
                rating: 5,
                text: "EcoBank mengajarkan saya betapa pentingnya memilah sampah. Dashboard-nya keren, bisa lihat berapa CO₂ yang sudah saya hemat.",
                avatar: "A",
                avatarBg: "#dbeafe",
                avatarColor: "#1d4ed8",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-3xl p-7 space-y-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{ background: "#f8fdf9", border: "1.5px solid #e5f7ea" }}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>

                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid #e5f7ea" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                    style={{ background: t.avatarBg, color: t.avatarColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#111827", letterSpacing: "-0.01em" }}>{t.name}</p>
                    <p className="text-[11px]" style={{ color: "#9ca3af" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pembatas Lengkung Simetris Bawah + Garis Tepi Halus */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            className="relative block w-full h-14 md:h-20"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 Q720,0 1440,80 L1440,100 L0,100 Z"
              fill="#f8fdf9"
            />
            <path
              d="M-10,80 Q720,0 1450,80"
              fill="none"
              stroke="#15803d"
              strokeWidth="1"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section className="py-20 px-5 lg:px-10" style={{ background: "#f8fdf9" }}>
        <div className="max-w-4xl mx-auto">
          <div
  className="rounded-[32px] p-10 md:p-16 text-center relative overflow-hidden"
  style={{
    background: "linear-gradient(145deg,#071c0e,#0f4a24,#16a34a)",
    boxShadow: "0 24px 80px rgba(22,163,74,0.3)",
  }}
>
  {/* BG decorations */}
  <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)", transform: "translate(30%,-30%)" }} />
  <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)", transform: "translate(-30%,30%)" }} />

  <div className="relative z-10 space-y-7 flex flex-col items-center">
    <div className="text-5xl"> <EcoBankMark size={100} /></div>
    
    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight text-center" style={{ letterSpacing: "-0.04em" }}>
      Siap Jadi Bagian dari<br />Gerakan Lingkungan?
    </h2>
    
    {/* justify-center dihapus, ditambahkan text-center */}
    <p className="text-base md:text-lg max-w-lg mx-auto leading-relaxed text-center" style={{ color: "rgba(187,247,208,0.75)", letterSpacing: "-0.04em" }}>
      Daftar sekarang dan mulai ubah sampahmu menjadi sesuatu yang berharga. Bersama EcoBank, kita jaga lingkungan untuk generasi mendatang.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <Link
        href="/register"
        className="font-bold text-sm px-9 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.03]"
        style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "white", boxShadow: "0 8px 24px rgba(245,158,11,0.5)" }}
      >
        Daftar Gratis Sekarang
      </Link>
      
      {/* Teks tombol yang duplikat di sini sudah diperbaiki & dibersihkan */}
      <Link
        href="/login"
        className="font-semibold text-sm px-9 py-4 rounded-2xl transition-all duration-200 text-center whitespace-nowrap"
        style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "white" }}
      >
        Sudah punya akun? Masuk
      </Link>
    </div>
  </div>
</div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer id="kontak" style={{ background: "#060f08", color: "#e5e7eb" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 pb-8">
          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Brand col */}
            <div className="md:col-span-2 space-y-5">
              <Link href="/" className="flex items-center gap-3 select-none">
                <EcoBankMark size={40} />
                <div>
                  <span className="block font-extrabold text-lg text-white" style={{ letterSpacing: "-0.03em" }}>EcoBank</span>
                  <span className="block text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#4ade80" }}>Bank Sampah Digital</span>
                </div>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#9ca3af" }}>
                Platform bank sampah digital yang mengubah limbah menjadi nilai ekonomi sambil menjaga kelestarian lingkungan.
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                {[
                  { label: "FB", icon: "f" },
                  { label: "IG", icon: "in" },
                  { label: "TW", icon: "t" },
                  { label: "YT", icon: "▶" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-colors duration-200"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link cols */}
            {[
              {
                title: "Platform",
                links: [
                  { label: "Beranda", href: "#beranda" },
                  { label: "Tentang Kami", href: "#tentang" },
                  { label: "Layanan", href: "#layanan" },
                  { label: "Cara Kerja", href: "#cara-kerja" },
                ],
              },
              {
                title: "Akun",
                links: [
                  { label: "Daftar Nasabah", href: "/register" },
                  { label: "Masuk Nasabah", href: "/login" },
                  { label: "Portal Admin", href: "/admin" },
                  { label: "Dashboard", href: "/dashboard" },
                ],
              },
              {
                title: "Bantuan",
                links: [
                  { label: "FAQ", href: "#" },
                  { label: "Hubungi Kami", href: "#kontak" },
                  { label: "Kebijakan Privasi", href: "#" },
                  { label: "Syarat & Ketentuan", href: "#" },
                ],
              },
            ].map((col) => (
              <div key={col.title} className="space-y-5">
                <h4 className="font-bold text-sm text-white" style={{ letterSpacing: "-0.01em" }}>{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-200 hover:text-green-400"
                        style={{ color: "#9ca3af" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs" style={{ color: "#6b7280" }}>
              © 2026 EcoBank — Bank Sampah Digital. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/login" className="text-xs font-semibold transition-colors" style={{ color: "#4ade80" }}>
                Login Nasabah
              </Link>
              <span style={{ color: "#374151" }}>|</span>
              <Link href="/admin" className="text-xs font-semibold transition-colors flex items-center gap-1.5" style={{ color: "#9ca3af" }}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Portal Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
