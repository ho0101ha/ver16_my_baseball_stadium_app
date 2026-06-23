'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NPB_STADIUMS } from '@/lib/stadiums';
import LogForm from '@/components/LogForm';

interface VisitData {
  id: string;
  stadiumId: string;
  wins: number;
  losses: number;
  draws: number;
  userId: string;
  visitedAt: Date;
}

/**
 * 地図のサイズを強制的に再計算するヘルパー
 * (appendChild エラーやタイルの表示崩れを防止)
 */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// アイコンをブラウザ環境でのみ安全に生成
const createIcons = () => {
  if (typeof window === 'undefined') return null;
  return {
    default: L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
    visited: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    })
  };
};

export default function MapComponent({ userVisits }: { userVisits: VisitData[] }) {
  const [selectedStadiumId, setSelectedStadiumId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const iconsRef = useRef<ReturnType<typeof createIcons>>(null);

  useEffect(() => {
    setIsMounted(true);
    if (!iconsRef.current) {
      iconsRef.current = createIcons();
    }
    return () => setIsMounted(false);
  }, []);

  if (!isMounted || !iconsRef.current) {
    return <div className="h-full w-full bg-slate-100 animate-pulse" />;
  }

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="flex-1 relative min-h-125">
        <MapContainer
          center={[36.5, 137.5]}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 地図のサイズ不整合を防ぐ */}
          <MapResizer />

          {NPB_STADIUMS.map((stadium) => {
            const currentData = userVisits.find(v => v.stadiumId === stadium.id);
            const isVisited = !!currentData;

            return (
              <Marker
                key={`${stadium.id}-${isVisited}`}
                position={[stadium.lat, stadium.lng]}
                icon={isVisited ? iconsRef.current!.visited : iconsRef.current!.default}
                eventHandlers={{
                  click: () => setSelectedStadiumId(stadium.id),
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      {selectedStadiumId && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-1001">
          <div className="bg-white rounded-xl shadow-2xl p-2 relative border border-slate-200">
            <button
              onClick={() => setSelectedStadiumId(null)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 text-white rounded-full z-1010 font-bold shadow-xl flex items-center justify-center transition-transform hover:scale-110"
            >
              ✕
            </button>
            <LogForm
              key={selectedStadiumId}
              stadium={NPB_STADIUMS.find(s => s.id === selectedStadiumId)!}
              current={userVisits.find(v => v.stadiumId === selectedStadiumId)}
            />
          </div>
        </div>
      )}
    </div>
  );
}