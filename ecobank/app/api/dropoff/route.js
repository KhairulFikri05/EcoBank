import { NextResponse } from 'next/server';
import { DropoffService } from '@/lib/DropoffService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('ticketId');
  const transactions = DropoffService.getAllTransactions();

  if (ticketId) {
    const transaction = transactions.find(t => t.ticketId === ticketId);
    return transaction 
      ? NextResponse.json(transaction) 
      : NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(transactions);
}

export async function POST(request) {
  const body = await request.json();
  
  const newTransaction = {
    ticketId: `DROP-${Math.floor(Math.random() * 10000)}`, // Generate kode tiket
    ...body,
    status: 'Pending', // Status default
    date: new Date().toISOString()
  };

  DropoffService.addTransaction(newTransaction);
  return NextResponse.json({ message: "Berhasil disetor", data: newTransaction }, { status: 201 });
}

export async function PATCH(request) {
  const body = await request.json();
  const { ticketId, status } = body;

  const updated = DropoffService.updateTransactionStatus(ticketId, status);
  return updated 
    ? NextResponse.json({ message: "Status diperbarui", data: updated }) 
    : NextResponse.json({ error: "Gagal memperbarui" }, { status: 400 });
}