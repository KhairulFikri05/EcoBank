import fs from 'fs';
import path from 'path';

// Mendapatkan path absolut ke file JSON
const filePath = path.join(process.cwd(), 'data', 'dropoffTransactions.json');

export const DropoffService = {
  getAll: () => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  },
  
  add: (transaction) => {
    const data = DropoffService.getAll();
    data.push(transaction);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return transaction;
  },
  
  updateStatus: (ticketId, status) => {
    const data = DropoffService.getAll();
    const index = data.findIndex(t => t.ticketId === ticketId);
    if (index !== -1) {
      data[index].status = status;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return data[index];
    }
    return null;
  }
};