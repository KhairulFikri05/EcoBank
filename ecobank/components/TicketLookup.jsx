"use client";

import { useState } from "react";

// Presenter: kotak cek status via kode tiket
export default function TicketLookup({ onSearch, loading }) {
  const [kode, setKode] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (kode.trim()) onSearch(kode);
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <label className="sr-only" htmlFor="kode">
        Kode tiket
      </label>
      <input
        id="kode"
        value={kode}
        onChange={(e) => setKode(e.target.value.toUpperCase())}
        placeholder="ECO-XXXXXX"
        autoComplete="off"
      />
      <button className="btn" type="submit" disabled={loading || !kode.trim()}>
        Cek status
      </button>
    </form>
  );
}
