import { useState, useEffect } from 'react';
// Path import sudah disesuaikan ke folder content yang baru
import wasteData from '@/content/wasteTypes.json';

export function useWaste() {
  const [wasteTypes, setWasteTypes] = useState([]);

  useEffect(() => {
    // Memuat data dari JSON lokal ke dalam state React
    setWasteTypes(wasteData);
  }, []);

  return { wasteTypes };
}