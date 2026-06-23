"use client";

import dynamic from 'next/dynamic';

interface VisitData {
  id: string;
  stadiumId: string;
  wins: number;
  losses: number;
  draws: number;
  userId: string;
  visitedAt: Date;
}

// MapComponentをSSR: falseで読み込む
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-slate-400 font-black uppercase tracking-widest text-sm">Map Loading...</span>
      </div>
    </div>
  )
});

export default function MapWrapper({ userVisits }: { userVisits: VisitData[] }) {
  return (
    <div className="h-full w-full relative">
      {/* keyを固定値またはデータに基づいた値にすることで、コンポーネントの確実なクリーンアップを促します */}
      <MapComponent key="stadium-map-main" userVisits={userVisits} />
    </div>
  );
}