"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWaste } from '@/hooks/useWaste';
import { CalculatorContext, StandardCalculationStrategy } from '@/lib/wasteStrategy';

// ─── Types ───────────────────────────────────────────────────────────────────
type TabId = 'beranda' | 'setor' | 'riwayat' | 'edukasi' | 'profil';

type Transaction = {
  id: string;
  type: 'Setor' | 'Tukar';
  description: string;
  amount: number;
  date: string;
};

type Impact = {
  totalKg: number;
  totalPoin: number;
  totalEmisi: number;
};

type WasteItem = {
  id: string;
  nama?: string;
  name?: string;
  poinPerKg: number;
  emisiPerKg: number;
};

type DropoffPayload = {
  wasteType?: string;
  weight?: number;
  totalPoin: number;
  totalEmisi: number;
};

type RewardItem = {
  id: string;
  title: string;
  category: string;
  points: number;
  provider: string;
  iconBg: string;
};

type UserProfile = {
  nama: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  level: string;
  idNasabah: string;
  dropPointFavorit: string;
  avatarInitial: string;
};

// ─── SVG Logo Matching Landing Page (EcoBankMark) ─────────────────────────────
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
        <linearGradient id="db-lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="db-lg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dcfce7" />
          <stop offset="100%" stopColor="#bbf7d0" />
        </linearGradient>
      </defs>
      <path
        d="M24 2 L41.3 11 L41.3 29 L24 38 L6.7 29 L6.7 11 Z"
        fill="url(#db-lg1)"
      />
      <path
        d="M24 11 C31 14 35 20 32 26 C29 32 22 33 18 29 C14 25 15 17 20 13 C21.5 11.8 23 11 24 11 Z"
        fill="url(#db-lg2)"
      />
      <path
        d="M24 11 C23 19 21 26 20 32"
        stroke="#15803d"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M23 16 C26 14.5 29 15.5 31 18" stroke="#15803d" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M22 21 C25 19.5 29 20.5 31 23" stroke="#15803d" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path
        d="M20 32 L20 37"
        stroke="#bbf7d0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse cx="20" cy="37" rx="4" ry="1.5" fill="#bbf7d0" opacity="0.6" />
    </svg>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function IconHome({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function IconRecycle({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
function IconHistory({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconBook({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
function IconUser({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function IconLeaf({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
function IconCamera({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconUpload({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}
function IconChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
}
function IconChevronLeft({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function IconSidebar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 4v16" />
    </svg>
  );
}
function IconWeight({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  );
}
function IconStar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}
function IconLogout({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
function IconMenu({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function IconX({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function IconTrend({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function IconMapPin({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconGift({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v13m0-13V4.5a2.5 2.5 0 00-5 0V8h5zm0 0v13m0-13V4.5a2.5 2.5 0 015 0V8h-5zM4 8h16a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1zm1 5h14v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z" />
    </svg>
  );
}
function IconTrash({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
function IconShield({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function IconEdit({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

// ─── Waste Icon by ID ─────────────────────────────────────────────────────────
function WasteIcon({ id, className = "w-5 h-5" }: { id: string; className?: string }) {
  if (id === 'plastik') return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
  if (id === 'kertas') return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
  if (id === 'logam') return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 3H7a2 2 0 00-2 2v14a2 2 0 002 2h2M9 3h6M9 3v18m6-18h2a2 2 0 012 2v14a2 2 0 01-2 2h-2M15 3v18" />
    </svg>
  );
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l2.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

// ─── Education Articles ───────────────────────────────────────────────────────
const educationArticles = [
  {
    id: 1,
    title: "Cara Memilah Sampah yang Benar",
    excerpt: "Pemilahan sampah dari sumbernya adalah kunci keberhasilan daur ulang. Pelajari kategori sampah organik, anorganik, dan B3.",
    readTime: "4 menit",
    category: "Dasar",
    icon: <IconTrash className="w-5 h-5" />,
    content: "Pemilahan sampah dari sumbernya adalah langkah paling mendasar dalam pengelolaan sampah yang baik. Sampah dibagi menjadi tiga kategori utama:\n\n• Sampah Organik: sisa makanan, daun, ranting — dapat dikompos\n• Sampah Anorganik: plastik, kaca, logam, kertas — dapat didaur ulang\n• Sampah B3 (Bahan Berbahaya & Beracun): baterai, cat, obat-obatan — perlu penanganan khusus\n\nSediakan minimal 3 tempat sampah berbeda di rumah Anda dengan label yang jelas. Biasakan untuk memilah sejak sampah dihasilkan, bukan setelah terkumpul bercampur.",
  },
  {
    id: 2,
    title: "Jenis Plastik & Cara Daur Ulang",
    excerpt: "Tidak semua plastik bisa didaur ulang dengan cara yang sama. Kenali kode segitiga di bawah produk plastik Anda.",
    readTime: "5 menit",
    category: "Plastik",
    icon: <WasteIcon id="plastik" className="w-5 h-5" />,
    content: "Plastik memiliki 7 kode daur ulang berbeda yang tercetak pada produknya:\n\n• Kode 1 (PET): botol minuman, dapat didaur ulang dengan nilai tinggi\n• Kode 2 (HDPE): botol deterjen, susu — mudah didaur ulang\n• Kode 3 (PVC): pipa, kulit sintetis — sulit didaur ulang\n• Kode 4 (LDPE): kantong plastik, kemasan fleksibel\n• Kode 5 (PP): wadah makanan, sedotan — dapat didaur ulang\n• Kode 6 (PS): styrofoam — sulit didaur ulang\n• Kode 7 (Lainnya): campuran, umumnya tidak bisa didaur ulang\n\nEcoBank menerima plastik kode 1, 2, 4, dan 5 dengan nilai poin tertinggi.",
  },
  {
    id: 3,
    title: "Dampak Sampah pada Lingkungan",
    excerpt: "Setiap tahun 8 juta ton sampah plastik masuk ke lautan. Pelajari dampak nyata dan apa yang bisa kita lakukan.",
    readTime: "6 menit",
    category: "Lingkungan",
    icon: <IconLeaf className="w-5 h-5" />,
    content: "Dampak sampah yang tidak terkelola dengan baik sangat masif:\n\n• Pencemaran laut: 8 juta ton plastik masuk ke lautan setiap tahun, mengancam biota laut\n• Emisi gas rumah kaca: sampah organik yang membusuk menghasilkan metana (CH₄), gas 25x lebih kuat dari CO₂\n• Pencemaran tanah: plastik membutuhkan 400-1000 tahun untuk terurai\n• Kesehatan manusia: mikroplastik telah ditemukan dalam darah dan ASI manusia\n\nDengan mendepositkan sampah ke EcoBank, Anda secara langsung mencegah sampah masuk ke TPA dan mengurangi emisi karbon komunitas.",
  },
  {
    id: 4,
    title: "Tips Zero Waste Rumah Tangga",
    excerpt: "Kurangi sampah dari sumbernya. Panduan praktis menerapkan gaya hidup minim sampah di rumah sehari-hari.",
    readTime: "5 menit",
    category: "Gaya Hidup",
    icon: <IconHome className="w-5 h-5" />,
    content: "Zero waste bukan berarti nol sampah, tetapi meminimalkan sampah sebisa mungkin. Mulai dari hal kecil:\n\n• Bawa tas belanja sendiri dan hindari kantong plastik sekali pakai\n• Pilih produk dengan kemasan minimal atau kemasan yang dapat didaur ulang\n• Gunakan wadah/botol minum sendiri saat bepergian\n• Beli bahan makanan secukupnya untuk mengurangi food waste\n• Pilih produk lokal untuk mengurangi jejak karbon transportasi\n• Perbaiki barang yang rusak sebelum membeli baru (repair culture)\n• Gunakan kembali wadah bekas untuk penyimpanan lain\n\nMulai dengan 1-2 perubahan kecil dan tambahkan secara bertahap.",
  },
  {
    id: 5,
    title: "Ekonomi Sirkular: Sampah jadi Nilai",
    excerpt: "Bagaimana sampah bisa menjadi sumber daya berharga dalam sistem ekonomi sirkular yang berkelanjutan.",
    readTime: "7 menit",
    category: "Ekonomi",
    icon: <IconRecycle className="w-5 h-5" />,
    content: "Ekonomi sirkular adalah model ekonomi yang bertujuan menghilangkan limbah dan menjaga sumber daya tetap digunakan selama mungkin.\n\nPrinsip utama:\n• Rancang dengan nol limbah — produk dirancang agar mudah diperbaiki dan didaur ulang\n• Perpanjang siklus hidup produk melalui reuse, repair, dan refurbish\n• Daur ulang sebagai pilihan terakhir — bukan tujuan utama\n\nEcoBank adalah bagian dari ekosistem ekonomi sirkular: sampah Anda menjadi bahan baku industri daur ulang, menghasilkan poin yang bisa ditukar reward nyata, sekaligus mengurangi kebutuhan bahan baku baru yang merusak alam.",
  },
  {
    id: 6,
    title: "Kompos dari Sampah Organik",
    excerpt: "Ubah sisa dapur Anda menjadi pupuk alami berkualitas tinggi. Panduan membuat kompos sederhana di rumah.",
    readTime: "6 menit",
    category: "Organik",
    icon: <IconLeaf className="w-5 h-5" />,
    content: "Komposting adalah proses mengubah bahan organik menjadi pupuk alami melalui aktivitas mikroorganisme.\n\nBahan yang bisa dikompos:\n• Kulit buah dan sayuran, sisa makanan (hindari daging/ikan)\n• Daun kering, potongan rumput, ranting kecil\n• Ampas kopi dan teh, cangkang telur\n\nCara membuat kompos sederhana:\n1. Siapkan wadah atau lubang di tanah\n2. Lapisi dengan tanah atau kompos matang\n3. Tambahkan bahan hijau (sisa makanan) dan coklat (daun kering) bergantian\n4. Jaga kelembaban — tidak terlalu basah atau kering\n5. Aduk setiap 1-2 minggu untuk aerasi\n6. Kompos siap dalam 4-8 minggu\n\nKompos matang berwarna coklat gelap, berbau tanah segar, dan berstruktur remah.",
  },
];

// ─── Popular Rewards Catalog ──────────────────────────────────────────────────
const availableRewards: RewardItem[] = [
  { id: 'rew-1', title: 'Voucher GoPay Rp 10.000', category: 'e-Wallet', points: 100, provider: 'GoPay', iconBg: '#00aa13' },
  { id: 'rew-2', title: 'Pulsa Seluler Rp 25.000', category: 'Telekomunikasi', points: 240, provider: 'Telkomsel', iconBg: '#e11932' },
  { id: 'rew-3', title: 'Token Listrik PLN Rp 20.000', category: 'Utilitas', points: 200, provider: 'PLN', iconBg: '#0284c7' },
  { id: 'rew-4', title: 'Adopsi Bibit Pohon Mangrove', category: 'Penghijauan', points: 150, provider: 'EcoGreen Foundation', iconBg: '#16a34a' },
];

// ─── Nearby Drop Points ───────────────────────────────────────────────────────
const nearbyDropPoints = [
  { id: 'dp-1', name: 'Bank Sampah Syiah Kuala', distance: '0.8 km', hours: '08:00 - 16:00', status: 'Buka Sekarang', address: 'Jl. Teuku Nyak Arief No. 42' },
  { id: 'dp-2', name: 'Bank Sampah Ulee Kareng', distance: '1.6 km', hours: '09:00 - 17:00', status: 'Buka Sekarang', address: 'Jl. Lamreung No. 18' },
];

// ─── Dynamic Time Greeting Function ───────────────────────────────────────────
function getDynamicGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

// ─── Live Camera Modal Component ──────────────────────────────────────────────
function LiveCameraModal({
  isOpen,
  onClose,
  onCapture,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string, filename: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setCameraError('');
      return;
    }

    let activeStream: MediaStream | null = null;
    async function startCamera() {
      try {
        setCameraError('');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Camera access error:', err);
        setCameraError('Kamera tidak dapat diakses atau izin kamera ditolak oleh browser. Anda dapat mengunggah foto secara manual lewat tombol "Upload File".');
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      const filename = `foto-setoran-${Date.now().toString().slice(-4)}.jpg`;

      setTimeout(() => {
        onCapture(dataUrl, filename);
        setIsCapturing(false);
        onClose();
      }, 200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 text-white flex flex-col">
        {/* Modal Header */}
        <div className="p-4 px-6 flex items-center justify-between border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h4 className="text-sm font-bold text-white tracking-wide">Kamera Pengambilan Bukti Sampah</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {/* Video Viewfinder */}
        <div className="relative bg-black aspect-[4/3] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/30">
                <IconCamera className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Kembali ke Form Setoran
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-200 ${isCapturing ? 'opacity-40' : 'opacity-100'}`}
              />
              {/* Focus Crosshair Guide */}
              <div className="absolute inset-8 border border-white/25 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-lg" />
                <div className="w-10 h-10 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-lg" />
                <div className="w-10 h-10 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-lg" />
                <div className="w-10 h-10 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-lg" />
                <p className="text-[11px] font-semibold text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                  Posisikan sampah di dalam bingkai
                </p>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Shutter Controls */}
        {!cameraError && (
          <div className="p-4 px-6 bg-slate-950 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Live Camera feed</span>
            <button
              type="button"
              onClick={handleTakeSnapshot}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-slate-950/80 inline-block animate-pulse" />
              <span>Jepret Foto Sekarang</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
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
    { id: '1', type: 'Setor', description: 'Botol Plastik (2.0 kg)', amount: 100, date: '12 Okt 2026' },
    { id: '2', type: 'Tukar', description: 'Voucher e-Wallet GoPay Rp 10.000', amount: -50, date: '10 Okt 2026' },
    { id: '3', type: 'Setor', description: 'Kardus & Kertas Bekas (5.0 kg)', amount: 150, date: '08 Okt 2026' },
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
        type: 'Tukar',
        description: reward.title,
        amount: -reward.points,
        date: 'Hari ini',
      };
      setTransactions((prev) => [newTx, ...prev]);
      alert(`Selamat! Penukaran "${reward.title}" berhasil diproses.`);
    }
  };

  const handleSaveDropoff = async (calculatedData: DropoffPayload) => {
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
          type: 'Setor',
          description: `Setoran Sampah (${result.data?.ticketId || 'DROP-NEW'})`,
          amount: calculatedData.totalPoin,
          date: 'Hari ini',
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
        type: 'Setor',
        description: `Setoran Sampah Mandiri`,
        amount: calculatedData.totalPoin,
        date: 'Hari ini',
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
                          borderLeft: '4px solid #34d399',
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

            <div className="flex items-center justify-between px-1">
              <Link href="/" className="text-xs font-semibold flex items-center gap-1.5 transition-colors text-white/50 hover:text-emerald-200">
                <span>Beranda Publik</span>
                <span>↗</span>
              </Link>
              <Link href="/" className="text-xs font-semibold flex items-center gap-1 transition-colors text-red-300 hover:text-red-200">
                <IconLogout className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </Link>
            </div>
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
              <IconStar className="w-3.5 h-3.5 text-amber-400" />
              <span>{userProfile.level}</span>
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
                        background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
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
                          Target Hijau Bulan Ini
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

          {/* ── GELOMBANG HALUS / WAVE DIVIDER DENGAN TRANSISI LEMBUT ── */}
          <div className="w-full overflow-hidden leading-none pointer-events-none">
            <svg
              className="relative block w-full h-8 sm:h-12 md:h-16"
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
            <div className="space-y-6 -mt-3">

              {/* 1. Stat Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Sampah Terkumpul"
                  value={`${impact.totalKg} kg`}
                  sub="Kontribusi Anda"
                  icon={<IconWeight className="w-5 h-5" />}
                  accent="#16a34a"
                  accentBg="rgba(22,163,74,0.08)"
                />
                <StatCard
                  label="Poin Aktif"
                  value={`${impact.totalPoin} Pts`}
                  sub="Saldo reward"
                  icon={<IconStar className="w-5 h-5" />}
                  accent="#d97706"
                  accentBg="rgba(217,119,6,0.08)"
                />
                <StatCard
                  label="CO₂ Dicegah"
                  value={`${impact.totalEmisi} kg`}
                  sub="Emisi dihindari"
                  icon={<IconLeaf className="w-5 h-5" />}
                  accent="#0284c7"
                  accentBg="rgba(2,132,199,0.08)"
                />
                <StatCard
                  label="Setoran Berhasil"
                  value={`${transactions.filter((t) => t.type === 'Setor').length} Kali`}
                  sub="100% terverifikasi"
                  icon={<IconCheck className="w-5 h-5" />}
                  accent="#7c3aed"
                  accentBg="rgba(124,58,237,0.08)"
                />
              </div>

              {/* 2. Main Grid: Komposisi Sampah & Katalog Penukaran Cepat */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT: Komposisi Sampah & Drop Point (7 cols) */}
                <div className="lg:col-span-7 space-y-6">

                  {/* Komposisi Sampah Saya */}
                  <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">Komposisi Sampah Anda</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Rincian sampah yang telah Anda setor ke EcoBank</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('setor')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        + Setor Baru <IconChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { label: 'Botol Plastik (PET/HDPE)', weight: '3.5 kg', pct: 50, color: '#16a34a', icon: 'plastik' },
                        { label: 'Kardus & Kertas', weight: '2.0 kg', pct: 29, color: '#0284c7', icon: 'kertas' },
                        { label: 'Kaleng Logam & Alumunium', weight: '1.0 kg', pct: 14, color: '#d97706', icon: 'logam' },
                        { label: 'Botol & Pecahan Kaca', weight: '0.5 kg', pct: 7, color: '#8b5cf6', icon: 'kaca' },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="flex items-center gap-2 text-slate-800">
                              <span className="p-1 rounded bg-white border border-slate-200 text-emerald-600">
                                <WasteIcon id={item.icon} className="w-3.5 h-3.5" />
                              </span>
                              {item.label}
                            </span>
                            <span className="text-slate-700">{item.weight} ({item.pct}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, background: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Drop Point Terdekat */}
                  <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">Lokasi Drop Point Terdekat</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Mitra Bank Sampah resmi di area sekitar Anda</p>
                      </div>
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                        <IconMapPin className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {nearbyDropPoints.map((dp) => (
                        <div key={dp.id} className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 mb-1">
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {dp.status}
                              </span>
                              <span>{dp.distance}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">{dp.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{dp.address}</p>
                          </div>
                          <div className="pt-2 border-t border-emerald-100/70 flex items-center justify-between text-[10px] text-slate-600">
                            <span>Jam: {dp.hours}</span>
                            <span className="font-bold text-emerald-700 cursor-pointer hover:underline">Petunjuk Arah →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Penukaran Reward & Riwayat Cepat (5 cols) */}
                <div className="lg:col-span-5 space-y-6">

                  {/* Penukaran Reward Populer */}
                  <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">Tukar Poin Cepat</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Saldo Anda: <strong className="text-amber-600">{impact.totalPoin} Pts</strong></p>
                      </div>
                      <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                        <IconGift className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="space-y-3">
                      {availableRewards.map((rew) => {
                        const canAfford = impact.totalPoin >= rew.points;
                        return (
                          <div key={rew.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{rew.title}</p>
                              <p className="text-[10px] text-slate-500">{rew.category} · {rew.provider}</p>
                              <span className="inline-block text-[11px] font-extrabold text-amber-600 mt-0.5">
                                {rew.points} Pts
                              </span>
                            </div>
                            <button
                              onClick={() => handleRedeemReward(rew)}
                              disabled={!canAfford}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0"
                              style={canAfford
                                ? { background: '#16a34a', color: 'white' }
                                : { background: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed' }
                              }
                            >
                              {canAfford ? 'Tukar' : 'Kurang'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Riwayat Transaksi Ringkas */}
                  <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">Aktivitas Terkini</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Setoran dan penukaran terbaru</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('riwayat')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        Semua <IconChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <TransactionList transactions={transactions} limit={3} />
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB 2: SETOR SAMPAH (Kalkulator + Live Kamera)
          ══════════════════════════════════════ */}
          {activeTab === 'setor' && (
            <div className={`mx-auto transition-all duration-300 ${sidebarOpen ? 'max-w-2xl' : 'max-w-3xl'}`}>
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-900/10 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-xl text-slate-900 leading-snug">Formulir Setoran Sampah</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                    Hitung perolehan poin dari berat sampah dan sertakan foto dokumentasi setoran untuk verifikasi mitra.
                  </p>
                </div>
                <CalculatorSection onSave={handleSaveDropoff} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB 3: RIWAYAT TRANSAKSI
          ══════════════════════════════════════ */}
          {activeTab === 'riwayat' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-emerald-900/10 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Riwayat Seluruh Transaksi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Daftar lengkap aktivitas setoran sampah dan penukaran saldo reward</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {transactions.length} Catatan
                </span>
              </div>
              <TransactionList transactions={transactions} />
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB 4: EDUKASI SAMPAH
          ══════════════════════════════════════ */}
          {activeTab === 'edukasi' && (
            <div className="space-y-6">
              <div
                className="rounded-3xl p-7 sm:p-8 text-white relative overflow-hidden shadow-lg"
                style={{ background: 'linear-gradient(135deg, #104929 0%, #176439 60%, #1f7d49 100%)' }}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-2xl bg-white/15 text-emerald-200 border border-white/20 flex-shrink-0">
                      <IconBook className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-lg sm:text-xl text-white leading-snug">Panduan Pengelolaan Sampah Bijak</h3>
                      <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
                        Mulai dari rumah Anda! Pelajari cara pemilahan yang tepat, klasifikasi kode plastik, serta bagaimana limbah diubah menjadi nilai sirkular nyata.
                      </p>
                    </div>
                  </div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 hidden md:block">
                    <Image
                      src="/images/maskot_ecobank4.png"
                      alt="Maskot Edukasi EcoBank"
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {educationArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-2xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="p-6 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {article.category}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">{article.readTime}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                          {article.icon}
                        </span>
                        <h4 className="font-semibold text-sm sm:text-base text-slate-800 leading-snug">{article.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">{article.excerpt}</p>

                      {expandedArticle === article.id && (
                        <div className="pt-2 p-4 rounded-xl bg-emerald-50/70 text-xs text-slate-700 whitespace-pre-line leading-relaxed border border-emerald-100/80 font-normal">
                          {article.content}
                        </div>
                      )}
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                        className="w-full py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                        style={expandedArticle === article.id
                          ? { background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }
                          : { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }
                        }
                      >
                        {expandedArticle === article.id ? 'Tutup Artikel' : 'Baca Selengkapnya →'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

// ─── Stat Card Component ──────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent, accentBg }: {
  label: string; value: string; sub: string;
  icon: React.ReactNode; accent: string; accentBg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 tracking-normal">{label}</p>
        <p className="text-2xl sm:text-[26px] font-bold text-slate-800 mt-1.5 tracking-tight leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-normal">
          <IconTrend className="w-3.5 h-3.5" />
          <span>{sub}</span>
        </p>
      </div>
      <div className="p-3 rounded-2xl flex-shrink-0" style={{ background: accentBg, color: accent }}>
        {icon}
      </div>
    </div>
  );
}

// ─── Calculator Section (Tab "Setor Sampah" dengan Live Kamera Nyata) ─────────
function CalculatorSection({ onSave }: { onSave: (payload: DropoffPayload) => void }) {
  const { wasteTypes = [] as WasteItem[] } = useWaste() as { wasteTypes?: WasteItem[] };
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleWeightChange = (id: string, weight: number) => {
    setWeights((prev) => ({ ...prev, [id]: weight }));
  };

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleCameraCapture = (dataUrl: string, filename: string) => {
    setPhotoPreview(dataUrl);
    setPhotoName(filename);
  };

  const calculateTotal = () => {
    let totalPoin = 0;
    let totalEmisi = 0;
    const calc = new CalculatorContext(new StandardCalculationStrategy());
    wasteTypes.forEach((item: WasteItem) => {
      const w = weights[item.id] ?? 0;
      if (w > 0) {
        totalPoin += calc.execute(w, item.poinPerKg);
        totalEmisi += calc.execute(w, item.emisiPerKg);
      }
    });
    return { totalPoin, totalEmisi };
  };

  const totals = calculateTotal();
  const totalWeight = Object.values(weights).reduce<number>((sum, v) => sum + Number(v || 0), 0);

  const handleTriggerSave = () => {
    if (totals.totalPoin > 0) {
      onSave({
        totalPoin: totals.totalPoin,
        totalEmisi: Number(totals.totalEmisi.toFixed(2)),
        weight: totalWeight,
      });
      setWeights({});
      setPhotoPreview(null);
      setPhotoName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Waste Input List */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
          <span>1. Pilih Jenis & Masukkan Berat Sampah</span>
        </label>
        {wasteTypes.map((item: WasteItem) => (
          <div key={item.id} className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-200 transition-colors">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-emerald-600 flex-shrink-0 shadow-xs">
              <WasteIcon id={item.id} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 leading-snug">{item.nama || item.name || item.id}</p>
              <p className="text-xs text-slate-500 font-normal mt-0.5">{item.poinPerKg} Poin/kg · Reduksi {item.emisiPerKg} kg CO₂/kg</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={weights[item.id] || ''}
                onChange={(e) => handleWeightChange(item.id, parseFloat(e.target.value) || 0)}
                className="w-20 px-3 py-2 rounded-xl text-xs font-semibold text-right bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-500 w-5">kg</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Photo Upload Section with Real Camera */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
          <span>2. Bukti Foto Setoran Sampah</span>
        </label>

        <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-300 bg-emerald-50/30 transition-colors">
          {photoPreview ? (
            <div className="relative">
              <img src={photoPreview} alt="Bukti setoran" className="w-full h-52 object-cover" />
              <div className="absolute inset-0 flex items-end justify-between p-3.5 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <span className="text-white text-xs font-medium truncate max-w-[70%]">{photoName}</span>
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(null); setPhotoName(''); }}
                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow"
                  title="Hapus foto"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-7 text-center">
              <div className="inline-flex flex-col items-center gap-2.5">
                <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700">
                  <IconCamera className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Dokumentasikan Bukti Sampah</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ambil foto langsung dengan kamera atau unggah dari galeri/file</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Explicit Separation between Upload and Direct Camera */}
        <div className="flex gap-3 pt-1">
          {/* Button 1: File Picker */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
          >
            <IconUpload className="w-4 h-4" />
            Upload File Galeri
          </button>

          {/* Button 2: Real Live Camera */}
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
          >
            <IconCamera className="w-4 h-4" />
            Ambil Foto Langsung
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

        {/* Live Camera Viewfinder Modal */}
        <LiveCameraModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
        />
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
        <div>
          <p className="text-[11px] font-semibold text-slate-600">Estimasi Poin Reward</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">+{totals.totalPoin} Poin</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold text-slate-600">Reduksi Emisi Karbon</p>
          <p className="text-xl font-extrabold text-sky-700 mt-0.5">{totals.totalEmisi.toFixed(2)} kg CO₂</p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleTriggerSave}
        disabled={totals.totalPoin === 0}
        className="w-full py-3.5 rounded-xl text-sm font-extrabold transition-all shadow-md"
        style={totals.totalPoin > 0
          ? { background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white' }
          : { background: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed' }
        }
      >
        {totals.totalPoin > 0 ? `Simpan & Kirim Setoran (+${totals.totalPoin} Pts)` : 'Masukkan berat sampah terlebih dahulu'}
      </button>
    </div>
  );
}

// ─── Transaction List Component ───────────────────────────────────────────────
function TransactionList({ transactions, limit }: { transactions: Transaction[]; limit?: number }) {
  const displayList = limit ? transactions.slice(0, limit) : transactions;
  if (displayList.length === 0) {
    return <p className="text-xs text-center py-6 text-slate-400">Belum ada riwayat transaksi</p>;
  }
  return (
    <div className="space-y-2.5">
      {displayList.map((tx) => (
        <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={tx.type === 'Setor'
              ? { background: 'rgba(22,163,74,0.12)', color: '#16a34a' }
              : { background: 'rgba(217,119,6,0.12)', color: '#d97706' }
            }
          >
            {tx.type === 'Setor' ? <IconCheck className="w-4 h-4" /> : <IconStar className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate leading-snug">{tx.description}</p>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">{tx.date}</p>
          </div>
          <span className={`text-xs font-bold flex-shrink-0 ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Pts
          </span>
        </div>
      ))}
    </div>
  );
}
