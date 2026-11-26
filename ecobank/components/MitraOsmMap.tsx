"use client";

import { useEffect, useRef, useState } from 'react';
import { mitraLocations } from '@/lib/mitraLocations';

type Coordinates = [number, number];
type LeafletBounds = object;

interface LeafletMap {
  fitBounds(bounds: LeafletBounds, options?: { padding: Coordinates; maxZoom?: number }): void;
  remove(): void;
}

interface LeafletMarker {
  addTo(map: LeafletMap): LeafletMarker;
}

interface LeafletLayer {
  addTo(map: LeafletMap): LeafletLayer;
}

interface LeafletApi {
  map(element: HTMLElement, options: {
    center: Coordinates;
    zoom: number;
    scrollWheelZoom: boolean;
  }): LeafletMap;
  tileLayer(url: string, options: {
    attribution: string;
    maxZoom: number;
  }): LeafletLayer;
  marker(position: Coordinates, options: {
    title: string;
    alt: string;
    icon: object;
  }): LeafletMarker;
  divIcon(options: {
    className: string;
    html: string;
    iconSize: Coordinates;
    iconAnchor: Coordinates;
  }): object;
  latLngBounds(points: Coordinates[]): LeafletBounds;
}

type WindowWithLeaflet = Window & { L?: LeafletApi };

let leafletPromise: Promise<LeafletApi> | null = null;

function loadLeaflet(): Promise<LeafletApi> {
  const leaflet = (window as WindowWithLeaflet).L;
  if (leaflet) return Promise.resolve(leaflet);
  if (leafletPromise) return leafletPromise;

  if (!document.querySelector('link[data-ecobank-leaflet]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    stylesheet.dataset.ecobankLeaflet = 'true';
    document.head.appendChild(stylesheet);
  }

  leafletPromise = new Promise<LeafletApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.dataset.ecobankLeaflet = 'true';
    script.onload = () => {
      const loadedLeaflet = (window as WindowWithLeaflet).L;
      if (loadedLeaflet) {
        resolve(loadedLeaflet);
      } else {
        reject(new Error('Pustaka peta OpenStreetMap tidak tersedia setelah dimuat.'));
      }
    };
    script.onerror = () => reject(new Error('Pustaka peta gagal dimuat. Periksa koneksi internet.'));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    leafletPromise = null;
    document.querySelector('script[data-ecobank-leaflet]')?.remove();
    throw error;
  });

  return leafletPromise;
}

export default function MitraOsmMap() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    if (!mapElementRef.current) return;
    let cancelled = false;

    const initializeMap = async () => {
      try {
        const leaflet = await loadLeaflet();
        if (cancelled || !mapElementRef.current) return;

        const map = leaflet.map(mapElementRef.current, {
          center: [4.7, 96.2],
          zoom: 7,
          scrollWheelZoom: false,
        });
        mapRef.current = map;
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        const points: Coordinates[] = mitraLocations.map(
          (location): Coordinates => [location.latitude, location.longitude],
        );

        mitraLocations.forEach((location, index) => {
          const icon = leaflet.divIcon({
            className: '',
            html: `<span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:2px solid #fff;border-radius:50% 50% 50% 0;background:#047857;color:#fff;font:700 13px/1 Arial,sans-serif;box-shadow:0 2px 6px rgba(15,23,42,.35);transform:rotate(-45deg)"><span style="transform:rotate(45deg)">${index + 1}</span></span>`,
            iconSize: [34, 34],
            iconAnchor: [17, 34],
          });
          leaflet.marker(points[index], {
            title: location.name,
            alt: `Pin lokasi ${location.name}`,
            icon,
          }).addTo(map);
        });

        map.fitBounds(leaflet.latLngBounds(points), { padding: [32, 32], maxZoom: 11 });
      } catch (error: unknown) {
        if (!cancelled) {
          setMapError(error instanceof Error ? error.message : 'Peta OpenStreetMap gagal dimuat.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void initializeMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={mapElementRef}
        className="h-[280px] w-full bg-slate-100 sm:h-[340px]"
        aria-label="Peta yang menampilkan pin semua lokasi bank sampah"
      />
      {isLoading && (
        <div className="absolute left-3 top-3 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-sm">
          <p role="status">Memuat peta dan pin lokasi…</p>
        </div>
      )}
      {!isLoading && mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 p-5 text-center">
          <p className="max-w-md text-sm leading-relaxed text-red-800" role="alert">{mapError}</p>
        </div>
      )}
    </div>
  );
}
