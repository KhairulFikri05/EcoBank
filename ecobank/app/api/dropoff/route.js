import { NextResponse } from 'next/server';
import { DropoffService } from '@/lib/DropoffService';

// GET: Cek status tiket menggunakan URL parameter (contoh: /api/dropoff?ticketId=DROP-1234)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('ticketId');
  const transactions = DropoffService.getAll();

  if (ticketId) {
    const result = transactions.find(t => t.ticketId === ticketId);
    if (!result) return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
    return NextResponse.json(result);
  }
  return NextResponse.json(transactions); // Kembalikan semua jika tidak ada ID (untuk halaman Admin)
}

// POST: Buat setoran sampah baru
export async function POST(request) {
  const body = await request.json();
  const newTransaction = {
    ticketId: `DROP-${Math.floor(1000 + Math.random() * 9000)}`, // Generate kode 4 digit
    ...body,
    status: 'Pending', // Status default
    createdAt: new Date().toISOString(),
  };

  DropoffService.add(newTransaction);
  return NextResponse.json({ message: "Berhasil disetor", data: newTransaction }, { status: 201 });
}

// PATCH: Ubah status (Pending -> Verified/Completed) untuk halaman Admin
export async function PATCH(request) {
  const { ticketId, status } = await request.json();
  const updated = DropoffService.updateStatus(ticketId, status);

  if (!updated) return NextResponse.json({ error: "Gagal memperbarui status" }, { status: 400 });
  return NextResponse.json({ message: "Status diperbarui", data: updated });
}