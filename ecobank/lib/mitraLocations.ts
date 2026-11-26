export interface MitraLocation {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  openingHours: string[];
  latitude: number;
  longitude: number;
}

export const mitraLocations: MitraLocation[] = [
  {
    id: 'MTR-ACEH-001',
    name: 'Bank Sampah Induk Sadar Mandiri',
    district: 'Kota Banda Aceh',
    address: 'Dusun Pantereik, Desa Jawa, Kuta Raja, Kota Banda Aceh, Aceh 23128',
    phone: '0813-6027-4339',
    latitude: 5.569699,
    longitude: 95.318004,
    openingHours: [
      'Senin–Kamis: 09.00–17.00',
      'Jumat: 09.00–11.00',
      'Sabtu: 09.00–12.00',
      'Minggu: Tutup',
    ],
  },
  {
    id: 'MTR-ACEH-002',
    name: 'Bank Sampah USK',
    district: 'Kota Banda Aceh',
    address: 'Belakang OIA Unsyiah, Jl. Tgk. Syech Abdul Rauf, Kopelma Darussalam, Syiah Kuala, Kota Banda Aceh, Aceh 24415',
    phone: '0823-4098-0991',
    latitude: 5.567306,
    longitude: 95.366972,
    openingHours: [
      'Senin–Kamis dan Sabtu: 08.30–12.30',
      'Jumat: 08.30–11.30',
      'Minggu: Tutup',
    ],
  },
  {
    id: 'MTR-ACEH-003',
    name: 'Bank Sampah Induk Asan Berseri',
    district: 'Kabupaten Aceh Besar',
    address: 'Meunasah Bak Trieng, Kuta Baro, Kabupaten Aceh Besar, Aceh 24415',
    phone: 'Belum Tersedia',
    latitude: 5.536083,
    longitude: 95.388917,
    openingHours: ['Belum Tersedia'],
  },
  {
    id: 'MTR-ACEH-004',
    name: 'Bank Sampah Blang Krueng',
    district: 'Kabupaten Aceh Besar',
    address: 'Blang Krueng, Baitussalam, Kabupaten Aceh Besar, Aceh',
    phone: 'Belum Tersedia',
    latitude: 5.583278,
    longitude: 95.375667,
    openingHours: ['Sabtu: 09.00–12.00', 'Minggu–Jumat: Tutup'],
  },
  {
    id: 'MTR-ACEH-005',
    name: 'Bank Sampah Dolah Recycle',
    district: 'Kabupaten Aceh Barat',
    address: 'Meureubo, Kecamatan Meureubo, Kabupaten Aceh Barat, Aceh 23681',
    phone: 'Belum Tersedia',
    latitude: 4.143778,
    longitude: 96.158278,
    openingHours: ['Belum Tersedia'],
  },
];

export function getGoogleMapsSearchUrl(location: MitraLocation): string {
  const query = `${location.name}, ${location.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getGoogleMapsDirectionsUrl(location: MitraLocation): string {
  const destination = `${location.name}, ${location.address}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function getGoogleMapsEmbedUrl(location: MitraLocation | null): string {
  const query = location ? `${location.name}, ${location.address}` : 'Aceh';
  const zoom = location ? 15 : 7;
  const center = location ? `&ll=${location.latitude},${location.longitude}` : '';
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=id&z=${zoom}${center}&output=embed`;
}

