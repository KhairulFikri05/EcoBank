"use client";

import { useEffect } from "react";

// Presenter: dialog konfirmasi penukaran
export default function RewardModal({ reward, saldo, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const sisa = saldo - reward.biaya;
  const cukup = sisa >= 0;

  return (
    <div className="overlay" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">Tukar {reward.nama}?</h2>
        <dl className="rows">
          <div>
            <dt>Saldo sekarang</dt>
            <dd>{saldo.toLocaleString("id-ID")} poin</dd>
          </div>
          <div>
            <dt>Biaya</dt>
            <dd>{reward.biaya.toLocaleString("id-ID")} poin</dd>
          </div>
          <div>
            <dt>Sisa saldo</dt>
            <dd className={cukup ? undefined : "error-text"}>
              {cukup ? `${sisa.toLocaleString("id-ID")} poin` : `Kurang ${-sisa} poin`}
            </dd>
          </div>
        </dl>
        <div className="actions">
          <button className="btn ghost" onClick={onCancel}>
            Batal
          </button>
          <button className="btn" onClick={onConfirm} disabled={!cukup} autoFocus>
            Tukar sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
