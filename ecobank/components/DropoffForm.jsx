"use client";

import { useState } from "react";
import { WASTE_TYPES } from "@/lib/constants";

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const EMPTY = { nama: "", jenis: WASTE_TYPES[0], beratKg: "", tanggal: "", catatan: "" };

// Presenter: form pengajuan setor. Logika kirim ada di container (halaman).
export default function DropoffForm({ onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [localError, setLocalError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const berat = Number(form.beratKg);
    if (form.nama.trim().length < 2) return setLocalError("Nama minimal 2 karakter");
    if (!(berat > 0)) return setLocalError("Berat harus lebih dari 0 kg");
    if (!form.tanggal) return setLocalError("Pilih tanggal setor");
    setLocalError("");
    const ok = await onSubmit({ ...form, beratKg: berat });
    if (ok) setForm(EMPTY);
  }

  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <label>
        Nama
        <input value={form.nama} onChange={set("nama")} maxLength={60} placeholder="Nama lengkap" />
      </label>

      <div className="grid-2">
        <label>
          Jenis sampah
          <select value={form.jenis} onChange={set("jenis")}>
            {WASTE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Perkiraan berat (kg)
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={form.beratKg}
            onChange={set("beratKg")}
            placeholder="0"
          />
        </label>
      </div>

      <label>
        Tanggal setor
        <input type="date" min={today()} value={form.tanggal} onChange={set("tanggal")} />
      </label>

      <label>
        Catatan (opsional)
        <textarea value={form.catatan} onChange={set("catatan")} maxLength={200} rows={3} />
      </label>

      {localError && <p className="error-text" role="alert">{localError}</p>}

      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Ajukan setor"}
      </button>
    </form>
  );
}
