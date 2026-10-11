// components/DashboardImpact.jsx

export default function DashboardImpact({ totalKg = 0, totalPoin = 0, totalEmisi = 0 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      
      {/* Kartu 1: Total Kg */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
        <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Sampah Terkumpul</h3>
        <p className="text-3xl font-bold text-gray-800">
          {totalKg} <span className="text-base font-medium text-gray-500">kg</span>
        </p>
      </div>
      
      {/* Kartu 2: Total Poin */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
        <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Poin Beredar</h3>
        <p className="text-3xl font-bold text-green-600">
          {totalPoin} <span className="text-base font-medium text-gray-500">Poin</span>
        </p>
      </div>
      
      {/* Kartu 3: Total Emisi */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
        <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Emisi Dicegah</h3>
        <p className="text-3xl font-bold text-blue-600">
          {totalEmisi} <span className="text-base font-medium text-gray-500">kg CO₂</span>
        </p>
      </div>

    </div>
  );
}