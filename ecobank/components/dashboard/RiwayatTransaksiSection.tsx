"use client";

import { useState } from 'react';
import { Transaction } from './types';
import {
  IconSearch,
  IconRecycle,
  IconStar,
  IconCamera,
  IconCheckCircle,
  IconX,
  IconLeaf,
  IconDownload,
} from './DashboardIcons';

export function RiwayatTransaksiSection({ transactions }: { transactions: Transaction[] }) {
  const [filterType, setFilterType] = useState<'Semua' | 'Setor' | 'Tukar'>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(transactions[0]?.id ?? null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === 'Semua' || tx.type === filterType;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesType;
    const haystack = [
      tx.description,
      tx.dropPoint || '',
      tx.trxCode || '',
      tx.date,
      tx.wasteDetail || '',
    ]
      .join(' ')
      .toLowerCase();
    return matchesType && haystack.includes(q);
  });

  const selectedTx =
    filteredTransactions.find((tx) => tx.id === selectedTxId) ||
    (selectedTxId ? transactions.find((tx) => tx.id === selectedTxId) : null) ||
    null;

  const grouped = filteredTransactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const groupKey = tx.monthGroup || 'OKTOBER 2026';
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(tx);
    return acc;
  }, {});

  const handleDownloadProof = (tx: Transaction) => {
    if (!tx.photoUrl) return;
    const link = document.createElement('a');
    link.href = tx.photoUrl;
    link.download = `${(tx.trxCode || tx.id).replace('#', '')}-bukti-setoran.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-950/10 shadow-xs">
      {/* 1. Header Kartu dengan Filter & Pencarian Ringkas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-emerald-950 tracking-tight">
            Riwayat Seluruh Transaksi
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-md">
            Daftar lengkap aktivitas setoran sampah dan penukaran saldo reward
          </p>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-2.5">
          {/* Kolom Pencarian */}
          <div className="relative w-full sm:w-72">
            <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi..."
              style={{ paddingLeft: '2.5rem' }}
              className="w-full !pl-10 pr-3.5 py-2 rounded-xl text-xs bg-slate-50/70 border border-slate-200/90 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
            />
          </div>

          {/* Filter Pill Kategori */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: 'Semua', label: 'Semua' },
                { key: 'Setor', label: 'Setoran Sampah' },
                { key: 'Tukar', label: 'Tukar Reward' },
              ] as const
            ).map((pill) => {
              const active = filterType === pill.key;
              return (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setFilterType(pill.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#165b41] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-800'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2 & 3. Daftar Transaksi (Kiri) + Panel Detail Transaksi (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-5">
        <div className={selectedTx ? 'lg:col-span-7 space-y-5' : 'lg:col-span-12 space-y-5'}>
          {Object.keys(grouped).length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-xs font-semibold text-slate-500">
                Tidak ada transaksi yang cocok dengan pencarian atau filter.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([monthLabel, items]) => (
              <div key={monthLabel} className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                  {monthLabel}
                </p>

                <div className="space-y-2.5">
                  {items.map((tx) => {
                    const isSelected = selectedTx?.id === tx.id;
                    const statusLabel = tx.status || (tx.type === 'Setor' ? 'Terverifikasi' : 'Berhasil');
                    const isPending = statusLabel === 'Menunggu';

                    return (
                      <button
                        key={tx.id}
                        type="button"
                        onClick={() => setSelectedTxId(tx.id)}
                        className={`w-full text-left flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl transition-all ${
                          isSelected
                            ? 'bg-emerald-50/45 border-2 border-emerald-500/50 shadow-2xs'
                            : 'bg-white border border-slate-200/80 hover:border-emerald-300/80'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                              tx.type === 'Setor'
                                ? 'bg-emerald-100/70 text-emerald-700 border-emerald-200/70'
                                : 'bg-amber-50 text-amber-600 border-amber-200/70'
                            }`}
                          >
                            {tx.type === 'Setor' ? (
                              <IconRecycle className="w-5 h-5" />
                            ) : (
                              <IconStar className="w-5 h-5" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate leading-snug">
                              {tx.description}
                            </p>

                            <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 leading-snug">
                              <span>{tx.date}</span>
                              <span>·</span>
                              <span>{tx.dropPoint || (tx.type === 'Setor' ? 'Bank Sampah' : 'Penukaran Instan')}</span>
                              {tx.type === 'Setor' && tx.photoUrl && (
                                <>
                                  <span>·</span>
                                  <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                                    <IconCamera className="w-3.5 h-3.5 text-emerald-700" />
                                    Bukti Foto
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span
                            className={`text-xs sm:text-sm font-bold tabular-nums ${
                              tx.amount > 0 ? 'text-emerald-700' : 'text-rose-500'
                            }`}
                          >
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Pts
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isPending
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            }`}
                          >
                            <IconCheckCircle className="w-3 h-3" />
                            {statusLabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Detail Transaksi */}
        {selectedTx && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-5 border border-emerald-950/10 shadow-sm space-y-4 lg:sticky lg:top-24">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-emerald-950 leading-snug">Detail Transaksi</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 tabular-nums">
                    {selectedTx.trxCode || `#TRX-${selectedTx.id}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      selectedTx.status === 'Menunggu'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                    }`}
                  >
                    <IconCheckCircle className="w-3.5 h-3.5" />
                    {selectedTx.status || (selectedTx.type === 'Setor' ? 'Terverifikasi' : 'Berhasil')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedTxId(null)}
                    aria-label="Tutup detail transaksi"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <IconX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Foto Bukti Dokumentasi */}
              {selectedTx.photoUrl && (
                <div className="relative rounded-xl overflow-hidden h-44 bg-slate-100 border border-slate-200/80">
                  <img
                    src={selectedTx.photoUrl}
                    alt={`Bukti ${selectedTx.description}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs text-[11px] font-medium text-white">
                      Bukti Dokumentasi Setoran
                    </span>
                  </div>
                </div>
              )}

              {/* Rincian Lengkap */}
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500">
                    {selectedTx.type === 'Setor' ? 'Drop Point' : 'Tujuan'}
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {selectedTx.dropPoint || (selectedTx.type === 'Setor' ? 'Bank Sampah' : 'Penukaran Instan')}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500">
                    {selectedTx.type === 'Setor' ? 'Berat & Kategori' : 'Item Reward'}
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {selectedTx.wasteDetail || selectedTx.description}
                  </span>
                </div>

                {selectedTx.type === 'Setor' && (
                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <span className="text-slate-500">Reduksi Emisi</span>
                    <span className="font-semibold text-emerald-700 inline-flex items-center gap-1 tabular-nums">
                      <IconLeaf className="w-3.5 h-3.5 text-emerald-600" />
                      {(selectedTx.emisi ?? 0).toFixed(2)} kg CO₂
                    </span>
                  </div>
                )}

                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500">
                    {selectedTx.type === 'Setor' ? 'Poin Diterima' : 'Poin Ditukar'}
                  </span>
                  <span
                    className={`font-bold tabular-nums ${
                      selectedTx.amount > 0 ? 'text-emerald-700' : 'text-rose-500'
                    }`}
                  >
                    {selectedTx.amount > 0 ? `+${selectedTx.amount}` : selectedTx.amount} Pts
                  </span>
                </div>
              </div>

              {selectedTx.photoUrl && (
                <button
                  type="button"
                  onClick={() => handleDownloadProof(selectedTx)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <IconDownload className="w-4 h-4 text-slate-600" />
                  <span>Unduh Bukti Setoran</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
