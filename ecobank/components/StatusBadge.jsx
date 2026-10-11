import { STATUS } from "@/lib/constants";

// Presenter: hanya menampilkan status
export default function StatusBadge({ status }) {
  const cls =
    status === STATUS.COMPLETED ? "done" : status === STATUS.VERIFIED ? "verified" : "pending";
  return <span className={`badge ${cls}`}>{status}</span>;
}
