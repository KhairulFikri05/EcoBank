"use client";

export default function CommunityImpactCard() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-end">
      {/* ── CARD 1: Video / Visual Story Showcase (Reference 1 style) ── */}
      <div className="relative w-56 h-64 sm:w-60 sm:h-72 rounded-2xl overflow-hidden shadow-2xl group border border-white/15 shrink-0">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
          alt="Inisiatif Daur Ulang Komunitas"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

        {/* Center Frosted Glass Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-xl transition-transform duration-300 group-hover:scale-110 cursor-pointer">
            <svg className="w-5 h-5 ml-0.5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Bottom Caption */}
        <div className="absolute bottom-3.5 left-4 right-4">
          <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
            Cerita Dampak
          </p>
          <p className="text-xs font-semibold text-white leading-snug">
            Gerakan Bersih Bersama Warga
          </p>
        </div>
      </div>

      {/* ── CARD 2: Glassmorphic Community Metric Card (Reference 1 style) ── */}
      <div
        className="w-56 sm:w-64 h-64 sm:h-72 rounded-2xl p-5 sm:p-6 text-white shadow-2xl flex flex-col justify-between shrink-0"
        style={{
          background: "rgba(10, 30, 18, 0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Top: Minimalist Eco Icon Badge */}
        <div>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
            Dampak Nyata Komunitas
          </h4>
          <p className="text-xs text-slate-300/90 leading-relaxed mt-2">
            45.2 Ton sampah berhasil didaur ulang & 12.8 Ton emisi karbon ditekan bersama 12.980+ warga.
          </p>
        </div>

        {/* Bottom Metric Line */}
        <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
          <span className="text-[11px] text-slate-300 font-medium">Poin Tersalurkan</span>
          <span className="text-xs font-bold text-emerald-300 font-mono">1.450.000 Pts</span>
        </div>
      </div>
    </div>
  );
}
