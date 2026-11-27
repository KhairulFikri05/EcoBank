"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { mitraLocations } from '@/lib/mitraLocations';

function mapRegisterError(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user_already_exists')) {
    return 'Email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk ke akun Anda.';
  }
  if (msg.includes('password') && (msg.includes('6') || msg.includes('short') || msg.includes('weak'))) {
    return 'Kata sandi harus terdiri dari minimal 6 karakter.';
  }
  if (msg.includes('invalid email')) {
    return 'Format alamat email tidak valid. Periksa kembali email Anda.';
  }
  return message || 'Terjadi kesalahan saat mendaftarkan akun. Silakan coba lagi.';
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: '', email: '', password: '', konfirmasi: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter.');
      return;
    }

    if (form.password !== form.konfirmasi) {
      setError('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const emailTrimmed = form.email.trim();
      const namaTrimmed = form.nama.trim();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: emailTrimmed,
        password: form.password,
      });

      if (signUpError) {
        setError(mapRegisterError(signUpError.message));
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Registrasi gagal: data pengguna tidak dikembalikan.');
        setLoading(false);
        return;
      }

      const randomDigits = Math.floor(100 + Math.random() * 900);
      const memberCode = `EB-2026-${randomDigits}`;

      const { error: profileError } = await supabase.from('profiles').insert({
        auth_user_id: data.user.id,
        member_code: memberCode,
        full_name: namaTrimmed,
        email: emailTrimmed,
        phone: '',
        address: 'Kota Banda Aceh',
        district: 'Kota Banda Aceh',
        role: 'nasabah',
        level: 'Level 1 · Eco Starter',
        points_balance: 0,
        total_weight_kg: 0,
        total_co2_saved_kg: 0,
      });

      if (profileError) {
        setError(`Gagal menyimpan profil nasabah: ${profileError.message}`);
        setLoading(false);
        return;
      }

      localStorage.setItem(
        'ecobank_user_profile',
        JSON.stringify({
          nama: namaTrimmed,
          email: emailTrimmed,
          phone: '',
          address: 'Kota Banda Aceh',
          district: 'Kota Banda Aceh',
          joinDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
          level: 'Level 1 · Eco Starter',
          idNasabah: memberCode,
          dropPointFavorit: mitraLocations[0].name,
          avatarInitial: namaTrimmed ? namaTrimmed[0].toUpperCase() : 'N',
        })
      );

      if (data.session) {
        alert(`Selamat datang, ${namaTrimmed}! Akun EcoBank Anda (${memberCode}) berhasil dibuat.`);
        router.push('/dashboard');
      } else {
        alert(`Akun berhasil dibuat untuk ${namaTrimmed} (${memberCode})! Silakan masuk menggunakan email dan kata sandi Anda.`);
        router.push('/login');
      }
    } catch {
      setError('Terjadi gangguan koneksi ke server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between px-4 py-6 sm:px-8 font-sans bg-neutral-950">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }} />
      <div className="absolute inset-0 bg-neutral-950/70" />

      <header className="relative z-10 w-full max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white px-3 py-1.5 rounded-lg bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2">
          <span aria-hidden="true">←</span> Kembali ke beranda
        </Link>
      </header>

      <main className="relative z-10 w-full max-w-4xl mx-auto my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="md:col-span-2 bg-emerald-800 text-white p-8 flex flex-col justify-between gap-8">
            <div>
              <p className="text-base font-semibold">EcoBank</p>
              <p className="text-sm text-emerald-100 mt-1.5 leading-relaxed">Bergabung bersama kami dan mulai ubah sampah menjadi poin nyata.</p>
            </div>
            <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto shrink-0">
              <img src="/images/maskot_ecobank3.png" alt="Maskot EcoBank" className="w-full h-full object-contain anim-float" />
            </div>
            <p className="text-sm text-emerald-100">Daftar untuk mulai menikmati manfaat EcoBank.</p>
          </div>

          <div className="md:col-span-3 p-8 sm:p-10">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-slate-900">Buat akun EcoBank</h1>
              <p className="text-sm text-slate-600 mt-1.5">Isi data berikut untuk bergabung.</p>
            </div>

            {error && (
              <div role="alert" className="mb-4 text-sm text-red-700 border-l-2 border-red-600 pl-3 py-1">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="!block text-sm font-medium text-slate-800 mb-1.5">Nama lengkap</label>
                <input
                  id="register-name"
                  type="text"
                  name="nama"
                  required
                  placeholder="Nama lengkap kamu"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="register-email" className="!block text-sm font-medium text-slate-800 mb-1.5">Email</label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  required
                  placeholder="email@kamu.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="!block text-sm font-medium text-slate-800 mb-1.5">Kata sandi</label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 pr-11 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-800 rounded-md"
                    aria-label={showPass ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="!block text-sm font-medium text-slate-800 mb-1.5">Konfirmasi kata sandi</label>
                <input
                  id="register-confirm-password"
                  type="password"
                  name="konfirmasi"
                  required
                  placeholder="Ulangi password"
                  value={form.konfirmasi}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" required className="!w-4 !h-4 !p-0 !m-0 shrink-0 accent-emerald-700" id="terms" />
                <label htmlFor="terms" className="!block min-w-0 text-xs text-slate-500 leading-relaxed">
                  Saya menyetujui{' '}
                  <a href="#" className="text-emerald-700 font-medium hover:underline">Syarat & Ketentuan</a>
                  {' '}serta{' '}
                  <a href="#" className="text-emerald-700 font-medium hover:underline">Kebijakan Privasi</a>
                  {' '}EcoBank.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium transition-colors disabled:opacity-60 w-full mt-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Membuat akun...
                  </>
                ) : 'Buat Akun Gratis'}
              </button>
            </form>

            <div className="mt-5">
              <p className="text-sm text-slate-500">
                Sudah punya akun?{' '}
                <Link href="/login" className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-800 hover:bg-emerald-200 transition-colors">
                  Masuk sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center text-sm text-white/70">&copy; EcoBank</footer>
    </div>
  );
}
