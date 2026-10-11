export default function ItemCard({ item, weight, onWeightChange }) {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <p className="font-bold">{item.kategori}</p>
        <p className="text-sm text-gray-500">Poin: {item.poinPerKg}/kg | Emisi: {item.emisiPerKg}kg CO2/kg</p>
      </div>
      <input 
        type="number" 
        min="0" 
        value={weight || ''} 
        onChange={(e) => onWeightChange(item.id, parseFloat(e.target.value) || 0)}
        className="border p-1 w-24 rounded" 
        placeholder="Kg"
      />
    </div>
  );
}