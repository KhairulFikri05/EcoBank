"use client";

import { useState } from 'react';
import Image from 'next/image';
import { EducationArticleItem } from './types';
import {
  IconBook,
  IconSearch,
  IconArrowRight,
  IconDocument,
  IconExternalLink,
  IconX,
  IconTrash,
  IconLeaf,
  IconHome,
  IconRecycle,
  WasteIcon,
} from './DashboardIcons';

const educationArticles = [
  {
    id: 1,
    title: "Cara Memilah Sampah yang Benar",
    excerpt: "Pemilahan sampah dari sumbernya adalah kunci keberhasilan daur ulang. Pelajari kategori sampah organik, anorganik, dan B3.",
    readTime: "4 menit",
    category: "Dasar",
    coverImage: "/images/kaca.jpeg",
    icon: <IconTrash className="w-5 h-5" />,
    content: "Pemilahan sampah dari sumbernya adalah langkah paling mendasar dalam pengelolaan sampah yang baik. Sampah dibagi menjadi tiga kategori utama:\n\n• Sampah Organik: sisa makanan, daun, ranting — dapat dikompos\n• Sampah Anorganik: plastik, kaca, logam, kertas — dapat didaur ulang\n• Sampah B3 (Bahan Berbahaya & Beracun): baterai, cat, obat-obatan — perlu penanganan khusus\n\nSediakan minimal 3 tempat sampah berbeda di rumah Anda dengan label yang jelas. Biasakan untuk memilah sejak sampah dihasilkan, bukan setelah terkumpul bercampur.",
  },
  {
    id: 2,
    title: "Jenis Plastik & Cara Daur Ulang",
    excerpt: "Tidak semua plastik bisa didaur ulang dengan cara yang sama. Kenali kode segitiga resin dan pengelolaan limbah plastik rumah tangga.",
    readTime: "5 menit",
    category: "Plastik",
    coverImage: "/images/plastik.jpeg",
    icon: <WasteIcon id="plastik" className="w-5 h-5" />,
    content: "Plastik memiliki 7 kode daur ulang berbeda yang tercetak pada produknya:\n\n• Kode 1 (PET): botol minuman, dapat didaur ulang dengan nilai tinggi\n• Kode 2 (HDPE): botol deterjen, susu — mudah didaur ulang\n• Kode 3 (PVC): pipa, kulit sintetis — sulit didaur ulang\n• Kode 4 (LDPE): kantong plastik, kemasan fleksibel\n• Kode 5 (PP): wadah makanan, sedotan — dapat didaur ulang\n• Kode 6 (PS): styrofoam — sulit didaur ulang\n• Kode 7 (Lainnya): campuran, umumnya tidak bisa didaur ulang\n\nEcoBank menerima plastik kode 1, 2, 4, dan 5 dengan nilai poin tertinggi.",
  },
  {
    id: 3,
    title: "Dampak Sampah pada Lingkungan",
    excerpt: "Setiap tahun 8 juta ton sampah plastik masuk ke lautan. Pelajari dampak nyata penumpukan limbah dan aksi nyata yang bisa kita lakukan.",
    readTime: "6 menit",
    category: "Lingkungan",
    coverImage: "/images/background.jpg",
    icon: <IconLeaf className="w-5 h-5" />,
    content: "Dampak sampah yang tidak terkelola dengan baik sangat masif:\n\n• Pencemaran laut: 8 juta ton plastik masuk ke lautan setiap tahun, mengancam biota laut\n• Emisi gas rumah kaca: sampah organik yang membusuk menghasilkan metana (CH₄), gas 25x lebih kuat dari CO₂\n• Pencemaran tanah: plastik membutuhkan 400-1000 tahun untuk terurai\n• Kesehatan manusia: mikroplastik telah ditemukan dalam darah dan ASI manusia\n\nDengan mendepositkan sampah ke EcoBank, Anda secara langsung mencegah sampah masuk ke TPA dan mengurangi emisi karbon komunitas.",
  },
  {
    id: 4,
    title: "Tips Zero Waste Rumah Tangga",
    excerpt: "Kurangi sampah dari sumbernya. Panduan praktis menerapkan gaya hidup minim sampah di rumah sehari-hari.",
    readTime: "5 menit",
    category: "Dasar",
    coverImage: "/images/kertas.jpeg",
    icon: <IconHome className="w-5 h-5" />,
    content: "Zero waste bukan berarti nol sampah, tetapi meminimalkan sampah sebisa mungkin. Mulai dari hal kecil:\n\n• Bawa tas belanja sendiri dan hindari kantong plastik sekali pakai\n• Pilih produk dengan kemasan minimal atau kemasan yang dapat didaur ulang\n• Gunakan wadah/botol minum sendiri saat bepergian\n• Beli bahan makanan secukupnya untuk mengurangi food waste\n• Pilih produk lokal untuk mengurangi jejak karbon transportasi\n• Perbaiki barang yang rusak sebelum membeli baru (repair culture)\n• Gunakan kembali wadah bekas untuk penyimpanan lain\n\nMulai dengan 1-2 perubahan kecil dan tambahkan secara bertahap.",
  },
  {
    id: 5,
    title: "Ekonomi Sirkular: Sampah jadi Nilai",
    excerpt: "Bagaimana sampah bisa menjadi sumber daya berharga dalam sistem ekonomi sirkular yang berkelanjutan.",
    readTime: "7 menit",
    category: "Lingkungan",
    coverImage: "/images/kaleng.jpeg",
    icon: <IconRecycle className="w-5 h-5" />,
    content: "Ekonomi sirkular adalah model ekonomi yang bertujuan menghilangkan limbah dan menjaga sumber daya tetap digunakan selama mungkin.\n\nPrinsip utama:\n• Rancang dengan nol limbah — produk dirancang agar mudah diperbaiki dan didaur ulang\n• Perpanjang siklus hidup produk melalui reuse, repair, dan refurbish\n• Daur ulang sebagai pilihan terakhir — bukan tujuan utama\n\nEcoBank adalah bagian dari ekosistem ekonomi sirkular: sampah Anda menjadi bahan baku industri daur ulang, menghasilkan poin yang bisa ditukar reward nyata, sekaligus mengurangi kebutuhan bahan baku baru yang merusak alam.",
  },
  {
    id: 6,
    title: "Kompos dari Sampah Organik",
    excerpt: "Ubah sisa dapur Anda menjadi pupuk alami berkualitas tinggi. Panduan membuat kompos sederhana di rumah.",
    readTime: "6 menit",
    category: "Lingkungan",
    coverImage: "/images/background.jpg",
    icon: <IconLeaf className="w-5 h-5" />,
    content: "Komposting adalah proses mengubah bahan organik menjadi pupuk alami melalui aktivitas mikroorganisme.\n\nBahan yang bisa dikompos:\n• Kulit buah dan sayuran, sisa makanan (hindari daging/ikan)\n• Daun kering, potongan rumput, ranting kecil\n• Ampas kopi dan teh, cangkang telur\n\nCara membuat kompos sederhana:\n1. Siapkan wadah atau lubang di tanah\n2. Lapisi dengan tanah atau kompos matang\n3. Tambahkan bahan hijau (sisa makanan) dan coklat (daun kering) bergantian\n4. Jaga kelembaban — tidak terlalu basah atau kering\n5. Aduk setiap 1-2 minggu untuk aerasi\n6. Kompos siap dalam 4-8 minggu\n\nKompos matang berwarna coklat gelap, berbau tanah segar, dan berstruktur remah.",
  },
];

export function EdukasiSection({
  onNavigateSetor,
  expandedArticle,
  setExpandedArticle,
  articles,
}: {
  onNavigateSetor: () => void;
  expandedArticle: number | null;
  setExpandedArticle: (id: number | null) => void;
  articles?: EducationArticleItem[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Materi');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua Materi', 'Dasar', 'Plastik', 'Lingkungan'];

  const sourceArticles =
    articles && articles.length > 0
      ? articles.map((a) => ({
          ...a,
          icon:
            a.category === 'Plastik' ? (
              <WasteIcon id="plastik" className="w-5 h-5" />
            ) : a.category === 'Lingkungan' ? (
              <IconLeaf className="w-5 h-5" />
            ) : (
              <IconTrash className="w-5 h-5" />
            ),
        }))
      : educationArticles;

  const filteredArticles = sourceArticles.filter((article) => {
    const matchesCat =
      selectedCategory === 'Semua Materi' || article.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q))
    );
  });

  const activeModalArticle =
    sourceArticles.find((a) => a.id === expandedArticle) || null;

  return (
    <div className="space-y-6">
      {/* 1. Hero Banner yang Lebih Ramping dengan Maskot 3D */}
      <div
        className="rounded-2xl px-5 py-4 sm:px-7 sm:py-5 text-white relative overflow-hidden shadow-md"
        style={{ background: 'linear-gradient(135deg, #104929 0%, #176439 60%, #1f7d49 100%)' }}
      >
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/12 text-emerald-200 border border-white/15 flex-shrink-0 hidden sm:flex">
              <IconBook className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base sm:text-lg text-white leading-snug">
                Panduan Pengelolaan Sampah Bijak
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
                Mulai dari rumah Anda! Pelajari cara pemilahan yang tepat, klasifikasi kode plastik, serta bagaimana limbah diubah menjadi nilai sirkular nyata.
              </p>
            </div>
          </div>

          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 hidden md:block anim-mascot">
            <Image
              src="/images/maskot_ecobank4.png"
              alt="Maskot Edukasi EcoBank"
              fill
              sizes="96px"
              className="object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* 2. Bar Filter Kategori & Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#10b981] text-white shadow-xs'
                    : 'bg-white border border-slate-200/90 text-slate-600 hover:border-emerald-300 hover:text-emerald-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel edukasi..."
            style={{ paddingLeft: '2.5rem' }}
            className="w-full !pl-10 pr-3.5 py-2 rounded-xl text-xs bg-white border border-slate-200/90 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
          />
        </div>
      </div>

      {/* 3. Grid Kartu Artikel dengan Foto Sampul */}
      {filteredArticles.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <p className="text-xs font-semibold text-slate-500">
            Tidak ada materi edukasi yang cocok dengan kata kunci atau kategori tersebut.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="group bg-white rounded-2xl overflow-hidden border border-emerald-950/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Foto Sampul */}
                <div className="relative h-36 w-full overflow-hidden bg-emerald-50">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-emerald-900 shadow-xs border border-white/60">
                    {article.category} · {article.readTime}
                  </span>
                </div>

                {/* Konten Kartu */}
                <div className="p-5 pb-3 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-2">
                <button
                  type="button"
                  onClick={() => setExpandedArticle(article.id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200/80 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Baca Selengkapnya</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Seksi Referensi & Panduan Terkait */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center gap-2 text-slate-800">
          <IconDocument className="w-4 h-4 text-emerald-700" />
          <h4 className="font-bold text-sm sm:text-base tracking-tight">
            Referensi &amp; Panduan Terkait
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setExpandedArticle(2)}
            className="text-left bg-white rounded-2xl p-4 border border-emerald-950/10 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center flex-shrink-0">
                <IconDocument className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-emerald-800 transition-colors">
                  Panduan Kode Resin Plastik (PET, HDPE, PP)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Format Panduan · 1.2 MB · Panduan resmi EcoBank
                </p>
              </div>
            </div>
            <IconExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 flex-shrink-0 transition-colors" />
          </button>

          <a
            href="https://sipsn.menlhk.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-4 border border-emerald-950/10 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/70 flex items-center justify-center flex-shrink-0">
                <IconBook className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-emerald-800 transition-colors">
                  Sistem Informasi Pengelolaan Sampah Nasional (KLHK)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Website Resmi · Kementerian Lingkungan Hidup &amp; Kehutanan
                </p>
              </div>
            </div>
            <IconExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 flex-shrink-0 transition-colors" />
          </a>
        </div>
      </div>

      {/* 5. Modal Baca Artikel + Pintasan ke Tab Setor Sampah */}
      {activeModalArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setExpandedArticle(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-emerald-900/15 flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-44 sm:h-48 w-full flex-shrink-0 bg-emerald-50">
              <img
                src={activeModalArticle.coverImage}
                alt={activeModalArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setExpandedArticle(null)}
                aria-label="Tutup artikel"
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
              <span className="absolute bottom-3 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-emerald-900 shadow-xs">
                {activeModalArticle.category} · {activeModalArticle.readTime}
              </span>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-emerald-950 leading-snug">
                {activeModalArticle.title}
              </h3>
              <div className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {activeModalArticle.content}
              </div>
            </div>

            <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setExpandedArticle(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedArticle(null);
                  onNavigateSetor();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#165b41] hover:bg-[#104929] text-white shadow-xs flex items-center gap-2 transition-all"
              >
                <span>Setor Jenis Sampah Ini</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
