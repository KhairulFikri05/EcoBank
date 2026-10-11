"use client";

import { useState } from 'react';
import TransactionHistory from '@/components/TransactionHistory';
import DashboardImpact from '@/components/DashboardImpact';
import { useWaste } from '@/hooks/useWaste';
import ItemCard from '@/components/ItemCard';
import { CalculatorContext, StandardCalculationStrategy } from '@/lib/wasteStrategy';

type Transaction = {
  type: string;
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
  name: string;
  poinPerKg: number;
  emisiPerKg: number;
  [key: string]: unknown;
};

type DropoffPayload = {
  wasteType?: string;
  weight?: number;
  totalPoin: number;
  totalEmisi: number;
};

type SaveDropoffHandler = (calculatedData: DropoffPayload) => Promise<void> | void;

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { type: 'Setor', description: 'Botol Plastik (2kg)', amount: 100, date: '12 Okt 2026' },
    { type: 'Tukar', description: 'Voucher e-Wallet', amount: 50, date: '10 Okt 2026' }
  ]);

  const [impact, setImpact] = useState<Impact>({
    totalKg: 7,
    totalPoin: 150,
    totalEmisi: 3.8
  });

  const handleSaveDropoff = async (calculatedData: DropoffPayload) => {
    try {
      const res = await fetch('/api/dropoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-demo-123',
          wasteType: calculatedData.wasteType || 'campuran',
          weight: calculatedData.weight || 2,
          totalPoin: calculatedData.totalPoin,
          totalEmisi: calculatedData.totalEmisi
        })
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Berhasil! Tiket tersimpan: ${result.data.ticketId} (+${calculatedData.totalPoin} Poin)`);

        setTransactions(prev => [
          { type: 'Setor', description: `Setoran Sampah (${result.data.ticketId})`, amount: calculatedData.totalPoin, date: 'Baru saja' },
          ...prev
        ]);

        setImpact(prev => ({
          totalKg: prev.totalKg + (calculatedData.weight || 2),
          totalPoin: prev.totalPoin + calculatedData.totalPoin,
          totalEmisi: Number((prev.totalEmisi + calculatedData.totalEmisi).toFixed(2))
        }));
      } else {
        alert('Gagal menyimpan ke API.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi ke API backend.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-green-700">EcoBank - Dashboard Anggota A</h1>
            <p className="text-sm text-gray-500">Demo Integrasi Fitur 1, 2, 3, 4 & Backend API</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            Local Preview Mode
          </span>
        </header>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Ringkasan Dampak Lingkungan</h2>
          <DashboardImpact totalKg={impact.totalKg} totalPoin={impact.totalPoin} totalEmisi={impact.totalEmisi} />
        </section>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Kalkulator & Setor Sampah</h2>
            <InteractiveCalculatorSimulator onSave={handleSaveDropoff} />
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <TransactionHistory transactions={transactions as any} />
          </section>
        </div>
      </div>
    </main>
  );
}

function InteractiveCalculatorSimulator({ onSave }: { onSave: SaveDropoffHandler }) {
  const { wasteTypes = [] as WasteItem[] } = useWaste() as { wasteTypes?: WasteItem[] };
  const [weights, setWeights] = useState<Record<string, number>>({});

  const handleWeightChange = (id: string, weight: number) => {
    setWeights(prev => ({ ...prev, [id]: weight }));
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

  const handleTriggerSave = () => {
    if (totals.totalPoin > 0) {
      const totalWeight = Object.values(weights).reduce<number>((sum, value) => sum + Number(value || 0), 0);

      onSave({
        totalPoin: totals.totalPoin,
        totalEmisi: Number(totals.totalEmisi.toFixed(2)),
        weight: totalWeight
      });

      setWeights({});
    }
  };

  return (
    <div>
      <div className="space-y-2 mb-4">
        {wasteTypes.map((item: WasteItem) => (
          <ItemCard
            key={item.id}
            item={item}
            weight={weights[item.id] ?? 0}
            onWeightChange={handleWeightChange}
          />
        ))}
      </div>

      <div className="bg-green-50 p-4 rounded-xl mb-4 border border-green-100 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-medium">Estimasi Didapat:</p>
          <p className="font-bold text-green-700 text-lg">{totals.totalPoin} Poin</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium">Emisi Dicegah:</p>
          <p className="font-bold text-blue-600 text-sm">{totals.totalEmisi.toFixed(2)} kg CO₂</p>
        </div>
      </div>

      <button
        onClick={handleTriggerSave}
        disabled={totals.totalPoin === 0}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
      >
        Simpan Setoran ke Backend API
      </button>
    </div>
  );
}
