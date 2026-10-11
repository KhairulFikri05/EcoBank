"use client";

// Container: form pengajuan + cek status via kode tiket.
import { useState } from "react";
import { useDropoff } from "@/hooks/useDropoff";
import DropoffForm from "@/components/DropoffForm";
import TicketCard from "@/components/TicketCard";
import TicketLookup from "@/components/TicketLookup";

export default function DropoffPage() {
  const { loading, error, clearError, submit, findByCode } = useDropoff();
  const [created, setCreated] = useState(null);
  const [found, setFound] = useState(null);

  async function handleSubmit(payload) {
    setCreated(null);
    const ticket = await submit(payload);
    if (ticket) setCreated(ticket);
    return Boolean(ticket);
  }

  async function handleSearch(kode) {
    setFound(null);
    clearError();
    const ticket = await findByCode(kode);
    if (ticket) setFound(ticket);
  }

  return (
    <>
      <header className="page-head">
        <h1>Setor sampah</h1>
        <p className="muted">Ajukan jadwal setor. Simpan kode tiket untuk mengecek statusnya.</p>
      </header>

      <div className="two-col">
        <section>
          <h2>Ajukan setor</h2>
          <DropoffForm onSubmit={handleSubmit} loading={loading} />
          {error && !found && <p className="error-text" role="alert">{error}</p>}
          {created && <TicketCard ticket={created} title="Pengajuan terkirim. Simpan kode ini:" />}
        </section>

        <section>
          <h2>Cek status</h2>
          <TicketLookup onSearch={handleSearch} loading={loading} />
          {found && <TicketCard ticket={found} />}
        </section>
      </div>
    </>
  );
}
