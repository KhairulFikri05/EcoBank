"use client";

// Hooks Pattern: semua pemanggilan API drop-off lewat sini.
import { useCallback, useState } from "react";
import { ADMIN_HEADER } from "@/lib/constants";

async function request(url, options = {}) {
  const res = await fetch(url, { cache: "no-store", ...options });
  let body = null;
  try {
    body = await res.json();
  } catch {
    // body kosong / bukan JSON
  }
  if (!res.ok) {
    throw new Error(body?.error || "Terjadi kesalahan pada server");
  }
  return body?.data;
}

const jsonHeaders = { "Content-Type": "application/json" };

export function useDropoff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async (fn) => {
    setLoading(true);
    setError("");
    try {
      return await fn();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  // Warga
  const submit = useCallback(
    (payload) =>
      run(() => request("/api/dropoff", { method: "POST", headers: jsonHeaders, body: JSON.stringify(payload) })),
    [run]
  );

  const findByCode = useCallback(
    (kode) => run(() => request(`/api/dropoff?kode=${encodeURIComponent(kode.trim().toUpperCase())}`)),
    [run]
  );

  // Admin
  const listAll = useCallback(
    (password) => run(() => request("/api/dropoff", { headers: { [ADMIN_HEADER]: password } })),
    [run]
  );

  const updateStatus = useCallback(
    (id, status, password) =>
      run(() =>
        request("/api/dropoff", {
          method: "PATCH",
          headers: { ...jsonHeaders, [ADMIN_HEADER]: password },
          body: JSON.stringify({ id, status }),
        })
      ),
    [run]
  );

  return { loading, error, clearError, submit, findByCode, listAll, updateStatus };
}
