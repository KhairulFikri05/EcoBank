import { useState, useEffect } from 'react';
import wasteData from '@/data/wasteTypes.json';

export function useWaste() {
  const [wasteTypes, setWasteTypes] = useState([]);

  useEffect(() => {
    setWasteTypes(wasteData);
  }, []);

  return { wasteTypes };
}