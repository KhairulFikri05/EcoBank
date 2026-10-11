"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePoints } from "@/hooks/usePoints";

const LINKS = [
  { href: "/kalkulator", label: "Kalkulator" },
  { href: "/dropoff", label: "Setor" },
  { href: "/reward", label: "Hadiah" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/dashboard", label: "Dampak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { points, ready } = usePoints();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          EcoBank
        </Link>
        <nav className="nav-links" aria-label="Menu utama">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname.startsWith(l.href) ? "active" : undefined}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <span className="saldo" title="Saldo poin">
          {ready ? points.toLocaleString("id-ID") : "-"} poin
        </span>
      </div>
    </header>
  );
}
