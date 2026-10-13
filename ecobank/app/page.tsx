"use client";

import { useState } from 'react';
import { useWaste } from '@/hooks/useWaste';
import { CalculatorContext, StandardCalculationStrategy } from '@/lib/wasteStrategy';

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

export default function Home() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'setor' | 'riwayat'>('beranda');

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'Setor', description: 'Botol Plastik (2.0 kg)', amount: 100, date: '12 Okt 2026' },
    { id: '2', type: 'Tukar', description: 'Voucher e-Wallet GoPay', amount: -50, date: '10 Okt 2026' },
    { id: '3', type: 'Setor', description: 'Kardus & Kertas Bekas (5.0 kg)', amount: 150, date: '08 Okt 2026' },
  ]);

  const [impact, setImpact] = useState<Impact>({
    totalKg: 7.0,
    totalPoin: 200,
    totalEmisi: 3.8
  });

  const handleSaveDropoff = async (calculatedData: DropoffPayload) => {
    try {
      const res = await fetch('/api/dropoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-demo-123',
          wasteType: calculatedData.wasteType || 'sampah-campuran',
          weight: calculatedData.weight || 1,
          totalPoin: calculatedData.totalPoin,
          totalEmisi: calculatedData.totalEmisi
        })
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Berhasil! Tiket setoran tersimpan: ${result.data?.ticketId || 'DROP-OK'} (+${calculatedData.totalPoin} Poin)`);

        const newTx: Transaction = {
          id: Date.now().toString(),
          type: 'Setor',
          description: `Setoran Sampah (${result.data?.ticketId || 'DROP-NEW'})`,
          amount: calculatedData.totalPoin,
          date: 'Hari ini'
        };

        setTransactions(prev => [newTx, ...prev]);

        setImpact(prev => ({
          totalKg: Number((prev.totalKg + (calculatedData.weight || 0)).toFixed(1)),
          totalPoin: prev.totalPoin + calculatedData.totalPoin,
          totalEmisi: Number((prev.totalEmisi + calculatedData.totalEmisi).toFixed(2))
        }));
      } else {
        alert('Gagal menyimpan setoran ke sistem.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi ke server API.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased">
      {/* Sidebar Navigasi Utama */}
      <aside className="w-64 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-emerald-200">
              🌱
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">EcoBank</h1>
              <p className="text-xs text-slate-400 font-medium">Bank Sampah Digital</p>
            </div>
          </div>

          {/* Menu Navigasi Nasabah */}
          <nav className="space-y-1">
            <NavItem
              label="Beranda"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
              active={activeTab === 'beranda'}
              onClick={() => setActiveTab('beranda')}
            />
            <NavItem
              label="Setor Sampah"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
              active={activeTab === 'setor'}
              onClick={() => setActiveTab('setor')}
            />
            <NavItem
              label="Riwayat Transaksi"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              active={activeTab === 'riwayat'}
              onClick={() => setActiveTab('riwayat')}
            />
          </nav>
        </div>

        {/* Tautan Ke Portal Admin */}
        <div className="space-y-3">
          <a
            href="/admin"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 transition-all text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <span>🔒</span> Portal Admin
            </span>
            <span>↗</span>
          </a>

          <div className="p-3 bg-slate-100/70 rounded-xl flex items-center gap-3 border border-slate-200/50">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              U
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate">Pengguna EcoBank</p>
              <p className="text-[10px] text-slate-500 truncate">ID Kemitraan: #123</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'beranda' && 'Ringkasan Layanan'}
              {activeTab === 'setor' && 'Kalkulator & Setor Sampah'}
              {activeTab === 'riwayat' && 'Riwayat Aktivitas'}
            </h2>
            <p className="text-xs text-slate-500">Sistem Pengelolaan Sampah & Perhitungan Poin Kebersihan</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Aktif
            </span>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-8 max-w-6xl w-full mx-auto">
          {activeTab === 'beranda' && (
            <div className="space-y-8">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <MetricCard title="Total Sampah Terkumpul" value={`${impact.totalKg} kg`} subtext="Kontribusi Kebersihan" icon="⚖️" accent="border-emerald-500" />
                <MetricCard title="Total Poin Beredar" value={`${impact.totalPoin} Poin`} subtext="Saldo Reward Aktif" icon="🪙" accent="border-amber-500" />
                <MetricCard title="Total Emisi Dicegah" value={`${impact.totalEmisi} kg CO₂`} subtext="Dampak Lingkungan" icon="🌱" accent="border-blue-500" />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-base mb-1">Setor Sampah Baru</h3>
                  <p className="text-xs text-slate-500 mb-6">Hitung estimasi poin dan emisi secara langsung</p>
                  <CalculatorSection onSave={handleSaveDropoff} />
                </div>

                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-base mb-1">Riwayat Transaksi</h3>
                  <p className="text-xs text-slate-500 mb-6">Aktivitas penukaran dan setoran terakhir</p>
                  <TransactionList transactions={transactions} limit={4} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'setor' && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-slate-800 text-lg mb-1">Kalkulator Setor Sampah</h3>
              <p className="text-xs text-slate-500 mb-6">Pilih jenis sampah dan masukkan beratnya untuk menghitung perolehan poin.</p>
              <CalculatorSection onSave={handleSaveDropoff} />
            </div>
          )}

          {activeTab === 'riwayat' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-slate-800 text-lg mb-1">Seluruh Riwayat Transaksi</h3>
              <p className="text-xs text-slate-500 mb-6">Daftar lengkap transaksi setoran dan penukaran poin.</p>
              <TransactionList transactions={transactions} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
        active ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={active ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}

function MetricCard({ title, value, subtext, icon, accent }: { title: string; value: string; subtext: string; icon: string; accent: string }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm border-t-4 ${accent}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</h4>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtext}</p>
        </div>
        <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-100">{icon}</span>
      </div>
    </div>
  );
}

function CalculatorSection({ onSave }: { onSave: (payload: DropoffPayload) => void }) {
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
      const totalWeight = Object.values(weights).reduce<number>((sum, val) => sum + Number(val || 0), 0);
      onSave({
        totalPoin: totals.totalPoin,
        totalEmisi: Number(totals.totalEmisi.toFixed(2)),
        weight: totalWeight
      });
      setWeights({});
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {wasteTypes.map((item: WasteItem) => (
          <div key={item.id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-base">
                {item.id === 'plastik' ? '🧴' : item.id === 'kertas' ? '📦' : item.id === 'logam' ? '🥫' : '🍾'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{item.nama || item.name || item.id}</p>
                <p className="text-[11px] text-slate-500">{item.poinPerKg} Poin/kg • Emisi {item.emisiPerKg} kg CO₂/kg</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={weights[item.id] || ''}
                onChange={(e) => handleWeightChange(item.id, parseFloat(e.target.value) || 0)}
                className="w-20 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-right text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-xs font-semibold text-slate-500">kg</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-950/5 p-4 rounded-xl border border-emerald-200/60 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-slate-500">Estimasi Poin Kebersihan</p>
          <p className="text-lg font-extrabold text-emerald-700">{totals.totalPoin} Poin</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-slate-500">Pengurangan Emisi</p>
          <p className="text-xs font-bold text-blue-600">{totals.totalEmisi.toFixed(2)} kg CO₂</p>
        </div>
      </div>

      <button
        onClick={handleTriggerSave}
        disabled={totals.totalPoin === 0}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm"
      >
        Simpan Setoran ke Backend API
      </button>
    </div>
  );
}

function TransactionList({ transactions, limit }: { transactions: Transaction[]; limit?: number }) {
  const displayList = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="space-y-3">
      {displayList.map((tx) => (
        <div key={tx.id} className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${tx.type === 'Setor' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {tx.type === 'Setor' ? '↓' : '↑'}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">{tx.description}</p>
              <p className="text-[10px] text-slate-400">{tx.date}</p>
            </div>
          </div>
          <span className={`text-xs font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Poin
          </span>
        </div>
      ))}
    </div>
  );
}