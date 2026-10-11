"use client";

import { useState } from "react";

// form password admin
export default function AdminLogin({ onLogin, loading, error }) {
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password) onLogin(password);
  }

  return (
    <form onSubmit={handleSubmit} className="form narrow">
      <label>
        Password admin
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error && <p className="error-text" role="alert">{error}</p>}
      <button className="btn" type="submit" disabled={loading || !password}>
        {loading ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
