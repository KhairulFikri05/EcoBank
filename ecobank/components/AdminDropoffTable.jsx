import StatusBadge from "@/components/StatusBadge";
import { NEXT_STATUS, STATUS } from "@/lib/constants";

const ACTION_LABEL = {
  [STATUS.PENDING]: "Verifikasi",
  [STATUS.VERIFIED]: "Selesaikan",
};

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// tabel permintaan + tombol ubah status
export default function AdminDropoffTable({ rows, busyId, onAdvance }) {
  if (rows.length === 0) {
    return <p className="muted">Belum ada permintaan setor.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Nama</th>
            <th>Sampah</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="mono">{r.kode}</td>
              <td>{r.nama}</td>
              <td>
                {r.jenis}, {r.beratKg} kg
              </td>
              <td>{formatDate(r.tanggal)}</td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td>
                {NEXT_STATUS[r.status] && (
                  <button className="btn small" disabled={busyId === r.id} onClick={() => onAdvance(r)}>
                    {ACTION_LABEL[r.status]}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
