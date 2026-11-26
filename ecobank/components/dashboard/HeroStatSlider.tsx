"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Impact, TabId } from './types';
import {
  IconWeight,
  IconStar,
  IconLeaf,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
} from './DashboardIcons';

export function HeroStatSlider({
  impact,
  setorCount,
  onNavigateTab,
}: {
  impact: Impact;
  setorCount: number;
  onNavigateTab: (tab: TabId) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const SLIDE_DURATION = 4800;

  const slides = [
    {
      id: 'sampah',
      label: 'Sampah Terkumpul',
      value: `${impact.totalKg}`,
      unit: 'kg',
      sub: 'Total pilahan tercatat',
      headline: 'Pilah Sampah, Pulihkan Lingkungan',
      description: 'Setiap kilogram sampah kering yang Anda kumpulkan langsung didistribusikan ke fasilitas daur ulang sirkular mitra bank sampah.',
      badge: 'Target Tercapai 70%',
      icon: <IconWeight className="w-4 h-4" />,
      accent: '#34d399',
      image: '/images/maskot_ecobank3.png',
      imageAlt: 'Maskot EcoBank Pilah Sampah',
      gradient: 'linear-gradient(135deg, #07381f 0%, #0d4a2b 50%, #16653b 100%)',
      ctaText: 'Setor Sampah Sekarang',
      ctaAction: () => onNavigateTab('setor'),
    },
    {
      id: 'poin',
      label: 'Poin Aktif',
      value: `${impact.totalPoin}`,
      unit: 'Pts',
      sub: 'Siap ditukar reward',
      headline: 'Reward Nyata dari Setiap Pilahan',
      description: 'Kumpulkan poin reward dari setiap transaksi dan tukarkan dengan voucher belanja, saldo digital e-wallet, pulsa, atau sembako.',
      badge: 'Saldo Siap Ditukar',
      icon: <IconStar className="w-4 h-4" />,
      accent: '#fbbf24',
      image: '/images/maskot_ecobank5.png',
      imageAlt: 'Maskot EcoBank Poin Reward',
      gradient: 'linear-gradient(135deg, #0b3d26 0%, #145533 50%, #1e6c40 100%)',
      ctaText: 'Tukar Reward Poin',
      ctaAction: () => {
        const el = document.getElementById('section-tukar-poin');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'emisi',
      label: 'CO₂ Dicegah',
      value: `${impact.totalEmisi}`,
      unit: 'kg',
      sub: 'Estimasi reduksi karbon',
      headline: 'Pangkas Jejak Karbon dari Rumah',
      description: 'Aksi pemilahan sampah mandiri berhasil mencegah pelepasan gas rumah kaca dan menghemat energi manufaktur bahan baku baru.',
      badge: 'Dampak Iklim Nyata',
      icon: <IconLeaf className="w-4 h-4" />,
      accent: '#2dd4bf',
      image: '/images/maskot_ecobank4.png',
      imageAlt: 'Maskot EcoBank Lindungi Bumi',
      gradient: 'linear-gradient(135deg, #053327 0%, #0c4d38 50%, #146147 100%)',
      ctaText: 'Pelajari Edukasi Sampah',
      ctaAction: () => onNavigateTab('edukasi'),
    },
    {
      id: 'setoran',
      label: 'Setoran Berhasil',
      value: `${setorCount}`,
      unit: 'Kali',
      sub: 'Terverifikasi drop point',
      headline: 'Konsistensi Aksi Nyata Lestari',
      description: 'Seluruh riwayat setoran Anda telah diperiksa dan diverifikasi langsung oleh petugas drop point mitra bank sampah resmi.',
      badge: 'Nasabah Terverifikasi',
      icon: <IconCheck className="w-4 h-4" />,
      accent: '#4ade80',
      image: '/images/maskot_ecobank2.png',
      imageAlt: 'Maskot EcoBank Setoran Berhasil',
      gradient: 'linear-gradient(135deg, #04381e 0%, #094a28 50%, #106337 100%)',
      ctaText: 'Lihat Riwayat Transaksi',
      ctaAction: () => onNavigateTab('riwayat'),
    },
  ];

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((curr) => (curr + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleSelectSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <div
      className="relative z-20 overflow-hidden rounded-3xl text-white shadow-xl border border-emerald-500/20 transition-all duration-500"
      style={{ background: active.gradient }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient Lighting & Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 30%, rgba(110, 231, 183, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 85% 70%, rgba(52, 211, 153, 0.2) 0%, transparent 55%)
          `,
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 space-y-5">

        {/* ── Top Bar: 4 Dots Indicators + Controls ── */}
        <div className="flex items-center justify-between gap-4">
          {/* 4 Interactive Dots Indicator */}
          <div className="flex items-center gap-1.5" aria-label="Indikator slide">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-7 bg-emerald-300 shadow-xs shadow-emerald-300/50'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Pindah ke slide ${idx + 1}`}
                title={`Slide ${idx + 1}: ${slides[idx].label}`}
              />
            ))}
          </div>

          {/* Right: Slide Number + Arrows */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-emerald-200/80 mr-1 tabular-nums">
              0{currentSlide + 1} / 0{slides.length}
            </span>
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center border border-white/15 transition-all"
              title="Slide Sebelumnya"
              aria-label="Slide Sebelumnya"
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center border border-white/15 transition-all"
              title="Slide Berikutnya"
              aria-label="Slide Berikutnya"
            >
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Main Slide Content: Hero Grid with Fixed Heights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[250px] sm:min-h-[260px]">
          
          {/* Left Column: Metric & Descriptions (Stabil, No Layout Shift) */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[230px] sm:min-h-[245px] space-y-3.5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-200 border border-white/20 backdrop-blur-md">
                <span style={{ color: active.accent }}>{active.icon}</span>
                <span>{active.badge}</span>
              </div>

              {/* Giant Metric Display with clean Middle Dot separator */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white tabular-nums">
                  {active.value}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-emerald-300">
                  {active.unit}
                </span>
                <span className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-emerald-100/90 ml-1">
                  <span className="text-emerald-300/70 font-bold text-base leading-none">·</span>
                  <span>{active.sub}</span>
                </span>
              </div>

              {/* Headline & Description with Uniform Heights */}
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-1 min-h-[28px] flex items-center">
                {active.headline}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed max-w-xl font-normal min-h-[42px] flex items-center">
                {active.description}
              </p>
            </div>

            {/* Call to Action Button */}
            <div className="pt-1">
              <button
                onClick={active.ctaAction}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-emerald-950/60 hover:bg-emerald-950/80 border border-emerald-400/30 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{active.ctaText}</span>
                <IconChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Enlarged Floating Mascot Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex-shrink-0 anim-mascot">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-35 pointer-events-none"
                style={{ background: active.accent }}
              />
              <Image
                src={active.image}
                alt={active.imageAlt}
                fill
                sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
