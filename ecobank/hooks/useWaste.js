import { useState, useEffect } from 'react';
// Sesuaikan path import dengan struktur folder Anda jika menggunakan src/ atau langsung di root
import wasteData from '@/data/wasteTypes.json';

export function useWaste() {
  const [wasteTypes, setWasteTypes] = useState([]);

  useEffect(() => {
    // Memuat data dari JSON lokal ke dalam state React
    setWasteTypes(wasteData);
  }, []);

  return { wasteTypes };
}