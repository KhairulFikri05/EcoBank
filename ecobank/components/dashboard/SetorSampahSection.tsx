"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { useWaste } from '@/hooks/useWaste';
import { CalculatorContext, StandardCalculationStrategy } from '@/lib/wasteStrategy';
import { DropoffPayload, WasteItem, nearbyDropPoints } from './types';
import {
  IconCamera,
  IconX,
  IconMapPin,
  IconChevronDown,
  IconCheck,
  IconRecycle,
  IconUpload,
  IconStar,
  IconArrowRight,
  WasteIcon,
} from './DashboardIcons';

export function LiveCameraModal({
  isOpen,
  onClose,
  onCapture,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string, filename: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setCameraError('');
      return;
    }

    let activeStream: MediaStream | null = null;
    async function startCamera() {
      try {
        setCameraError('');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Camera access error:', err);
        setCameraError('Kamera tidak dapat diakses atau izin kamera ditolak oleh browser. Anda dapat mengunggah foto secara manual lewat tombol "Upload File".');
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      const filename = `foto-setoran-${Date.now().toString().slice(-4)}.jpg`;

      setTimeout(() => {
        onCapture(dataUrl, filename);
        setIsCapturing(false);
        onClose();
      }, 200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 text-white flex flex-col">
        {/* Modal Header */}
        <div className="p-4 px-6 flex items-center justify-between border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h4 className="text-sm font-bold text-white tracking-wide">Kamera Pengambilan Bukti Sampah</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {/* Video Viewfinder */}
        <div className="relative bg-black aspect-[4/3] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/30">
                <IconCamera className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Kembali ke Form Setoran
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-200 ${isCapturing ? 'opacity-40' : 'opacity-100'}`}
              />
              {/* Focus Crosshair Guide */}
              <div className="absolute inset-8 border border-white/25 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-lg" />
                <div className="w-10 h-10 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-lg" />
                <div className="w-10 h-10 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-lg" />
                <div className="w-10 h-10 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-lg" />
                <p className="text-[11px] font-semibold text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                  Posisikan sampah di dalam bingkai
                </p>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Shutter Controls */}
        {!cameraError && (
          <div className="p-4 px-6 bg-slate-950 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Live Camera feed</span>
            <button
              type="button"
              onClick={handleTakeSnapshot}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-slate-950/80 inline-block animate-pulse" />
              <span>Jepret Foto Sekarang</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CalculatorSection({ onSave }: { onSave: (payload: DropoffPayload) => void }) {
  const { wasteTypes = [] as WasteItem[] } = useWaste() as { wasteTypes?: WasteItem[] };
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [selectedDropPointId, setSelectedDropPointId] = useState<string>(nearbyDropPoints[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedDropPoint =
    nearbyDropPoints.find((dp) => dp.id === selectedDropPointId) || nearbyDropPoints[0];

  const handleWeightChange = (id: string, weight: number) => {
    const clamped = Math.max(0, Math.round(weight * 10) / 10);
    setWeights((prev) => ({ ...prev, [id]: clamped }));
  };

  const handleStepWeight = (id: string, delta: number) => {
    const current = weights[id] ?? 0;
    handleWeightChange(id, current + delta);
  };

  const handleResetWeights = () => {
    setWeights({});
  };

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleCameraCapture = (dataUrl: string, filename: string) => {
    setPhotoPreview(dataUrl);
    setPhotoName(filename);
  };

  const calculateTotal = () => {
    let totalPoin = 0;
    let totalEmisi = 0;
    const calc = new CalculatorContext(new StandardCalculationStrategy());
    wasteTypes.forEach((item: WasteItem) => {
      const w = weights[item.id] ?? 0;
      if (w > 0) {
        totalPoin += calc.execute(w, item.poinPerKg);
        totalEmisi += calc.execute(w, item.emisiPerKg);
      }
    });
    return { totalPoin, totalEmisi };
  };

  const totals = calculateTotal();
  const totalWeight = Object.values(weights).reduce<number>((sum, v) => sum + Number(v || 0), 0);

  const handleTriggerSave = () => {
    if (totals.totalPoin > 0) {
      const selectedItems = wasteTypes
        .filter((item: WasteItem) => (weights[item.id] ?? 0) > 0)
        .map((item: WasteItem) => `${(weights[item.id] ?? 0).toFixed(1)} kg ${item.nama || item.name || item.id}`);

      onSave({
        totalPoin: totals.totalPoin,
        totalEmisi: Number(totals.totalEmisi.toFixed(2)),
        weight: totalWeight,
        dropPoint: selectedDropPoint.name,
        photoUrl: photoPreview,
        wasteDetail: selectedItems.join(', '),
      });
      setWeights({});
      setPhotoPreview(null);
      setPhotoName('');
    }
  };

  const wasteIconStyles: Record<string, string> = {
    plastik: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/70',
    kertas: 'bg-teal-50 text-teal-700 border-teal-200/70',
    logam: 'bg-slate-100 text-slate-600 border-slate-200/80',
    kaca: 'bg-lime-50 text-lime-700 border-lime-200/80',
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-[#edf5f0]/70 border border-emerald-900/10 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── BAGIAN 1 (KIRI - 7 KOLOM): FORMULIR SETORAN SAMPAH ── */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-emerald-950/10 shadow-xs space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-lg sm:text-xl text-emerald-950 tracking-tight leading-snug">
              Formulir Setoran Sampah
            </h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              Setoran Baru
            </span>
          </div>

          {/* 1A. Pilih Lokasi Drop Point */}
          <div className="space-y-2 relative">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <IconMapPin className="w-4 h-4 text-emerald-700" />
              <span>Pilih Lokasi Drop Point</span>
            </label>

            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full text-left bg-emerald-50/45 hover:bg-emerald-50/80 border border-emerald-300/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-emerald-950 truncate">
                  {selectedDropPoint.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  · {selectedDropPoint.distance} · Buka {selectedDropPoint.hours}
                </span>
                {selectedDropPoint.id === nearbyDropPoints[0].id && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Terdekat
                  </span>
                )}
              </div>
              <IconChevronDown
                className={`w-4 h-4 text-emerald-700 flex-shrink-0 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 z-20 mt-1 bg-white rounded-xl border border-emerald-900/15 shadow-lg overflow-hidden divide-y divide-slate-100">
                {nearbyDropPoints.map((dp, idx) => {
                  const isSelected = dp.id === selectedDropPoint.id;
                  return (
                    <button
                      key={dp.id}
                      type="button"
                      onClick={() => {
                        setSelectedDropPointId(dp.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors ${
                        isSelected ? 'bg-emerald-50/80' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{dp.name}</span>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              Terdekat
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {dp.address} · {dp.distance} · Buka {dp.hours}
                        </p>
                      </div>
                      {isSelected && <IconCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 1B. Pilih Jenis & Berat Sampah */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <IconRecycle className="w-4 h-4 text-emerald-700" />
                <span>Pilih Jenis &amp; Berat Sampah</span>
              </label>
              <button
                type="button"
                onClick={handleResetWeights}
                disabled={totalWeight === 0}
                className={`text-xs font-semibold transition-colors ${
                  totalWeight > 0
                    ? 'text-emerald-700 hover:text-emerald-900 cursor-pointer'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                Reset
              </button>
            </div>

            <div className="space-y-2.5">
              {wasteTypes.map((item: WasteItem) => {
                const weight = weights[item.id] ?? 0;
                const isActive = weight > 0;
                const iconStyle = wasteIconStyles[item.id] || 'bg-emerald-50 text-emerald-700 border-emerald-200/70';

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-emerald-50/45 border-2 border-emerald-600/45'
                        : 'bg-white border border-slate-200/90 hover:border-emerald-300/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconStyle}`}>
                        <WasteIcon id={item.id} className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 truncate leading-snug">
                          {item.nama || item.name || item.id}
                        </p>
                        <p className="text-[11px] text-slate-500 font-normal mt-0.5 tabular-nums">
                          {item.poinPerKg} Pts/kg · {item.emisiPerKg} kg CO₂
                        </p>
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStepWeight(item.id, -0.5)}
                        disabled={weight <= 0}
                        aria-label={`Kurangi berat ${item.nama || item.id}`}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors border ${
                          weight > 0
                            ? 'bg-emerald-100/70 hover:bg-emerald-200/70 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200/70 cursor-not-allowed'
                        }`}
                      >
                        −
                      </button>

                      <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 w-[74px] justify-center shadow-2xs">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={weight === 0 ? '0.0' : weight}
                          onChange={(e) => handleWeightChange(item.id, parseFloat(e.target.value) || 0)}
                          className={`w-10 text-center text-xs font-bold bg-transparent focus:outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isActive ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        />
                        <span className={`text-[11px] font-medium ml-0.5 ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                          kg
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStepWeight(item.id, 0.5)}
                        aria-label={`Tambah berat ${item.nama || item.id}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-800 border border-emerald-200/80 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── KOLOM KANAN (5 KOLOM): BUKTI FOTO & RINGKASAN SETORAN ── */}
        <div className="lg:col-span-5 space-y-5">

          {/* BAGIAN 2: Bukti Foto Setoran Sampah */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-950/10 shadow-xs space-y-4">
            <div>
              <h4 className="font-bold text-base text-emerald-950 tracking-tight leading-snug">
                Bukti Foto Setoran Sampah
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Sertakan foto dokumentasi sampah untuk mempercepat verifikasi
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-300/80 bg-emerald-50/30 transition-colors">
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="Bukti setoran" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 flex items-end justify-between p-3 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    <span className="text-white text-xs font-medium truncate max-w-[75%]">{photoName}</span>
                    <button
                      type="button"
                      onClick={() => { setPhotoPreview(null); setPhotoName(''); }}
                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow"
                      title="Hapus foto"
                    >
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 px-4 text-center">
                  <div className="inline-flex flex-col items-center gap-2">
                    <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-700">
                      <IconCamera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Dokumentasikan Bukti Sampah</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ambil foto langsung dengan kamera atau unggah dari galeri/file
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Galeri & Ambil Foto */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 transition-all border border-slate-200 shadow-2xs"
              >
                <IconUpload className="w-4 h-4 text-slate-600" />
                <span>Galeri</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#165b41] hover:bg-[#1f7353] text-white transition-all shadow-xs"
              >
                <IconCamera className="w-4 h-4" />
                <span>Ambil Foto</span>
              </button>
            </div>

            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

            <LiveCameraModal
              isOpen={isCameraOpen}
              onClose={() => setIsCameraOpen(false)}
              onCapture={handleCameraCapture}
            />
          </div>

          {/* BAGIAN 3: Ringkasan Setoran */}
          <div
            className="rounded-[15px] p-5 sm:p-6 text-white shadow-sm space-y-5 border border-emerald-700/30"
            style={{
              background: 'linear-gradient(135deg, #165b41 0%, #1b694b 55%, #1f7353 100%)',
            }}
          >
            <div>
              <h4 className="font-bold text-base text-white tracking-tight leading-snug">
                Ringkasan Setoran
              </h4>
              <p className="text-[11px] text-emerald-100/80 mt-0.5">
                Estimasi perolehan setoran Anda
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <IconStar className="w-5 h-5 text-emerald-200 flex-shrink-0" />
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-200 tracking-tight tabular-nums">
                    +{totals.totalPoin} Pts
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80 mt-1">
                  Estimasi Poin Reward
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/12 border border-white/15 text-emerald-50 tabular-nums whitespace-nowrap">
                  {totalWeight.toFixed(1)} kg Total
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/12 border border-white/15 text-emerald-50 tabular-nums whitespace-nowrap">
                  {totals.totalEmisi.toFixed(2)} kg CO₂
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTriggerSave}
              disabled={totals.totalPoin === 0}
              className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                totals.totalPoin > 0
                  ? 'bg-emerald-300 hover:bg-emerald-200 text-emerald-950 shadow-sm active:scale-[0.99]'
                  : 'bg-white/15 text-white/45 cursor-not-allowed'
              }`}
            >
              <span>Ajukan Setoran Sampah</span>
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
