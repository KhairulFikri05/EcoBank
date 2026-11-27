"use client";

import { useState, useMemo } from 'react';
import { UserProfile, Impact } from './types';
import { MitraLocation } from '@/lib/mitraLocations';

/* ─── Inline SVG Icons ─────────────────────────────────────────────── */
function IconCopy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function IconMaximize({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );
}

function IconKey({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function IconDownload({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function IconUser({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IconMail({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconPhone({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function IconMapPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconHome2({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconEdit({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

function IconCard({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  );
}

/* ─── Deterministic Inline SVG QR Code ─────────────────────────────── */
function MemberQRCode({ value, size = 136 }: { value: string; size?: number }) {
  const modules = useMemo(() => {
    const gridSize = 21;
    const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    const drawFinder = (startR: number, startC: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[startR + r][startC + c] = isBorder || isCenter;
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, gridSize - 7);
    drawFinder(gridSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Deterministic data modules seeded by member ID
    let seed = 0;
    for (let i = 0; i < value.length; i++) {
      seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    }

    const isReserved = (r: number, c: number) => {
      const topLeft = r < 8 && c < 8;
      const topRight = r < 8 && c >= gridSize - 8;
      const bottomLeft = r >= gridSize - 8 && c < 8;
      const timing = r === 6 || c === 6;
      return topLeft || topRight || bottomLeft || timing;
    };

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!isReserved(r, c)) {
          seed = (seed * 1664525 + 1013904223) >>> 0;
          matrix[r][c] = (seed & 1) === 1;
        }
      }
    }

    return matrix;
  }, [value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      shapeRendering="crispEdges"
      aria-label={`QR Code ${value}`}
      className="block"
    >
      <rect width="21" height="21" fill="#ffffff" />
      {modules.map((row, r) =>
        row.map((filled, c) =>
          filled ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" /> : null
        )
      )}
    </svg>
  );
}

/* ─── Toggle Component ─────────────────────────────────────────────── */
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-emerald-600' : 'bg-slate-200'
      }`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ─── QR Modal Component ───────────────────────────────────────────── */
function QRModal({ idNasabah, nama, onClose }: { idNasabah: string; nama: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-7 shadow-2xl flex flex-col items-center gap-4 max-w-xs w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-sm font-bold text-slate-900">Kartu Anggota Digital</span>
            <p className="text-[11px] text-slate-400">{nama}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            aria-label="Tutup QR"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 bg-white border-2 border-emerald-100 rounded-2xl shadow-inner">
          <MemberQRCode value={idNasabah} size={200} />
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-slate-900 tracking-widest">{idNasabah}</p>
          <p className="text-xs text-emerald-700 font-semibold mt-0.5">Member Pass EcoBank</p>
        </div>
        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Tunjukkan kode QR ini ke petugas Drop Point untuk mempercepat proses pencatatan setoran.
        </p>
      </div>
    </div>
  );
}

/* ─── Password Modal Component ─────────────────────────────────────── */
function PasswordModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Ubah Kata Sandi</h4>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>
          )}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Kata Sandi Saat Ini</label>
            <input
              type="password"
              required
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Konfirmasi Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              Simpan Sandi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Read-only Field Row ──────────────────────────────────────────── */
function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-slate-400 leading-none mb-1">{label}</p>
        <p className="text-xs font-bold text-slate-900 leading-snug">{value}</p>
      </div>
    </div>
  );
}

/* ─── Main ProfilSection Component ────────────────────────────────── */
interface ProfilSectionProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  impact: Impact;
  mitraLocations: MitraLocation[];
  profileSuccessMsg: string;
  onSaveProfile: (updated: UserProfile) => void;
}

const PAYOUT_METHODS = [
  { id: 'gopay', name: 'GoPay', detail: '0812-3456-7890', badgeBg: '#0ea5e9' },
  { id: 'dana', name: 'DANA', detail: '0812-3456-7890', badgeBg: '#0284c7' },
  { id: 'bank', name: 'Rekening Bank', detail: 'BSI · 7148290123', badgeBg: '#0f766e' },
] as const;

export function ProfilSection({
  userProfile,
  setUserProfile,
  impact,
  mitraLocations,
  profileSuccessMsg,
  onSaveProfile,
}: ProfilSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(userProfile);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [localToast, setLocalToast] = useState('');

  // Preferensi pencairan & notifikasi
  const [selectedMethod, setSelectedMethod] = useState<'gopay' | 'dana' | 'bank'>('gopay');
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const [notifVerifikasi, setNotifVerifikasi] = useState(true);
  const [notifJemput, setNotifJemput] = useState(true);

  const levelThreshold = 15;
  const levelProgress = Math.min((impact.totalKg / levelThreshold) * 100, 100);
  const activePayout = PAYOUT_METHODS.find((m) => m.id === selectedMethod) || PAYOUT_METHODS[0];

  const showToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(''), 3500);
  };

  function handleCopyId() {
    navigator.clipboard.writeText(userProfile.idNasabah).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleEditStart() {
    setDraft({ ...userProfile });
    setIsEditing(true);
  }

  function handleEditCancel() {
    setIsEditing(false);
  }

  function handleEditSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const updated: UserProfile = {
      ...draft,
      avatarInitial: draft.nama.trim() ? draft.nama.trim()[0].toUpperCase() : 'U',
    };
    setUserProfile(updated);
    onSaveProfile(updated);
    setIsEditing(false);
  }

  function handleDownloadReport() {
    const csvContent = [
      'Rekap Dampak Lingkungan EcoBank',
      `Nama Nasabah,${userProfile.nama}`,
      `ID Nasabah,${userProfile.idNasabah}`,
      `Level,${userProfile.level}`,
      `Total Sampah Disetor,${impact.totalKg} kg`,
      `Saldo Poin Aktif,${impact.totalPoin} Pts`,
      `Total Emisi Dicegah,${impact.totalEmisi} kg CO2`,
      `Mitra Drop Point Utama,${userProfile.dropPointFavorit}`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekap-Dampak-${userProfile.idNasabah}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Rekap laporan dampak berhasil diunduh.');
  }

  const bannerMsg = profileSuccessMsg || localToast;

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {bannerMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <IconCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ROW 1 — 2:1 Grid: Kartu Identitas & Dampak | Kartu Anggota Digital
      ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">

        {/* Left (2 cols): Green Identity & Level Card */}
        <div
          className="lg:col-span-2 rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden shadow-lg flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, #104929 0%, #165b34 55%, #1f7746 100%)' }}
        >
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Avatar + Name + Badge */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-300 text-slate-900 flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white/30 flex-shrink-0">
                {userProfile.avatarInitial}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-white leading-tight truncate">{userProfile.nama}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400/20 text-emerald-100 border border-emerald-300/30">
                    <IconShield className="w-3 h-3" />
                    Nasabah Terverifikasi
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80">
                  ID Nasabah: <strong className="text-white">{userProfile.idNasabah}</strong> · Bergabung sejak {userProfile.joinDate}
                </p>
              </div>
            </div>

            {/* Level Progress (Pencapaian terintegrasi di sini) */}
            <div className="space-y-2">
              <div>
                <p className="text-sm font-bold text-white">{userProfile.level}</p>
                <p className="text-[11px] text-emerald-100/75 mt-0.5">
                  ({impact.totalKg} / {levelThreshold} kg menuju Level 3 · Eco Guardian)
                </p>
              </div>
              <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-300 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {/* 3 Impact Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10 text-center">
              <div className="py-1">
                <p className="text-[11px] text-emerald-100/75 mb-0.5">Total Sampah</p>
                <p className="text-lg font-extrabold text-white">{impact.totalKg} kg</p>
              </div>
              <div className="py-1">
                <p className="text-[11px] text-emerald-100/75 mb-0.5">Saldo Poin</p>
                <p className="text-lg font-extrabold text-amber-300">{impact.totalPoin} Pts</p>
              </div>
              <div className="py-1">
                <p className="text-[11px] text-emerald-100/75 mb-0.5">CO₂ Dicegah</p>
                <p className="text-lg font-extrabold text-white">{impact.totalEmisi} kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right (1 col): Kartu Anggota Digital & QR Code */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-emerald-950/10 shadow-xs flex flex-col items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full">
            <IconCard className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-900">Kartu Anggota Digital</span>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col items-center gap-2">
            <MemberQRCode value={userProfile.idNasabah} size={116} />
            <span className="text-xs font-extrabold text-slate-900 tracking-wider">{userProfile.idNasabah}</span>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Scan di Drop Point untuk setoran cepat
          </p>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> : <IconCopy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Tersalin' : 'Salin ID'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <IconMaximize className="w-3.5 h-3.5 text-slate-500" />
              <span>Perbesar QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ROW 2 — 2:1 Grid: Informasi Pribadi & Kontak (Left) |
                   Preferensi Pencairan + Keamanan & Laporan (Right Stack)
      ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* Left (2 cols): Informasi Pribadi & Kontak (Read-only by default) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-950/10 shadow-xs">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Informasi Pribadi &amp; Kontak</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Data profil resmi nasabah EcoBank</p>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={handleEditStart}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex-shrink-0"
              >
                <IconEdit className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Profil</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSave} className="space-y-3.5 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={draft.nama}
                    onChange={(e) => setDraft({ ...draft, nama: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Nomor Handphone</label>
                  <input
                    type="text"
                    required
                    value={draft.phone}
                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Mitra Drop Point Utama</label>
                  <select
                    value={draft.dropPointFavorit}
                    onChange={(e) => setDraft({ ...draft, dropPointFavorit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {!mitraLocations.some((l) => l.name === draft.dropPointFavorit) && (
                      <option value={draft.dropPointFavorit}>{draft.dropPointFavorit} (tersimpan)</option>
                    )}
                    {mitraLocations.map((l) => (
                      <option key={l.id} value={l.name}>
                        {l.name} — {l.district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Alamat Penjemputan</label>
                <textarea
                  rows={2}
                  value={draft.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                >
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-1">
              <ProfileField icon={<IconUser className="w-4 h-4" />} label="Nama Lengkap" value={userProfile.nama} />
              <ProfileField icon={<IconMail className="w-4 h-4" />} label="Alamat Email" value={userProfile.email} />
              <ProfileField icon={<IconPhone className="w-4 h-4" />} label="Nomor Handphone" value={userProfile.phone} />
              <ProfileField
                icon={<IconMapPin className="w-4 h-4" />}
                label="Mitra Drop Point Utama"
                value={`${userProfile.dropPointFavorit} — Kota Banda Aceh`}
              />
              <ProfileField icon={<IconHome2 className="w-4 h-4" />} label="Alamat Penjemputan" value={userProfile.address} />
            </div>
          )}
        </div>

        {/* Right (1 col): Stacked Preferensi Pencairan & Notifikasi + Keamanan & Laporan */}
        <div className="lg:col-span-1 space-y-5">

          {/* Card 1: Preferensi Pencairan & Notifikasi */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-950/10 shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Preferensi Pencairan &amp; Notifikasi</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Metode &amp; Pengingat Layanan</p>
            </div>

            {/* Metode Utama row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600">Metode Utama</span>
                <button
                  type="button"
                  onClick={() => setShowMethodPicker((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors"
                  title="Klik untuk ganti metode pencairan favorit"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: activePayout.badgeBg }}
                  />
                  <span className="text-[11px] font-bold text-slate-800">
                    {activePayout.name} · {activePayout.detail}
                  </span>
                </button>
              </div>

              {showMethodPicker && (
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {PAYOUT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(m.id);
                        setShowMethodPicker(false);
                        showToast(`Metode pencairan utama diubah ke ${m.name}.`);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-colors ${
                        selectedMethod === m.id
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-700">Notifikasi Verifikasi Setoran</span>
                <Toggle
                  checked={notifVerifikasi}
                  onChange={() => setNotifVerifikasi((v) => !v)}
                  label="Notifikasi Verifikasi Setoran"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-700">Pengingat Jadwal Jemput</span>
                <Toggle
                  checked={notifJemput}
                  onChange={() => setNotifJemput((v) => !v)}
                  label="Pengingat Jadwal Jemput"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Keamanan & Laporan */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-950/10 shadow-xs space-y-3.5">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Keamanan &amp; Laporan</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Akses akun &amp; rekap aktivitas</p>
            </div>

            <div className="flex items-center justify-between text-[11px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Login Terakhir</span>
              <span className="font-bold text-slate-800">Hari ini, 17.30 WIB</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowPassModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <IconKey className="w-3.5 h-3.5 text-slate-500" />
                <span>Ubah Kata Sandi</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadReport}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #165b34, #1f7746)' }}
              >
                <IconDownload className="w-3.5 h-3.5" />
                <span>Unduh Rekap Dampak (CSV)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQRModal && (
        <QRModal idNasabah={userProfile.idNasabah} nama={userProfile.nama} onClose={() => setShowQRModal(false)} />
      )}
      {showPassModal && (
        <PasswordModal
          onClose={() => setShowPassModal(false)}
          onSaved={() => showToast('Kata sandi akun berhasil diperbarui.')}
        />
      )}
    </div>
  );
}
