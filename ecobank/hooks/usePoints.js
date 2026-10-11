"use client";

// Hooks Pattern: satu-satunya pemilik saldo poin dan riwayat transaksi.
// Anggota A (kalkulator) memanggil addPoints(); halaman Riwayat membaca history.
//
// Bentuk entri history:
//   { id, type: "setor" | "tukar", label, points (setor +, tukar -), date (ISO), ...extra }
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const POINTS_KEY = "ecobank_points";
const HISTORY_KEY = "ecobank_history";

const PointsContext = createContext(null);

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function PointsProvider({ children }) {
  const stateRef = useRef({ points: 0, history: [] });
  const [state, setState] = useState(stateRef.current);
  const [ready, setReady] = useState(false);

  const commit = useCallback((next) => {
    stateRef.current = next;
    setState(next);
  }, []);

  // Muat dari localStorage setelah mount (hindari mismatch hydration)
  useEffect(() => {
    const points = Number(readStorage(POINTS_KEY, 0)) || 0;
    const history = readStorage(HISTORY_KEY, []);
    commit({ points, history: Array.isArray(history) ? history : [] });
    setReady(true);
  }, [commit]);

  // Simpan setiap ada perubahan
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(POINTS_KEY, JSON.stringify(state.points));
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
    } catch {
      // storage penuh/diblokir: abaikan, state tetap jalan di memori
    }
  }, [state, ready]);

  // Tambah poin dari setor sampah. extra boleh berisi { kg, jenis, ... }
  const addPoints = useCallback(
    (amount, label = "Setor sampah", extra = {}) => {
      const value = Math.floor(Number(amount));
      if (!Number.isFinite(value) || value <= 0) return null;
      const entry = { ...extra, id: newId(), type: "setor", label, points: value, date: new Date().toISOString() };
      const cur = stateRef.current;
      commit({ points: cur.points + value, history: [entry, ...cur.history] });
      return entry;
    },
    [commit]
  );

  // Tukar poin dengan hadiah. Validasi saldo ada di sini (bukan di UI).
  const redeem = useCallback(
    (reward) => {
      const cur = stateRef.current;
      const cost = Number(reward?.biaya);
      if (!reward || !Number.isFinite(cost) || cost <= 0) {
        return { ok: false, message: "Hadiah tidak valid" };
      }
      if (cur.points < cost) {
        return { ok: false, message: `Saldo kurang ${cost - cur.points} poin` };
      }
      const entry = {
        id: newId(),
        type: "tukar",
        label: `Tukar: ${reward.nama}`,
        points: -cost,
        rewardId: reward.id,
        date: new Date().toISOString(),
      };
      commit({ points: cur.points - cost, history: [entry, ...cur.history] });
      return { ok: true, message: `Berhasil menukar ${reward.nama}`, sisa: cur.points - cost };
    },
    [commit]
  );

  const value = useMemo(
    () => ({ points: state.points, history: state.history, ready, addPoints, redeem }),
    [state, ready, addPoints, redeem]
  );

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints harus dipakai di dalam <PointsProvider>");
  return ctx;
}
