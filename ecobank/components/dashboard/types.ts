export type TabId = 'beranda' | 'setor' | 'riwayat' | 'edukasi' | 'profil';

export type Transaction = {
  id: string;
  trxCode?: string;
  type: 'Setor' | 'Tukar';
  description: string;
  amount: number;
  date: string;
  monthGroup?: string;
  dropPoint?: string;
  status?: 'Terverifikasi' | 'Menunggu' | 'Berhasil' | 'Ditolak';
  photoUrl?: string | null;
  emisi?: number;
  weight?: number;
  wasteDetail?: string;
};

export type Impact = {
  totalKg: number;
  totalPoin: number;
  totalEmisi: number;
};

export type WasteItem = {
  id: string;
  uuid?: string;
  slug?: string;
  nama?: string;
  name?: string;
  poinPerKg: number;
  emisiPerKg: number;
};

export type DropPointOption = {
  id: string;
  mitraCode?: string;
  name: string;
  district?: string;
  address: string;
  phone?: string;
  distance?: string;
  hours: string;
  status: string;
  latitude?: number;
  longitude?: number;
};

export type DropoffPayload = {
  wasteType?: string;
  wasteCategoryId?: string;
  wasteDetail?: string;
  weight?: number;
  totalPoin: number;
  totalEmisi: number;
  dropPoint?: string;
  dropPointId?: string;
  photoUrl?: string | null;
  photoFile?: File | null;
  notes?: string;
};

export type RewardItem = {
  id: string;
  uuid?: string;
  title: string;
  category: string;
  points: number;
  provider: string;
  iconBg: string;
};

export type EducationArticleItem = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  coverImage: string;
};

export type UserProfile = {
  id?: string;
  nama: string;
  email: string;
  phone: string;
  address: string;
  district?: string;
  joinDate: string;
  level: string;
  idNasabah: string;
  dropPointFavorit: string;
  preferredDropPointId?: string;
  payoutMethod?: 'GoPay' | 'DANA' | 'Rekening Bank';
  payoutAccount?: string;
  notifVerification?: boolean;
  notifPickup?: boolean;
  lastLoginAt?: string;
  role?: string;
  avatarInitial: string;
};

export const nearbyDropPoints = [
  { id: 'dp-1', name: 'Bank Sampah Syiah Kuala', distance: '0.8 km', hours: '08:00 - 16:00', status: 'Buka Sekarang', address: 'Jl. Teuku Nyak Arief No. 42' },
  { id: 'dp-2', name: 'Bank Sampah Ulee Kareng', distance: '1.6 km', hours: '09:00 - 17:00', status: 'Buka Sekarang', address: 'Jl. Lamreung No. 18' },
];
