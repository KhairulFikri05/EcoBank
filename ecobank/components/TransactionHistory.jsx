"use client";
import { useState } from 'react';
import FilterTab from './FilterTab';

export default function TransactionHistory({ transactions = [] }) {
  const [filter, setFilter] = useState('Semua');

  // Logika filter: Jika 'Semua', tampilkan semua. Jika tidak, cocokkan dengan t.type
  const filteredData = transactions.filter(t => 
    filter === 'Semua' ? true : t.type === filter
  );

  return (
    <div className="max-w-md mx-auto bg-white border p-6 rounded-lg shadow-sm mt-4">
      <h2 className="text-xl font-bold mb-4">Riwayat Transaksi</h2>
      
      {/* Memanggil komponen FilterTab */}
      <FilterTab activeFilter={filter} setFilter={setFilter} />
      
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Belum ada riwayat transaksi.</p>
        ) : (
          filteredData.map((t, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold text-gray-800">{t.description}</p>
                <p className="text-xs text-gray-500">{t.date}</p>
              </div>
              <span className={`font-bold ${t.type === 'Setor' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'Setor' ? '+' : '-'}{t.amount} Poin
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}