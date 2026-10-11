"use client";

// Container: login admin, ambil daftar permintaan, ubah status.
import { useCallback, useEffect, useState } from "react";
import { useDropoff } from "@/hooks/useDropoff";
import { NEXT_STATUS } from "@/lib/constants";
import AdminLogin from "@/components/AdminLogin";
import AdminDropoffTable from "@/components/AdminDropoffTable";

const SESSION_KEY = "ecobank_admin_pw";

export default function AdminPage() {
  const { loading, error, clearError, listAll, updateStatus } = useDropoff();
  const [password, setPassword] = useState(null);
  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(
    async (pw) => {
      const data = await listAll(pw);
      if (!data) return false;
      setRows(data);
      return true;
    },
    [listAll]
  );

  // Pulihkan sesi (sessionStorage hilang saat tab ditutup)
  useEffect(() => {
    const saved = window.sessionStorage.getItem(SESSION_KEY);
    if (!saved) return;
    load(saved).then((ok) => {
      if (ok) setPassword(saved);
      else window.sessionStorage.removeItem(SESSION_KEY);
      clearError();
    });
  }, [load, clearError]);

  async function handleLogin(pw) {
    if (await load(pw)) {
      window.sessionStorage.setItem(SESSION_KEY, pw);
      setPassword(pw);
    }
  }

  async function handleAdvance(row) {
    setBusyId(row.id);
    const updated = await updateStatus(row.id, NEXT_STATUS[row.status], password);
    if (updated) setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setBusyId(null);
  }

  function handleLogout() {
    window.sessionStorage.removeItem(SESSION_KEY);
    setPassword(null);
    setRows([]);
    clearError();
  }

  if (!password) {
    return (
      <>
        <header className="page-head">
          <h1>Admin</h1>
          <p className="muted">Masuk untuk mengelola permintaan setor.</p>
        </header>
        <AdminLogin onLogin={handleLogin} loading={loading} error={error} />
      </>
    );
  }

  return (
    <>
      <header className="page-head row-between">
        <div>
          <h1>Permintaan setor</h1>
          <p className="muted">{rows.length} permintaan</p>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => load(password)} disabled={loading}>
            Muat ulang
          </button>
          <button className="btn ghost" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </header>
      {error && <p className="error-text" role="alert">{error}</p>}
      <AdminDropoffTable rows={rows} busyId={busyId} onAdvance={handleAdvance} />
    </>
  );
}
