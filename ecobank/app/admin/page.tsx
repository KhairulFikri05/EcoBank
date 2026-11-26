"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWaste } from '@/hooks/useWaste';
import {
  getGoogleMapsDirectionsUrl,
  getGoogleMapsEmbedUrl,
  getGoogleMapsSearchUrl,
  mitraLocations,
  type MitraLocation,
} from '@/lib/mitraLocations';
import MitraOsmMap from '@/components/MitraOsmMap';

// ─── Types ───────────────────────────────────────────────────────────────────
type AdminTab = 'overview' | 'nasabah' | 'tracking' | 'analitik' | 'masterdata';
type TxFilter = 'all' | 'setor' | 'tukar' | 'pending';
type TimeRange = 'today' | '7d' | '30d' | 'year';
type TxStatus = 'completed' | 'pending' | 'rejected';
type Metric = 'kg' | 'co2' | 'nasabah';

interface TransactionItem {
  id: string;
  userId: string;
  userName: string;
  type: 'setor' | 'tukar';
  category: string;
  weightOrUnit: string;
  points: number;
  time: string;
  location: string;
  status: TxStatus;
}

interface NasabahItem {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  kecamatan: string;
  level: string;
  poin: number;
  totalKg: number;
  frekuensi: number;
  mitraFavorit: string;
  joinDate: string;
  status: 'Aktif' | 'Nonaktif';
}

interface MitraInfo extends MitraLocation {
  status: 'Aktif' | 'Libur';
}

interface WasteCategory {
  id: string;
  nama: string;
  poinPerKg: number;
  emisiPerKg: number;
}

// ─── Icons (satu komponen, path saja) ────────────────────────────────────────
const ICONS = {
  dashboard: 'M3 3h7v9H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 16h7v5H3z',
  pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  chart: 'M3 3v18h18 M19 9l-5 5-4-4-3 3',
  database: 'M3 5c0-1.66 4-3 9-3s9 1.34 9 3-4 3-9 3-9-1.34-9-3z M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5 M3 12c0 1.66 4 3 9 3s9-1.34 9-3',
  refresh: 'M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5 M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16 M16 16h5v5',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  sidebar: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M9 3v18',
  check: 'M20 6 9 17l-5-5',
  search: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.3-4.3',
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 10 0v4',
  eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeoff: 'M9.88 9.88a3 3 0 1 0 4.24 4.24 M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68 M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61 M2 2l20 20',
  x: 'M18 6 6 18 M6 6l12 12',
  plus: 'M12 5v14 M5 12h14',
  pencil: 'M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z',
  trash: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  external: 'M15 3h6v6 M10 14 21 3 M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  map: 'M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7',
  navigation: 'M3 11l19-9-9 19-2-8-8-2z',
} as const;

function Icon({ name, className = 'w-4 h-4' }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name].split(' M').map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  );
}

function EcoBankMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="flex-shrink-0" aria-hidden="true">
      <rect width="48" height="48" rx="10" fill="#047857" />
      <path d="M24 12 C31 14.5 34 21 31 27 C28 33 21 34 18 30 C15 26 16 19 20 15 C21.5 13.5 23 12.5 24 12 Z" fill="#ecfdf5" />
      <path d="M24 14 C23 22 21 28 19.5 35" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── LocalStorage Persistence Keys ──────────────────────────────────────────
const STORAGE_KEY_MITRA = 'ecobank_admin_mitra';
const STORAGE_KEY_TX = 'ecobank_admin_transactions';
const STORAGE_KEY_CATEGORIES = 'ecobank_admin_categories';
const STORAGE_KEY_AUTH = 'ecobank_admin_auth';
const STORAGE_KEY_NASABAH = 'ecobank_admin_nasabah';

// ─── Data awal ───────────────────────────────────────────────────────────────
const initialTransactions: TransactionItem[] = [
  { id: 'TX-9041', userId: 'NS-204', userName: 'Rahmat Hidayat', type: 'setor', category: 'Botol Plastik PET', weightOrUnit: '4.5 kg', points: 225, time: 'Baru saja', location: 'BS Syiah Kuala', status: 'completed' },
  { id: 'TX-9040', userId: 'NS-089', userName: 'Siti Sarah', type: 'tukar', category: 'Voucher GoFood Rp 50.000', weightOrUnit: '1 kupon', points: -500, time: '3 menit lalu', location: 'Aplikasi', status: 'completed' },
  { id: 'TX-9039', userId: 'NS-155', userName: 'Teuku M. Faisal', type: 'setor', category: 'Kaleng Logam & Aluminium', weightOrUnit: '3.2 kg', points: 256, time: '12 menit lalu', location: 'BS Ulee Kareng', status: 'completed' },
  { id: 'TX-9038', userId: 'NS-312', userName: 'Nurul Annisa', type: 'setor', category: 'Kardus & Kertas Dupleks', weightOrUnit: '8.0 kg', points: 240, time: '24 menit lalu', location: 'BS Baiturrahman', status: 'completed' },
  { id: 'TX-9037', userId: 'NS-411', userName: 'Dedi Kurniawan', type: 'setor', category: 'Minyak Jelantah Murni', weightOrUnit: '5.0 liter', points: 350, time: '45 menit lalu', location: 'BS Meuraxa', status: 'pending' },
  { id: 'TX-9036', userId: 'NS-502', userName: 'Cut Zahra', type: 'setor', category: 'Botol Kaca Bening', weightOrUnit: '6.5 kg', points: 130, time: '1 jam lalu', location: 'BS Banda Raya', status: 'pending' },
];

const initialMitra: MitraInfo[] = mitraLocations.map((location) => ({
  ...location,
  status: 'Aktif',
}));

const initialNasabah: NasabahItem[] = [
  {
    id: 'EB-2026-089',
    nama: 'Siti Sarah',
    email: 'sitisarah@gmail.com',
    telepon: '0812-3456-7890',
    kecamatan: 'Kec. Syiah Kuala',
    level: 'Level 2 · Green Pioneer',
    poin: 1850,
    totalKg: 46.8,
    frekuensi: 14,
    mitraFavorit: 'Bank Sampah Syiah Kuala',
    joinDate: '15 Jan 2026',
    status: 'Aktif',
  },
  {
    id: 'EB-2026-204',
    nama: 'Rahmat Hidayat',
    email: 'user@ecobank.id',
    telepon: '0821-6987-1122',
    kecamatan: 'Kec. Ulee Kareng',
    level: 'Level 3 · Planet Guardian',
    poin: 3420,
    totalKg: 89.5,
    frekuensi: 26,
    mitraFavorit: 'Bank Sampah Ulee Kareng',
    joinDate: '02 Feb 2026',
    status: 'Aktif',
  },
  {
    id: 'EB-2026-155',
    nama: 'Teuku M. Faisal',
    email: 'faisal.teuku@yahoo.com',
    telepon: '0852-7788-9900',
    kecamatan: 'Kec. Meuraxa',
    level: 'Level 2 · Green Pioneer',
    poin: 1240,
    totalKg: 32.4,
    frekuensi: 9,
    mitraFavorit: 'Bank Sampah Meuraxa',
    joinDate: '10 Mar 2026',
    status: 'Aktif',
  },
  {
    id: 'EB-2026-312',
    nama: 'Nurul Annisa',
    email: 'nurul.annisa@gmail.com',
    telepon: '0813-4455-6677',
    kecamatan: 'Kec. Baiturrahman',
    level: 'Level 1 · Eco Starter',
    poin: 680,
    totalKg: 18.2,
    frekuensi: 5,
    mitraFavorit: 'Bank Sampah Baiturrahman',
    joinDate: '22 Apr 2026',
    status: 'Aktif',
  },
  {
    id: 'EB-2026-411',
    nama: 'Dedi Kurniawan',
    email: 'dedikurnia@outlook.com',
    telepon: '0853-1122-3344',
    kecamatan: 'Kec. Lueng Bata',
    level: 'Level 2 · Green Pioneer',
    poin: 1530,
    totalKg: 38.0,
    frekuensi: 11,
    mitraFavorit: 'Bank Sampah Lueng Bata',
    joinDate: '05 Mei 2026',
    status: 'Aktif',
  },
  {
    id: 'EB-2026-502',
    nama: 'Cut Zahra',
    email: 'cutzahra@gmail.com',
    telepon: '0811-2233-4455',
    kecamatan: 'Kec. Banda Raya',
    level: 'Level 1 · Eco Starter',
    poin: 420,
    totalKg: 12.5,
    frekuensi: 3,
    mitraFavorit: 'Bank Sampah Banda Raya',
    joinDate: '18 Jun 2026',
    status: 'Aktif',
  },
  {
    id: 'EB-2026-618',
    nama: 'Bukhari Al-Hafiz',
    email: 'bukhari.hafiz@gmail.com',
    telepon: '0822-7711-8899',
    kecamatan: 'Kec. Kuta Alam',
    level: 'Level 3 · Planet Guardian',
    poin: 4150,
    totalKg: 112.0,
    frekuensi: 32,
    mitraFavorit: 'Bank Sampah Syiah Kuala',
    joinDate: '12 Jan 2026',
    status: 'Aktif',
  },
  {
    id: 'EB-2026-724',
    nama: 'Rizka Maulida',
    email: 'rizka.maulida@yahoo.co.id',
    telepon: '0852-6633-2211',
    kecamatan: 'Kec. Jaya Baru',
    level: 'Level 1 · Eco Starter',
    poin: 150,
    totalKg: 4.0,
    frekuensi: 1,
    mitraFavorit: 'Bank Sampah Banda Raya',
    joinDate: '01 Nov 2026',
    status: 'Nonaktif',
  },
];

const defaultCategories: WasteCategory[] = [
  { id: 'WST-001', nama: 'Botol Plastik PET', poinPerKg: 50, emisiPerKg: 1.5 },
  { id: 'WST-002', nama: 'Kardus & Kertas', poinPerKg: 30, emisiPerKg: 0.9 },
  { id: 'WST-003', nama: 'Kaleng Logam & Aluminium', poinPerKg: 80, emisiPerKg: 9.0 },
  { id: 'WST-004', nama: 'Botol Kaca', poinPerKg: 20, emisiPerKg: 0.3 },
  { id: 'WST-005', nama: 'Minyak Jelantah', poinPerKg: 70, emisiPerKg: 2.8 },
];

const monthlyData = [
  { month: 'Jun', kg: 3200, co2: 6800, nasabah: 980 },
  { month: 'Jul', kg: 3850, co2: 7900, nasabah: 1050 },
  { month: 'Agu', kg: 4100, co2: 8400, nasabah: 1180 },
  { month: 'Sep', kg: 3700, co2: 7600, nasabah: 1240 },
  { month: 'Okt', kg: 4600, co2: 9500, nasabah: 1380 },
  { month: 'Nov', kg: 5200, co2: 11200, nasabah: 1420 },
];

const metricMeta: Record<Metric, { label: string; unit: string }> = {
  kg: { label: 'Sampah terkumpul', unit: 'kg' },
  co2: { label: 'Reduksi CO₂', unit: 'kg' },
  nasabah: { label: 'Nasabah aktif', unit: 'orang' },
};

const composition = [
  { label: 'Plastik (PET, HDPE)', pct: 42 },
  { label: 'Kardus & kertas', pct: 28 },
  { label: 'Logam & aluminium', pct: 20 },
  { label: 'Kaca & botol', pct: 10 },
];

const statsByRange: Record<TimeRange, { kg: number; co2: number; nasabah: number; delta: string; vs: string }> = {
  today: { kg: 1342, co2: 2760, nasabah: 138, delta: '+4.1%', vs: 'dibanding kemarin' },
  '7d': { kg: 9480, co2: 19500, nasabah: 612, delta: '+6.8%', vs: 'dibanding 7 hari sebelumnya' },
  '30d': { kg: 45200, co2: 89000, nasabah: 2480, delta: '+12.4%', vs: 'dibanding bulan lalu' },
  year: { kg: 312600, co2: 640000, nasabah: 12980, delta: '+21.0%', vs: 'dibanding 2025' },
};

const rangeLabel: Record<TimeRange, string> = { today: 'Hari ini', '7d': '7 hari', '30d': '30 hari', year: '2026' };

// ─── Helper ──────────────────────────────────────────────────────────────────
const fmtNum = (n: number) => n.toLocaleString('id-ID');
const fmtMass = (kg: number) => (kg >= 1000 ? `${(kg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} ton` : `${fmtNum(kg)} kg`);

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2';
const btnPrimary = `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium transition-colors disabled:opacity-60 ${focusRing}`;
const btnSecondary = `inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors ${focusRing}`;
const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20`;

// ─── Halaman Admin ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [txFilter, setTxFilter] = useState<TxFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [metric, setMetric] = useState<Metric>('kg');

  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [mitra, setMitra] = useState<MitraInfo[]>(initialMitra);
  const [selectedMitraId, setSelectedMitraId] = useState<string | null>(null);
  const [mitraMapView, setMitraMapView] = useState<'interactive' | 'overview'>('overview');

  const [nasabah, setNasabah] = useState<NasabahItem[]>(initialNasabah);
  const [selectedNasabah, setSelectedNasabah] = useState<NasabahItem | null>(null);
  const [nasabahSearch, setNasabahSearch] = useState('');
  const [nasabahLevelFilter, setNasabahLevelFilter] = useState<'all' | 'Level 1' | 'Level 2' | 'Level 3' | 'Nonaktif'>('all');
  const [nasabahFormOpen, setNasabahFormOpen] = useState(false);
  const [nasabahEditing, setNasabahEditing] = useState<NasabahItem | null>(null);
  const [nasabahForm, setNasabahForm] = useState({
    nama: '',
    email: '',
    telepon: '',
    kecamatan: 'Kec. Syiah Kuala',
    level: 'Level 1 · Eco Starter',
    poin: '0',
    mitraFavorit: mitraLocations[0].name,
  });
  const [nasabahFormError, setNasabahFormError] = useState('');

  const { wasteTypes = [] } = useWaste();
  const [categories, setCategories] = useState<WasteCategory[]>(defaultCategories);
  const seeded = useRef(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<WasteCategory | null>(null);
  const [form, setForm] = useState({ nama: '', poin: '', emisi: '' });
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState<WasteCategory | null>(null);

  const [toast, setToast] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);

  // ── Muat data persisten dari localStorage agar perubahan tidak reset saat login ulang / reload ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }

      const savedMitra = localStorage.getItem(STORAGE_KEY_MITRA);
      if (savedMitra) {
        const parsed = JSON.parse(savedMitra);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Hanya pulihkan status operasional; alamat dan jadwal selalu mengikuti data lokasi terbaru.
          const merged = initialMitra.map((init) => {
            const found = parsed.find((p: MitraInfo) => p.id === init.id);
            return found ? { ...init, status: found.status } : init;
          });
          setMitra(merged);
        }
      }

      const savedTx = localStorage.getItem(STORAGE_KEY_TX);
      if (savedTx) {
        const parsedTx = JSON.parse(savedTx);
        if (Array.isArray(parsedTx) && parsedTx.length > 0) {
          setTransactions(parsedTx);
        }
      }

      const savedCat = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (savedCat) {
        const parsedCat = JSON.parse(savedCat);
        if (Array.isArray(parsedCat) && parsedCat.length > 0) {
          setCategories(parsedCat);
          seeded.current = true;
        }
      }

      const savedNasabah = localStorage.getItem(STORAGE_KEY_NASABAH);
      if (savedNasabah) {
        const parsedNasabah = JSON.parse(savedNasabah);
        if (Array.isArray(parsedNasabah) && parsedNasabah.length > 0) {
          setNasabah(parsedNasabah);
        }
      }
    } catch (err) {
      console.warn('Gagal membaca data dari localStorage:', err);
    }
  }, []);

  // Sinkronkan master data dari hook sekali saja saat data tersedia jika belum ada di storage
  useEffect(() => {
    if (seeded.current || wasteTypes.length === 0) return;
    seeded.current = true;
    const synced = wasteTypes.map((w: { id: string; nama?: string; name?: string; poinPerKg: number; emisiPerKg: number }) => ({
      id: w.id,
      nama: w.nama || w.name || w.id,
      poinPerKg: w.poinPerKg,
      emisiPerKg: w.emisiPerKg,
    }));
    setCategories(synced);
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(synced));
    } catch (e) {}
  }, [wasteTypes]);

  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotificationOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFormOpen(false);
        setDeleting(null);
        setNotificationOpen(false);
        setNasabahFormOpen(false);
        setSelectedNasabah(null);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // ── Aksi ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    await new Promise((r) => setTimeout(r, 500));
    if (password === 'admin123' || password === 'ecobank2026') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch (e) {}
      setPassword('');
      setToast('Selamat datang, Administrator');
    } else {
      setAuthError('Kata sandi salah. Periksa kembali, atau pakai sandi demo di bawah.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {}
    setToast('Berhasil keluar dari admin');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
    setToast('Data diperbarui');
  };

  const decideTx = (id: string, status: 'completed' | 'rejected') => {
    setTransactions((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, status } : t));
      try {
        localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setToast(status === 'completed' ? `${id} diverifikasi, poin masuk ke nasabah` : `${id} ditolak`);
  };

  const exportTransactions = () => {
    const statusLabel: Record<TxStatus, string> = { completed: 'Selesai', pending: 'Menunggu verifikasi', rejected: 'Ditolak' };
    downloadCsv('transaksi-ecobank.csv', [
      ['ID', 'Nasabah', 'ID Nasabah', 'Jenis', 'Kategori', 'Jumlah', 'Poin', 'Waktu', 'Lokasi', 'Status'],
      ...filteredTransactions.map((t) => [t.id, t.userName, t.userId, t.type === 'setor' ? 'Setoran' : 'Penukaran', t.category, t.weightOrUnit, t.points, t.time, t.location, statusLabel[t.status]]),
    ]);
    setToast(`${filteredTransactions.length} transaksi diekspor ke CSV`);
  };

  const updateMitra = (id: string, patch: Partial<MitraInfo>) => {
    setMitra((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...patch } : m));
      try {
        localStorage.setItem(STORAGE_KEY_MITRA, JSON.stringify(next));
      } catch (err) {
        console.warn('Gagal menyimpan mitra ke localStorage:', err);
      }
      return next;
    });
  };

  const resetMitraData = () => {
    setMitra(initialMitra);
    try {
      localStorage.removeItem(STORAGE_KEY_MITRA);
    } catch (e) {}
    setToast('Data status mitra berhasil direset ke default');
  };

  const openAddForm = () => {
    setEditing(null);
    setForm({ nama: '', poin: '', emisi: '' });
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (c: WasteCategory) => {
    setEditing(c);
    setForm({ nama: c.nama, poin: String(c.poinPerKg), emisi: String(c.emisiPerKg) });
    setFormError('');
    setFormOpen(true);
  };

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const nama = form.nama.trim();
    const poin = Number(form.poin);
    const emisi = Number(form.emisi.replace(',', '.'));
    if (!nama) return setFormError('Nama kategori wajib diisi.');
    if (categories.some((c) => c.nama.toLowerCase() === nama.toLowerCase() && c.id !== editing?.id))
      return setFormError('Nama ini sudah dipakai kategori lain. Gunakan nama yang berbeda.');
    if (!Number.isFinite(poin) || poin < 0 || !Number.isInteger(poin))
      return setFormError('Poin per kg harus berupa bilangan bulat, minimal 0.');
    if (!Number.isFinite(emisi) || emisi < 0) return setFormError('Faktor emisi harus berupa angka, minimal 0.');

    if (editing) {
      setCategories((prev) => {
        const next = prev.map((c) => (c.id === editing.id ? { ...c, nama, poinPerKg: poin, emisiPerKg: emisi } : c));
        try {
          localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      setToast(`Kategori ${nama} disimpan`);
    } else {
      const nextIdNum = Math.max(0, ...categories.map((c) => parseInt(c.id.replace(/\D/g, ''), 10) || 0)) + 1;
      const newCat: WasteCategory = { id: `WST-${String(nextIdNum).padStart(3, '0')}`, nama, poinPerKg: poin, emisiPerKg: emisi };
      setCategories((prev) => {
        const next = [...prev, newCat];
        try {
          localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      setToast(`Kategori ${nama} ditambahkan`);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== deleting.id);
      try {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setToast(`Kategori ${deleting.nama} dihapus`);
    setDeleting(null);
  };

  // ── Aksi Nasabah ──
  const updateNasabahStatus = (id: string, newStatus: 'Aktif' | 'Nonaktif') => {
    setNasabah((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n));
      try {
        localStorage.setItem(STORAGE_KEY_NASABAH, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setToast(`Status nasabah ${id} diubah ke ${newStatus}`);
    if (selectedNasabah && selectedNasabah.id === id) {
      setSelectedNasabah((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const addBonusPoints = (id: string, amount: number) => {
    setNasabah((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, poin: n.poin + amount } : n));
      try {
        localStorage.setItem(STORAGE_KEY_NASABAH, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setToast(`+${amount} poin berhasil ditambahkan`);
    if (selectedNasabah && selectedNasabah.id === id) {
      setSelectedNasabah((prev) => (prev ? { ...prev, poin: prev.poin + amount } : null));
    }
  };

  const openAddNasabahForm = () => {
    setNasabahEditing(null);
    setNasabahForm({
      nama: '',
      email: '',
      telepon: '',
      kecamatan: 'Kec. Syiah Kuala',
      level: 'Level 1 · Eco Starter',
      poin: '0',
      mitraFavorit: mitraLocations[0].name,
    });
    setNasabahFormError('');
    setNasabahFormOpen(true);
  };

  const openEditNasabahForm = (n: NasabahItem) => {
    setNasabahEditing(n);
    setNasabahForm({
      nama: n.nama,
      email: n.email,
      telepon: n.telepon,
      kecamatan: n.kecamatan,
      level: n.level,
      poin: String(n.poin),
      mitraFavorit: n.mitraFavorit,
    });
    setNasabahFormError('');
    setNasabahFormOpen(true);
  };

  const saveNasabah = (e: React.FormEvent) => {
    e.preventDefault();
    const nama = nasabahForm.nama.trim();
    const email = nasabahForm.email.trim();
    const telepon = nasabahForm.telepon.trim();
    const poin = parseInt(nasabahForm.poin, 10) || 0;
    if (!nama) return setNasabahFormError('Nama nasabah wajib diisi.');
    if (!email || !email.includes('@')) return setNasabahFormError('Format email tidak valid.');

    if (nasabahEditing) {
      setNasabah((prev) => {
        const next = prev.map((n) =>
          n.id === nasabahEditing.id
            ? { ...n, nama, email, telepon, kecamatan: nasabahForm.kecamatan, level: nasabahForm.level, poin, mitraFavorit: nasabahForm.mitraFavorit }
            : n
        );
        try {
          localStorage.setItem(STORAGE_KEY_NASABAH, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      setToast(`Data nasabah ${nama} diperbarui`);
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      const newNasabah: NasabahItem = {
        id: `EB-2026-${randomNum}`,
        nama,
        email,
        telepon: telepon || '0812-xxxx-xxxx',
        kecamatan: nasabahForm.kecamatan,
        level: nasabahForm.level,
        poin,
        totalKg: 0,
        frekuensi: 0,
        mitraFavorit: nasabahForm.mitraFavorit,
        joinDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Aktif',
      };
      setNasabah((prev) => {
        const next = [newNasabah, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY_NASABAH, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      setToast(`Nasabah baru ${nama} berhasil didaftarkan`);
    }
    setNasabahFormOpen(false);
  };

  const exportNasabah = () => {
    downloadCsv('data-nasabah-ecobank.csv', [
      ['ID Nasabah', 'Nama', 'Email', 'No. HP', 'Kecamatan', 'Level', 'Saldo Poin', 'Total Setor (kg)', 'Frekuensi', 'Mitra Favorit', 'Tanggal Bergabung', 'Status'],
      ...filteredNasabah.map((n) => [n.id, n.nama, n.email, n.telepon, n.kecamatan, n.level, n.poin, n.totalKg, n.frekuensi, n.mitraFavorit, n.joinDate, n.status]),
    ]);
    setToast(`${filteredNasabah.length} data nasabah diekspor ke CSV`);
  };

  // ── Turunan data ──
  const filteredNasabah = nasabah.filter((n) => {
    if (nasabahLevelFilter === 'Nonaktif' && n.status !== 'Nonaktif') return false;
    if (nasabahLevelFilter !== 'all' && nasabahLevelFilter !== 'Nonaktif' && !n.level.includes(nasabahLevelFilter)) return false;
    const q = nasabahSearch.trim().toLowerCase();
    if (!q) return true;
    return [n.id, n.nama, n.email, n.telepon, n.kecamatan, n.mitraFavorit].some((v) => v.toLowerCase().includes(q));
  });
  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === 'setor' && t.type !== 'setor') return false;
    if (txFilter === 'tukar' && t.type !== 'tukar') return false;
    if (txFilter === 'pending' && t.status !== 'pending') return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [t.id, t.userName, t.userId, t.category, t.location].some((v) => v.toLowerCase().includes(q));
  });

  const pendingCount = transactions.filter((t) => t.status === 'pending').length;
  const activeMitra = mitra.filter((m) => m.status === 'Aktif');
  const selectedMitra = mitra.find((m) => m.id === selectedMitraId) ?? null;
  const stats = statsByRange[timeRange];
  const maxMetric = Math.max(...monthlyData.map((d) => d[metric]));
  const avgMetric = Math.round(monthlyData.reduce((s, d) => s + d[metric], 0) / monthlyData.length);

  useEffect(() => {
    if (activeTab !== 'tracking' || !selectedMitraId) return;
    const selectedRow = document.getElementById(`mitra-${selectedMitraId}`);
    if (!selectedRow) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    selectedRow.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }, [activeTab, selectedMitraId]);

  const filterTabs: { key: TxFilter; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'setor', label: 'Setoran' },
    { key: 'tukar', label: 'Penukaran' },
    { key: 'pending', label: `Perlu verifikasi${pendingCount ? ` (${pendingCount})` : ''}` },
  ];

  // ═════════════════════════════════════════════════════════════════════════
  // LOGIN
  // ═════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex flex-col justify-between px-4 py-6 sm:px-8 font-sans bg-neutral-950">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/images/background.jpg')` }} />
        <div className="absolute inset-0 bg-neutral-950/70" />

        <header className="relative z-10 w-full max-w-5xl mx-auto">
          <Link href="/" className={`inline-flex items-center gap-2 text-sm text-white/90 hover:text-white px-3 py-1.5 rounded-lg bg-black/30 ${focusRing}`}>
            <span aria-hidden="true">←</span> Kembali ke beranda
          </Link>
        </header>

        <main className="relative z-10 w-full max-w-3xl mx-auto my-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="md:col-span-2 bg-emerald-800 text-white p-8 flex flex-col justify-between gap-8">
              <div>
                <p className="text-base font-semibold">EcoBank Admin</p>
                <p className="text-sm text-emerald-100 mt-1.5 leading-relaxed">Catat setoran, verifikasi poin, dan pantau mitra bank sampah.</p>
              </div>
              <div className="w-36 h-36 mx-auto">
                <img src="/images/maskot_ecobank3.png" alt="Maskot EcoBank" className="w-full h-full object-contain anim-float" />
              </div>
              <p className="text-sm text-emerald-100">Khusus petugas dan pengelola unit bank sampah terdaftar.</p>
            </div>

            <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
              <h1 className="text-xl font-semibold text-slate-900">Masuk ke dashboard</h1>
              <p className="text-sm text-slate-600 mt-1.5 mb-6">Masukkan kata sandi petugas untuk melanjutkan.</p>

              {authError && (
                <p role="alert" className="mb-4 text-sm text-red-700 border-l-2 border-red-600 pl-3 py-1">
                  {authError}
                </p>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="admin-pass" className="block text-sm font-medium text-slate-800 mb-1.5">
                    Kata sandi
                  </label>
                  <div className="relative">
                    <input
                      id="admin-pass"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputCls} pr-11`}
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-800 rounded-md"
                      aria-label={showPass ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      <Icon name={showPass ? 'eyeoff' : 'eye'} />
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
                  {loading ? 'Memeriksa…' : 'Masuk'}
                </button>
              </form>

              <p className="mt-5 text-sm text-slate-500">
                Mode demo:{' '}
                <button type="button" onClick={() => setPassword('admin123')} className="font-mono text-slate-800 underline underline-offset-2 hover:text-emerald-800">
                  isi sandi demo
                </button>
              </p>
            </div>
          </div>
        </main>

        <footer className="relative z-10 text-center text-sm text-white/70">&copy; {new Date().getFullYear()} EcoBank</footer>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═════════════════════════════════════════════════════════════════════════
  const navTabs: { tab: AdminTab; label: string; description: string; icon: keyof typeof ICONS; count?: number }[] = [
    { tab: 'overview', label: 'Ringkasan', description: 'Pantau aktivitas harian', icon: 'dashboard', count: pendingCount || undefined },
    { tab: 'nasabah', label: 'Nasabah', description: 'Data & saldo poin pengguna', icon: 'users', count: nasabah.length || undefined },
    { tab: 'tracking', label: 'Lokasi mitra', description: 'Peta pin lokasi & detail mitra', icon: 'pin' },
    { tab: 'analitik', label: 'Analitik', description: 'Tren dan dampak', icon: 'chart' },
    { tab: 'masterdata', label: 'Master data', description: 'Atur kategori dan poin', icon: 'database' },
  ];
  const pageTitle: Record<AdminTab, string> = {
    overview: 'Ringkasan',
    nasabah: 'Direktori Nasabah',
    tracking: 'Lokasi mitra',
    analitik: 'Analitik',
    masterdata: 'Master data sampah',
  };
  const pageDescription: Record<AdminTab, string> = {
    overview: 'Pantau dampak, transaksi masuk, dan pekerjaan yang perlu ditindaklanjuti.',
    nasabah: 'Kelola data nasabah terdaftar, akumulasi setoran sampah, dan saldo poin reward.',
    tracking: 'Lihat semua titik mitra dan pilih pin untuk membuka detail lokasi.',
    analitik: 'Bandingkan volume setoran, aktivitas nasabah, dan dampak lingkungan.',
    masterdata: 'Atur nilai poin dan faktor emisi yang digunakan dalam perhitungan setoran.',
  };

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-slate-900 flex font-sans antialiased">
      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 flex-shrink-0 bg-[#f2f6f2] border-r border-slate-200 transition-all duration-200 overflow-hidden ${
          sidebarOpen ? 'w-60' : 'w-0 border-r-0'
        }`}
      >
        <div className="w-60 h-full flex flex-col">
          <div className="px-5 h-16 flex items-center gap-3 border-b border-slate-200">
            <EcoBankMark size={32} />
            <div className="leading-tight">
              <p className="font-semibold text-slate-900">EcoBank</p>
              <p className="text-xs text-slate-500">Admin · Banda Aceh</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Menu utama">
            {navTabs.map((item) => {
              const active = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm text-left transition-colors ${focusRing} ${
                    active ? 'bg-white text-emerald-900 font-medium border border-emerald-100 shadow-sm' : 'text-slate-700 hover:bg-white/70 border border-transparent'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <Icon name={item.icon} className={`w-[18px] h-[18px] ${active ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span>
                      <span className="block leading-5">{item.label}</span>
                      <span className="block mt-0.5 text-xs font-normal text-slate-500">{item.description}</span>
                    </span>
                  </span>
                  {item.count ? <span className="text-xs font-medium text-amber-700">{item.count}</span> : null}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-200 space-y-1">
              <Link href="/" target="_blank" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 ${focusRing}`}>
                <Icon name="external" className="w-[18px] h-[18px] text-slate-500" />
                Landing page
              </Link>
              <Link href="/dashboard" target="_blank" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 ${focusRing}`}>
                <Icon name="users" className="w-[18px] h-[18px] text-slate-500" />
                Portal nasabah
              </Link>
            </div>
          </nav>

          <div className="p-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <div className="min-w-0 px-2">
              <p className="text-sm font-medium text-slate-900 truncate">Super Admin</p>
              <p className="text-xs text-slate-500 truncate">admin@ecobank.id</p>
            </div>
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 ${focusRing}`}
              title="Keluar"
              aria-label="Keluar dari panel admin"
            >
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>

      {/* Konten */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 min-h-16 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg text-slate-600 hover:bg-slate-100 ${focusRing}`}
              aria-label={sidebarOpen ? 'Tutup menu samping' : 'Buka menu samping'}
            >
              <Icon name="sidebar" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-slate-900 truncate">{pageTitle[activeTab]}</h1>
              <p className="hidden sm:block text-xs text-slate-600 truncate">{pageDescription[activeTab]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'overview' && (
              <div className="hidden md:flex rounded-lg border border-slate-300 overflow-hidden text-sm" role="group" aria-label="Rentang waktu">
                {(['today', '7d', '30d', 'year'] as TimeRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    aria-pressed={timeRange === r}
                    className={`px-3 py-1.5 border-r last:border-r-0 border-slate-300 ${
                      timeRange === r ? 'bg-emerald-700 text-white font-medium' : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {rangeLabel[r]}
                  </button>
                ))}
              </div>
            )}

            <button onClick={handleRefresh} disabled={isRefreshing} className={`p-2 rounded-lg text-slate-600 hover:bg-slate-100 ${focusRing}`} title="Perbarui data" aria-label="Perbarui data">
              <Icon name="refresh" className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className={`p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative ${focusRing}`}
                aria-label={`Notifikasi, ${pendingCount} perlu verifikasi`}
                aria-expanded={notificationOpen}
              >
                <Icon name="bell" />
                {pendingCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-slate-200 shadow-lg z-50">
                  <p className="px-4 py-3 text-sm font-semibold border-b border-slate-200">Perlu verifikasi ({pendingCount})</p>
                  <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {transactions.filter((t) => t.status === 'pending').map((t) => (
                      <li key={t.id} className="px-4 py-3 text-sm">
                        <p className="font-medium text-slate-900">{t.userName}</p>
                        <p className="text-slate-600">{t.category} · {t.weightOrUnit}</p>
                        <div className="mt-2 flex gap-4 text-sm font-medium">
                          <button onClick={() => decideTx(t.id, 'completed')} className="text-emerald-700 hover:underline">Verifikasi</button>
                          <button onClick={() => decideTx(t.id, 'rejected')} className="text-slate-600 hover:underline">Tolak</button>
                        </div>
                      </li>
                    ))}
                    {pendingCount === 0 && <li className="px-4 py-6 text-sm text-slate-500 text-center">Semua setoran sudah diverifikasi.</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-7xl w-full mx-auto">
          {/* ───────── RINGKASAN ───────── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <section aria-label="Ringkasan angka" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Kinerja EcoBank</h2>
                    <p className="text-sm text-slate-600 mt-0.5">Angka utama untuk periode yang dipilih.</p>
                  </div>
                  <div className="md:hidden flex rounded-lg border border-slate-300 overflow-hidden text-sm w-fit">
                    {(['today', '7d', '30d', 'year'] as TimeRange[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        aria-pressed={timeRange === r}
                        className={`px-3 py-1.5 border-r last:border-r-0 border-slate-300 ${timeRange === r ? 'bg-emerald-700 text-white font-medium' : 'bg-white text-slate-700'}`}
                      >
                        {rangeLabel[r]}
                      </button>
                    ))}
                  </div>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                  {[
                    { label: 'Sampah terkumpul', value: fmtMass(stats.kg), note: `${stats.delta} ${stats.vs}` },
                    { label: 'Reduksi karbon (CO₂)', value: fmtMass(stats.co2), note: 'Dihitung dari faktor emisi per kategori' },
                    { label: 'Nasabah aktif', value: fmtNum(stats.nasabah), note: `Periode: ${rangeLabel[timeRange].toLowerCase()}` },
                    { label: 'Perlu verifikasi', value: String(pendingCount), note: pendingCount ? 'Menunggu petugas' : 'Tidak ada antrean' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-[#f6f9f6] border border-slate-100 px-4 py-4">
                      <dt className="text-sm text-slate-600">{s.label}</dt>
                      <dd className="mt-2 text-2xl sm:text-3xl font-semibold tabular-nums text-slate-900">{s.value}</dd>
                      <dd className="mt-1 text-sm text-slate-600 leading-relaxed">{s.note}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Transaksi */}
              <section aria-labelledby="tx-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                  <div>
                    <h2 id="tx-title" className="text-lg font-semibold text-slate-900">Transaksi terbaru</h2>
                    <p className="text-sm text-slate-600 mt-0.5">Verifikasi setoran setelah sampah ditimbang.</p>
                  </div>
                  <button onClick={exportTransactions} className={btnSecondary}>
                    <Icon name="download" /> Ekspor CSV
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter transaksi">
                    {filterTabs.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setTxFilter(f.key)}
                        aria-pressed={txFilter === f.key}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${focusRing} ${
                          txFilter === f.key ? 'bg-slate-900 text-white border-slate-900 font-medium' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative lg:w-80">
                    <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama, ID, atau jenis sampah"
                      aria-label="Cari transaksi"
                      className={`${inputCls} pl-9 py-2`}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80">
                      <tr className="text-slate-600 border-b border-slate-200">
                        <th className="py-3 pr-4 font-medium">Nasabah</th>
                        <th className="py-3 pr-4 font-medium">Transaksi</th>
                        <th className="py-3 pr-4 font-medium hidden md:table-cell">Lokasi</th>
                        <th className="py-3 pr-4 font-medium text-right">Poin</th>
                        <th className="py-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="align-top">
                          <td className="py-3.5 pr-4">
                            <p className="font-medium text-slate-900">{tx.userName}</p>
                            <p className="text-slate-500">{tx.userId} · {tx.id}</p>
                          </td>
                          <td className="py-3.5 pr-4">
                            <p className="text-slate-900">{tx.category}</p>
                            <p className="text-slate-500">{tx.type === 'setor' ? 'Setoran' : 'Penukaran'} · {tx.weightOrUnit} · {tx.time}</p>
                          </td>
                          <td className="py-3.5 pr-4 text-slate-700 hidden md:table-cell">{tx.location}</td>
                          <td className={`py-3.5 pr-4 text-right tabular-nums font-medium ${tx.status === 'rejected' ? 'text-slate-400 line-through' : tx.points > 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                            {tx.points > 0 ? `+${tx.points}` : tx.points}
                          </td>
                          <td className="py-3.5 text-right whitespace-nowrap">
                            {tx.status === 'pending' ? (
                              <span className="inline-flex gap-2">
                                <button onClick={() => decideTx(tx.id, 'completed')} className={`px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium ${focusRing}`}>
                                  Verifikasi
                                </button>
                                <button onClick={() => decideTx(tx.id, 'rejected')} className={`px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium ${focusRing}`}>
                                  Tolak
                                </button>
                              </span>
                            ) : tx.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1.5 text-slate-700">
                                <span className="w-2 h-2 rounded-full bg-emerald-600" /> Selesai
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-slate-400" /> Ditolak
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredTransactions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-slate-500">
                            Tidak ada transaksi yang cocok. Ubah filter atau hapus kata pencarian.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-slate-500">Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi</p>
              </section>

              {/* Mitra */}
              <section aria-labelledby="mitra-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <h2 id="mitra-title" className="text-lg font-semibold text-slate-900">Status mitra bank sampah</h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {activeMitra.length} dari {mitra.length} unit aktif · pilih unit untuk alamat, jadwal, dan rute Google Maps.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('tracking')} className={btnSecondary}>
                    <Icon name="pin" /> Lihat peta
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80">
                      <tr className="text-slate-600 border-b border-slate-200">
                        <th className="py-3 pr-4 font-medium">Mitra</th>
                        <th className="py-3 pr-4 font-medium hidden md:table-cell">Jam operasional</th>
                        <th className="py-3 pr-4 font-medium hidden lg:table-cell">Alamat</th>
                        <th className="py-3 font-medium text-right">Status unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mitra.map((m) => (
                        <tr
                          key={m.id}
                          tabIndex={0}
                          onClick={() => {
                            setSelectedMitraId(m.id);
                            setMitraMapView('interactive');
                            setActiveTab('tracking');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setSelectedMitraId(m.id);
                              setMitraMapView('interactive');
                              setActiveTab('tracking');
                            }
                          }}
                          className={`cursor-pointer hover:bg-slate-50 ${focusRing}`}
                        >
                          <td className="py-3.5 pr-4">
                            <p className="font-medium text-slate-900">{m.name}</p>
                            <p className="text-slate-500">{m.district}</p>
                          </td>
                          <td className="py-3.5 pr-4 text-slate-700 hidden md:table-cell">
                            {m.openingHours[0]}
                            {m.openingHours.length > 1 && <span className="block text-xs text-slate-500">+{m.openingHours.length - 1} jadwal lainnya</span>}
                          </td>
                          <td className="py-3.5 pr-4 text-slate-700 hidden lg:table-cell">{m.address}</td>
                          <td className="py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const next = m.status === 'Aktif' ? 'Libur' : 'Aktif';
                                  updateMitra(m.id, { status: next });
                                  setToast(next === 'Libur' ? `${m.name} ditandai libur` : `${m.name} dibuka kembali`);
                                }}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                                  m.status === 'Aktif'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                }`}
                                title="Klik untuk mengubah status unit"
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'Aktif' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                                {m.status}
                              </button>
                              <a
                                href={getGoogleMapsSearchUrl(m)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-md"
                                title="Buka di Google Maps"
                                aria-label={`Buka ${m.name} di Google Maps`}
                              >
                                <Icon name="external" className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-slate-600">Pilih unit untuk melihat jam operasional dan alamat lengkap. Konfirmasikan jenis material kepada pengelola.</p>
              </section>
            </div>
          )}

          {/* ───────── NASABAH (PENGGUNA ECOBANK) ───────── */}
          {activeTab === 'nasabah' && (
            <div className="space-y-6">
              {/* Header KPI Nasabah */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Nasabah</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{fmtNum(nasabah.length)}</p>
                  <p className="text-xs text-emerald-700 mt-1 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {nasabah.filter((n) => n.status === 'Aktif').length} akun aktif
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Poin Beredar</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                    {fmtNum(nasabah.reduce((acc, curr) => acc + curr.poin, 0))} Pts
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Siap ditukar reward</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Sampah Terkumpul</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                    {nasabah.reduce((acc, curr) => acc + curr.totalKg, 0).toFixed(1)} kg
                  </p>
                  <p className="text-xs text-emerald-700 mt-1 font-medium">Dari {nasabah.reduce((acc, curr) => acc + curr.frekuensi, 0)}x setoran</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rata-rata Saldo</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                    {Math.round(nasabah.reduce((acc, curr) => acc + curr.poin, 0) / Math.max(1, nasabah.length))} Pts
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Per akun nasabah</p>
                </div>
              </div>

              {/* Table section */}
              <section aria-labelledby="nasabah-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                  <div>
                    <h2 id="nasabah-title" className="text-lg font-semibold text-slate-900">Direktori Nasabah</h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Kelola profil nasabah, saldo poin, dan verifikasi status akun pengguna.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={exportNasabah}
                      className={btnSecondary}
                    >
                      <Icon name="download" />
                      Ekspor CSV
                    </button>
                    <button
                      type="button"
                      onClick={openAddNasabahForm}
                      className={btnPrimary}
                    >
                      <Icon name="plus" />
                      Tambah Nasabah
                    </button>
                  </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={nasabahSearch}
                      onChange={(e) => setNasabahSearch(e.target.value)}
                      placeholder="Cari nama, ID nasabah, email, no HP, atau kecamatan..."
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {(
                      [
                        { key: 'all', label: 'Semua' },
                        { key: 'Level 1', label: 'Eco Starter' },
                        { key: 'Level 2', label: 'Green Pioneer' },
                        { key: 'Level 3', label: 'Planet Guardian' },
                        { key: 'Nonaktif', label: 'Nonaktif' },
                      ] as const
                    ).map((lvl) => (
                      <button
                        key={lvl.key}
                        onClick={() => setNasabahLevelFilter(lvl.key)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors border ${
                          nasabahLevelFilter === lvl.key
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80">
                      <tr className="text-slate-600 border-b border-slate-200">
                        <th className="py-3 px-4 font-medium">Nasabah</th>
                        <th className="py-3 px-4 font-medium hidden md:table-cell">Kontak & Lokasi</th>
                        <th className="py-3 px-4 font-medium hidden sm:table-cell">Level Akun</th>
                        <th className="py-3 px-4 font-medium text-right">Akumulasi Setor</th>
                        <th className="py-3 px-4 font-medium text-right">Saldo Poin</th>
                        <th className="py-3 px-4 font-medium text-center">Status</th>
                        <th className="py-3 px-4 font-medium text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredNasabah.map((n) => (
                        <tr
                          key={n.id}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                          onClick={() => setSelectedNasabah(n)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                                {n.nama.split(' ').map((x) => x[0]).slice(0, 2).join('')}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-slate-900 truncate">{n.nama}</p>
                                <p className="text-xs font-mono text-slate-400">{n.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <p className="text-slate-700">{n.email}</p>
                            <p className="text-xs text-slate-500">{n.telepon} &bull; {n.kecamatan}</p>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                              n.level.includes('Level 3')
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : n.level.includes('Level 2')
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {n.level.split(' · ')[1] || n.level}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <p className="font-semibold text-slate-900 tabular-nums">{n.totalKg} kg</p>
                            <p className="text-xs text-slate-500">{n.frekuensi}x setor</p>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-bold text-emerald-700 font-mono text-sm tabular-nums">
                              +{fmtNum(n.poin)} Pts
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus = n.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
                                updateNasabahStatus(n.id, nextStatus);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                                n.status === 'Aktif'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                              }`}
                              title="Klik untuk mengubah status aktif / nonaktif"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${n.status === 'Aktif' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                              {n.status}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditNasabahForm(n);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                title="Ubah data nasabah"
                              >
                                <Icon name="pencil" className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNasabah(n);
                                }}
                                className="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium"
                              >
                                Rincian
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredNasabah.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500">
                            Tidak ada nasabah yang sesuai dengan kata kunci pencarian atau filter ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                  <span>Menampilkan {filteredNasabah.length} dari {nasabah.length} nasabah terdaftar</span>
                  <span>Diperbarui otomatis secara lokal</span>
                </div>
              </section>
            </div>
          )}

          {/* ───────── LOKASI MITRA ───────── */}
          {activeTab === 'tracking' && (
            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm" aria-label="Pilih tampilan peta mitra">
                <p className="mb-3 text-sm font-medium text-slate-700">Pilih tampilan peta</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Tampilan peta lokasi mitra">
                  <button
                    type="button"
                    aria-pressed={mitraMapView === 'interactive'}
                    onClick={() => setMitraMapView('interactive')}
                    className={mitraMapView === 'interactive' ? btnPrimary : btnSecondary}
                  >
                    <Icon name="navigation" />
                    Peta interaktif
                  </button>
                  <button
                    type="button"
                    aria-pressed={mitraMapView === 'overview'}
                    onClick={() => setMitraMapView('overview')}
                    className={mitraMapView === 'overview' ? btnPrimary : btnSecondary}
                  >
                    <Icon name="pin" />
                    Ikhtisar semua pin
                  </button>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.4fr)] gap-5 items-start">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm" aria-labelledby="mitra-list-title">
                <div className="mb-5">
                  <h2 id="mitra-list-title" className="text-lg font-semibold text-slate-900">Daftar unit bank sampah</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {mitra.length} lokasi terdaftar. Pilih nama unit untuk melihat informasi lengkap.
                  </p>
                </div>

                <div className="space-y-5">
                  {[...new Set(mitra.map((m) => m.district))].map((district) => {
                    const districtMitra = mitra.filter((m) => m.district === district);
                    return (
                      <section key={district} aria-label={district}>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-700">{district}</h3>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {districtMitra.length} unit
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {districtMitra.map((m) => {
                            const markerNumber = mitraLocations.findIndex((location) => location.id === m.id) + 1;
                            const selected = m.id === selectedMitraId;
                            return (
                              <li
                                key={m.id}
                                id={`mitra-${m.id}`}
                                className={`rounded-xl border transition-colors ${
                                  selected ? 'border-emerald-200 bg-emerald-50' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-2 p-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedMitraId(m.id);
                                      setMitraMapView('interactive');
                                    }}
                                    aria-pressed={selected}
                                    className={`min-w-0 flex-1 rounded-lg px-2 py-2 text-left ${focusRing}`}
                                  >
                                    <span className="flex items-start gap-2 text-sm font-semibold leading-snug text-slate-900">
                                      <span aria-hidden="true" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                                        {markerNumber}
                                      </span>
                                      <span>{m.name}</span>
                                    </span>
                                    <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                                      m.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      <span className={`h-1.5 w-1.5 rounded-full ${m.status === 'Aktif' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                                      {m.status}
                                    </span>
                                  </button>
                                  <a
                                    href={getGoogleMapsSearchUrl(m)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`shrink-0 rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:border-emerald-200 hover:text-emerald-800 ${focusRing}`}
                                    title={`Buka ${m.name} di Google Maps`}
                                    aria-label={`Buka ${m.name} di Google Maps`}
                                  >
                                    <Icon name="external" className="h-4 w-4" />
                                  </a>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={resetMitraData}
                  className={`mt-5 text-sm text-slate-600 underline underline-offset-2 hover:text-slate-900 ${focusRing}`}
                  title="Kembalikan status unit ke kondisi awal"
                >
                  Reset status unit
                </button>
              </section>

              <div className="space-y-5">
                {mitraMapView === 'interactive' ? (
                  <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm" aria-labelledby="selected-map-title">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 id="selected-map-title" className="text-lg font-semibold text-slate-900">Peta Google Maps interaktif</h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 break-words">
                        {selectedMitra
                          ? `${selectedMitra.name} · peta akan berpindah saat unit lain dipilih dari daftar.`
                          : 'Pilih nama unit dari daftar untuk menampilkan lokasinya di Google Maps.'}
                      </p>
                    </div>
                    {selectedMitra && (
                      <a
                        href={getGoogleMapsSearchUrl(selectedMitra)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${btnSecondary} shrink-0`}
                      >
                        <Icon name="external" />
                        Buka Maps
                      </a>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <iframe
                      key={selectedMitraId ?? 'aceh'}
                      title={`Google Maps ${selectedMitra?.name ?? 'Aceh'}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      src={getGoogleMapsEmbedUrl(selectedMitra)}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-[280px] w-full sm:h-[340px]"
                    />
                  </div>
                  </section>
                ) : (
                  <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm" aria-labelledby="overview-map-title">
                  <div className="mb-4">
                    <h2 id="overview-map-title" className="text-lg font-semibold text-slate-900">Ikhtisar semua lokasi</h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Peta ini hanya menampilkan pin lokasi semua bank sampah.
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <MitraOsmMap />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Nomor pin sesuai nomor pada daftar. Pin memakai koordinat yang diberikan untuk tiap bank sampah.
                  </p>
                  </section>
                )}

                {mitraMapView === 'interactive' && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm" aria-label="Detail mitra">
                  {selectedMitra ? (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Detail lokasi terpilih</p>
                          <h2 className="mt-1 text-lg font-semibold leading-snug text-slate-900">{selectedMitra.name}</h2>
                          <p className="mt-1 text-sm text-slate-600">{selectedMitra.district}</p>
                        </div>
                        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          selectedMitra.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${selectedMitra.status === 'Aktif' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                          {selectedMitra.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Alamat</h3>
                          <p className="mt-2 break-words text-sm leading-relaxed text-slate-900">{selectedMitra.address}</p>
                        </div>
                        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Telepon</h3>
                          <p className="mt-2 text-sm leading-relaxed text-slate-900">
                            {selectedMitra.phone === 'Belum Tersedia' ? (
                              selectedMitra.phone
                            ) : (
                              <a href={`tel:${selectedMitra.phone.replace(/[^+\d]/g, '')}`} className="font-medium underline underline-offset-2 hover:text-emerald-800">
                                {selectedMitra.phone}
                              </a>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-slate-200 p-4">
                        <h3 className="text-sm font-semibold text-slate-900">Jam operasional</h3>
                        <ul className="mt-2 grid grid-cols-1 gap-2 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
                          {selectedMitra.openingHours.map((hours) => (
                            <li key={hours} className="rounded-lg bg-slate-50 px-3 py-2">{hours}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={getGoogleMapsDirectionsUrl(selectedMitra)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={btnPrimary}
                        >
                          <Icon name="navigation" />
                          Petunjuk arah Google Maps
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const next = selectedMitra.status === 'Aktif' ? 'Libur' : 'Aktif';
                            updateMitra(selectedMitra.id, { status: next });
                            setToast(next === 'Libur' ? `${selectedMitra.name} ditandai libur` : `${selectedMitra.name} diaktifkan kembali`);
                          }}
                          className={btnSecondary}
                        >
                          {selectedMitra.status === 'Aktif' ? 'Tandai libur' : 'Aktifkan unit'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                      <h2 className="text-lg font-semibold text-slate-900">Pilih lokasi mitra</h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        Informasi alamat, telepon, jadwal, dan petunjuk arah akan tampil di sini.
                      </p>
                    </div>
                  )}
                  <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
                    Sebelum membawa setoran, konfirmasikan jadwal dan jenis material yang diterima kepada pengelola unit.
                  </p>
                  </section>
                )}
              </div>
              </div>
            </div>
          )}

          {/* ───────── ANALITIK ───────── */}
          {activeTab === 'analitik' && (
            <div className="space-y-5">
              <section aria-labelledby="chart-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                  <div>
                    <h2 id="chart-title" className="text-lg font-semibold text-slate-900">{metricMeta[metric].label} per bulan</h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Rata-rata {fmtNum(avgMetric)} {metricMeta[metric].unit} per bulan. Bulan terbaru berwarna hijau.
                    </p>
                  </div>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm w-fit" role="group" aria-label="Pilih metrik">
                    {(Object.keys(metricMeta) as Metric[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => setMetric(k)}
                        aria-pressed={metric === k}
                        className={`px-3 py-1.5 border-r last:border-r-0 border-slate-300 ${metric === k ? 'bg-emerald-700 text-white font-medium' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                      >
                        {metricMeta[k].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end gap-3 sm:gap-8 h-64 border-b border-slate-300">
                  {monthlyData.map((d, i) => {
                    const last = i === monthlyData.length - 1;
                    return (
                      <div key={d.month} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                        <span className="text-sm tabular-nums text-slate-800 font-medium">{fmtNum(d[metric])}</span>
                        <div className={`w-full max-w-14 rounded-t ${last ? 'bg-emerald-700' : 'bg-slate-300'}`} style={{ height: `${(d[metric] / maxMetric) * 78}%` }} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 sm:gap-8 pt-2">
                  {monthlyData.map((d) => (
                    <span key={d.month} className="flex-1 text-center text-sm text-slate-600">{d.month}</span>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <section aria-labelledby="komp-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                  <h2 id="komp-title" className="text-lg font-semibold text-slate-900">Komposisi material</h2>
                  <p className="text-sm text-slate-600 mt-0.5 mb-4">Persentase berat per kategori.</p>
                  <ul className="space-y-3">
                    {composition.map((c) => (
                      <li key={c.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-800">{c.label}</span>
                          <span className="tabular-nums font-medium text-slate-900">{c.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-emerald-700" style={{ width: `${c.pct}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="dampak-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                  <h2 id="dampak-title" className="text-lg font-semibold text-slate-900">Dampak lingkungan</h2>
                  <p className="text-sm text-slate-600 mt-0.5 mb-4">Akumulasi 2026, dikonversi ke satuan yang mudah dibayangkan.</p>
                  <dl className="divide-y divide-slate-100 border-y border-slate-200">
                    <div className="flex items-baseline justify-between py-3">
                      <dt className="text-sm text-slate-700">Setara serapan karbon</dt>
                      <dd className="text-xl font-semibold tabular-nums">890 pohon</dd>
                    </div>
                    <div className="flex items-baseline justify-between py-3">
                      <dt className="text-sm text-slate-700">Emisi kendaraan yang dihindari</dt>
                      <dd className="text-xl font-semibold tabular-nums">534 ribu km</dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
          )}

          {/* ───────── MASTER DATA ───────── */}
          {activeTab === 'masterdata' && (
            <section aria-labelledby="master-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
                <div>
                  <h2 id="master-title" className="text-lg font-semibold text-slate-900">Kategori sampah</h2>
                  <p className="text-sm text-slate-600 mt-0.5">Atur poin yang diterima nasabah dan faktor emisi untuk setiap kg.</p>
                </div>
                <button onClick={openAddForm} className={btnPrimary}>
                  <Icon name="plus" /> Tambah kategori
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/80">
                    <tr className="text-slate-600 border-b border-slate-200">
                      <th className="py-3 pr-4 font-medium">ID</th>
                      <th className="py-3 pr-4 font-medium">Nama</th>
                      <th className="py-3 pr-4 font-medium text-right">Poin per kg</th>
                      <th className="py-3 pr-4 font-medium text-right">CO₂ per kg</th>
                      <th className="py-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3.5 pr-4 text-slate-500 font-mono">{c.id}</td>
                        <td className="py-3.5 pr-4 font-medium text-slate-900">{c.nama}</td>
                        <td className="py-3.5 pr-4 text-right tabular-nums">{c.poinPerKg}</td>
                        <td className="py-3.5 pr-4 text-right tabular-nums">{c.emisiPerKg} kg</td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <button onClick={() => openEditForm(c)} className={`p-2 rounded-lg text-slate-600 hover:bg-slate-100 ${focusRing}`} aria-label={`Ubah ${c.nama}`} title="Ubah">
                            <Icon name="pencil" />
                          </button>
                          <button onClick={() => setDeleting(c)} className={`p-2 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 ${focusRing}`} aria-label={`Hapus ${c.nama}`} title="Hapus">
                            <Icon name="trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-500">
                          Belum ada kategori. Tambahkan kategori pertama agar nasabah bisa menyetor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Modal tambah/ubah kategori */}
      {formOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50" onMouseDown={(e) => e.target === e.currentTarget && setFormOpen(false)}>
          <form onSubmit={saveCategory} className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="form-title">
            <div className="flex items-start justify-between mb-5">
              <h2 id="form-title" className="text-lg font-semibold text-slate-900">{editing ? 'Ubah kategori' : 'Tambah kategori'}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 -mr-1.5 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Tutup">
                <Icon name="x" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="f-nama" className="block text-sm font-medium text-slate-800 mb-1.5">Nama kategori</label>
                <input id="f-nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputCls} placeholder="Contoh: Kertas HVS" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="f-poin" className="block text-sm font-medium text-slate-800 mb-1.5">Poin per kg</label>
                  <input id="f-poin" inputMode="numeric" value={form.poin} onChange={(e) => setForm({ ...form, poin: e.target.value })} className={inputCls} placeholder="50" />
                </div>
                <div>
                  <label htmlFor="f-emisi" className="block text-sm font-medium text-slate-800 mb-1.5">CO₂ per kg</label>
                  <input id="f-emisi" inputMode="decimal" value={form.emisi} onChange={(e) => setForm({ ...form, emisi: e.target.value })} className={inputCls} placeholder="1.5" />
                </div>
              </div>
              {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className={btnSecondary}>Batal</button>
              <button type="submit" className={btnPrimary}>{editing ? 'Simpan perubahan' : 'Tambah kategori'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Konfirmasi hapus */}
      {deleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50" onMouseDown={(e) => e.target === e.currentTarget && setDeleting(null)}>
          <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-xl" role="alertdialog" aria-modal="true" aria-labelledby="del-title">
            <h2 id="del-title" className="text-lg font-semibold text-slate-900">Hapus kategori {deleting.nama}?</h2>
            <p className="text-sm text-slate-600 mt-2">Kategori ini tidak akan muncul lagi di pilihan setoran. Tindakan ini tidak bisa dibatalkan.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setDeleting(null)} className={btnSecondary}>Batal</button>
              <button onClick={confirmDelete} className={`inline-flex items-center px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-medium ${focusRing}`}>
                Hapus kategori
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Nasabah */}
      {selectedNasabah && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
          onMouseDown={(e) => e.target === e.currentTarget && setSelectedNasabah(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl border border-slate-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nasabah-detail-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg border border-emerald-200">
                  {selectedNasabah.nama.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="nasabah-detail-title" className="text-lg font-bold text-slate-900">
                      {selectedNasabah.nama}
                    </h2>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        selectedNasabah.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {selectedNasabah.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {selectedNasabah.id} · Terdaftar {selectedNasabah.joinDate}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNasabah(null)}
                className="p-1.5 -mr-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Tutup"
              >
                <Icon name="x" />
              </button>
            </div>

            {/* Metric Overview */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block mb-0.5">Total Poin</span>
                <span className="text-xl font-bold text-emerald-700 tabular-nums">
                  {selectedNasabah.poin.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 block">pts</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block mb-0.5">Total Sampah</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {selectedNasabah.totalKg.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 block">kg terselamatkan</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block mb-0.5">Frekuensi</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {selectedNasabah.frekuensi}
                </span>
                <span className="text-[11px] text-slate-400 block">kali setoran</span>
              </div>
            </div>

            {/* Quick Points Adjustment */}
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-950">Insentif / Penyesuaian Poin</p>
                <p className="text-[11px] text-emerald-800">Tambahkan reward apresiasi untuk nasabah ini</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => addBonusPoints(selectedNasabah.id, 50)}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
                >
                  +50 pts
                </button>
                <button
                  type="button"
                  onClick={() => addBonusPoints(selectedNasabah.id, 100)}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
                >
                  +100 pts
                </button>
              </div>
            </div>

            {/* Info details */}
            <div className="space-y-2.5 text-sm py-1">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Level Keanggotaan</span>
                <span className="font-semibold text-slate-800 text-xs">{selectedNasabah.level}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Email</span>
                <span className="text-slate-800 font-mono text-xs">{selectedNasabah.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">No. Telepon / WhatsApp</span>
                <span className="text-slate-800 text-xs">{selectedNasabah.telepon}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Wilayah Domisili</span>
                <span className="text-slate-800 text-xs">{selectedNasabah.kecamatan}, Kota Banda Aceh</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 text-xs">Mitra Bank Sampah Utama</span>
                <span className="text-emerald-800 font-medium text-xs">{selectedNasabah.mitraFavorit}</span>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const newSt = selectedNasabah.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
                  updateNasabahStatus(selectedNasabah.id, newSt);
                }}
                className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                  selectedNasabah.status === 'Aktif'
                    ? 'border-red-200 text-red-700 hover:bg-red-50'
                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {selectedNasabah.status === 'Aktif' ? 'Tandai Nonaktif' : 'Aktifkan Kembali'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedNasabah;
                    setSelectedNasabah(null);
                    openEditNasabahForm(target);
                  }}
                  className={btnSecondary}
                >
                  <Icon name="pencil" className="w-3.5 h-3.5 mr-1.5" />
                  Ubah Data
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNasabah(null)}
                  className={btnPrimary}
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Ubah Nasabah */}
      {nasabahFormOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
          onMouseDown={(e) => e.target === e.currentTarget && setNasabahFormOpen(false)}
        >
          <form
            onSubmit={saveNasabah}
            className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl border border-slate-200 max-h-[92vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nasabah-form-title"
          >
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 id="nasabah-form-title" className="text-lg font-bold text-slate-900">
                  {nasabahEditing ? 'Ubah Data Nasabah' : 'Pendaftaran Nasabah Baru'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {nasabahEditing
                    ? `Perbarui profil dan preferensi ${nasabahEditing.nama} (${nasabahEditing.id})`
                    : 'Tambahkan data warga yang ingin bergabung ke program daur ulang EcoBank'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNasabahFormOpen(false)}
                className="p-1.5 -mr-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Tutup"
              >
                <Icon name="x" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label htmlFor="nf-nama" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Nasabah <span className="text-red-500">*</span>
                </label>
                <input
                  id="nf-nama"
                  type="text"
                  required
                  value={nasabahForm.nama}
                  onChange={(e) => setNasabahForm({ ...nasabahForm, nama: e.target.value })}
                  className={inputCls}
                  placeholder="Contoh: Cut Mutia"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nf-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nf-email"
                    type="email"
                    required
                    value={nasabahForm.email}
                    onChange={(e) => setNasabahForm({ ...nasabahForm, email: e.target.value })}
                    className={inputCls}
                    placeholder="nama@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="nf-tel" className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    id="nf-tel"
                    type="tel"
                    value={nasabahForm.telepon}
                    onChange={(e) => setNasabahForm({ ...nasabahForm, telepon: e.target.value })}
                    className={inputCls}
                    placeholder="0812-3456-7890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nf-kecamatan" className="block text-xs font-semibold text-slate-700 mb-1">
                    Kecamatan Domisili (Banda Aceh)
                  </label>
                  <select
                    id="nf-kecamatan"
                    value={nasabahForm.kecamatan}
                    onChange={(e) => setNasabahForm({ ...nasabahForm, kecamatan: e.target.value })}
                    className={inputCls}
                  >
                    <option value="Kec. Syiah Kuala">Kec. Syiah Kuala</option>
                    <option value="Kec. Ulee Kareng">Kec. Ulee Kareng</option>
                    <option value="Kec. Meuraxa">Kec. Meuraxa</option>
                    <option value="Kec. Baiturrahman">Kec. Baiturrahman</option>
                    <option value="Kec. Kuta Alam">Kec. Kuta Alam</option>
                    <option value="Kec. Lueng Bata">Kec. Lueng Bata</option>
                    <option value="Kec. Jaya Baru">Kec. Jaya Baru</option>
                    <option value="Kec. Banda Raya">Kec. Banda Raya</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="nf-level" className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Keanggotaan
                  </label>
                  <select
                    id="nf-level"
                    value={nasabahForm.level}
                    onChange={(e) => setNasabahForm({ ...nasabahForm, level: e.target.value })}
                    className={inputCls}
                  >
                    <option value="Level 1 · Eco Starter">Level 1 · Eco Starter (0 - 499 pts)</option>
                    <option value="Level 2 · Green Pioneer">Level 2 · Green Pioneer (500 - 1.499 pts)</option>
                    <option value="Level 3 · Planet Guardian">Level 3 · Planet Guardian (1.500+ pts)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nf-poin" className="block text-xs font-semibold text-slate-700 mb-1">
                    Saldo Poin {nasabahEditing ? 'Saat Ini' : 'Awal'}
                  </label>
                  <input
                    id="nf-poin"
                    type="number"
                    min="0"
                    value={nasabahForm.poin}
                    onChange={(e) => setNasabahForm({ ...nasabahForm, poin: e.target.value })}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="nf-mitra" className="block text-xs font-semibold text-slate-700 mb-1">
                    Mitra Bank Sampah Terdekat
                  </label>
                  <select
                    id="nf-mitra"
                    value={nasabahForm.mitraFavorit}
                    onChange={(e) => setNasabahForm({ ...nasabahForm, mitraFavorit: e.target.value })}
                    className={inputCls}
                  >
                    {nasabahForm.mitraFavorit && !mitra.some((m) => m.name === nasabahForm.mitraFavorit) && (
                      <option value={nasabahForm.mitraFavorit}>{nasabahForm.mitraFavorit} (data tersimpan)</option>
                    )}
                    {mitra.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {nasabahFormError && (
                <div role="alert" className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {nasabahFormError}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setNasabahFormOpen(false)} className={btnSecondary}>
                Batal
              </button>
              <button type="submit" className={btnPrimary}>
                {nasabahEditing ? 'Simpan Perubahan' : 'Daftarkan Nasabah'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg max-w-[90vw]">
          {toast}
        </div>
      )}
    </div>
  );
}