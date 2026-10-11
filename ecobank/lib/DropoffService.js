import fs from 'fs';
import path from 'path';

// Mengarahkan ke file dropoffTransactions.json di folder data
const filePath = path.join(process.cwd(), 'data', 'dropoffTransactions.json');

export const DropoffService = {
  // Fungsi membaca semua transaksi
  getAllTransactions: () => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  },

  // Fungsi menambah transaksi baru
  addTransaction: (newTransaction) => {
    const transactions = DropoffService.getAllTransactions();
    transactions.push(newTransaction);
    fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));
    return newTransaction;
  },
  
  // Fungsi mengubah status transaksi (Untuk Admin)
  updateTransactionStatus: (ticketId, newStatus) => {
    const transactions = DropoffService.getAllTransactions();
    const index = transactions.findIndex(t => t.ticketId === ticketId);
    if (index !== -1) {
      transactions[index].status = newStatus;
      fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));
      return transactions[index];
    }
    return null;
  }
};