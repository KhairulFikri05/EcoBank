"use client";
import { useState } from 'react';
import { useWaste } from '@/hooks/useWaste';
import ItemCard from './ItemCard';
import { CalculatorContext, StandardCalculationStrategy } from '@/lib/wasteStrategy';
// import { usePoints } from '@/hooks/usePoints'; // Akan di-uncomment setelah hook ini dibuat Anggota B

export default function WasteCalculator() {
  const { wasteTypes } = useWaste();
  // const { addPoints } = usePoints(); // Ketergantungan dengan tugas B
  const [weights, setWeights] = useState({});

  const handleWeightChange = (id, weight) => {
    setWeights(prev => ({ ...prev, [id]: weight }));
  };

  const calculateTotal = () => {
    let totalPoin = 0;
    let totalEmisi = 0;
    const calc = new CalculatorContext(new StandardCalculationStrategy());
    
    wasteTypes.forEach(item => {
      const w = weights[item.id] || 0;
      if (w > 0) {
        totalPoin += calc.execute(w, item.poinPerKg);
        totalEmisi += calc.execute(w, item.emisiPerKg);
      }
    });
    return { totalPoin, totalEmisi };
  };

  const totals = calculateTotal();

  const handleSimpanSetoran = () => {
    if (totals.totalPoin > 0) {
      // addPoints(totals.totalPoin, 'Setor Sampah'); 
      alert(`Berhasil menyimpan setoran! +${totals.totalPoin} Poin akan ditambahkan.`);
      setWeights({}); // Reset form setelah simpan
    }
  };

  return (
    <div className="max-w-md mx-auto border p-4 rounded-lg shadow-sm bg-white mt-4">
      <h2 className="font-bold text-xl mb-4">Kalkulator Sampah</h2>
      
      <div className="mb-4 border-t">
        {wasteTypes.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            weight={weights[item.id]} 
            onWeightChange={handleWeightChange} 
          />
        ))}
      </div>

      <div className="bg-green-50 p-4 rounded-md mb-4">
        <p className="font-bold text-green-700">Total Poin: {totals.totalPoin}</p>
        <p className="text-sm text-gray-600">Emisi Dicegah: {totals.totalEmisi.toFixed(2)} kg CO2</p>
      </div>
      
      {/* Tombol Fitur 3 */}
      <button 
        onClick={handleSimpanSetoran}
        disabled={totals.totalPoin === 0}
        className="w-full bg-green-600 text-white px-4 py-2 rounded font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Simpan Setoran
      </button>
    </div>
  );
}