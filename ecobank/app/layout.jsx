import Link from "next/link";
import "./globals.css";
import { PointsProvider } from "@/hooks/usePoints";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "EcoBank",
  description: "Bank sampah digital: setor sampah terpilah, kumpulkan poin, tukar hadiah.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <PointsProvider>
          <Navbar />
          <main className="container">{children}</main>
          <footer className="footer">
            <span>EcoBank, UTS Praktikum POPL</span>
            <Link href="/admin">Admin</Link>
          </footer>
        </PointsProvider>
      </body>
    </html>
  );
}
