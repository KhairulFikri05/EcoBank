import StatusBadge from "@/components/StatusBadge";

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// Presenter: ringkasan satu tiket drop-off
export default function TicketCard({ ticket, title }) {
  return (
    <section className="ticket" aria-live="polite">
      {title && <p className="muted">{title}</p>}
      <p className="ticket-code">{ticket.kode}</p>
      <StatusBadge status={ticket.status} />
      <dl className="rows">
        <div>
          <dt>Nama</dt>
          <dd>{ticket.nama}</dd>
        </div>
        <div>
          <dt>Sampah</dt>
          <dd>
            {ticket.jenis}, {ticket.beratKg} kg
          </dd>
        </div>
        <div>
          <dt>Tanggal setor</dt>
          <dd>{formatDate(ticket.tanggal)}</dd>
        </div>
        {ticket.catatan && (
          <div>
            <dt>Catatan</dt>
            <dd>{ticket.catatan}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
