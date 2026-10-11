export default function FilterTab({ activeFilter, setFilter }) {
  const tabs = ['Semua', 'Setor', 'Tukar'];

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((tab) => (
        <button 
          key={tab} 
          onClick={() => setFilter(tab)}
          className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${
            activeFilter === tab 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}