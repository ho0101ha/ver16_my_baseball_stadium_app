// app/map/page.tsx
import { Suspense } from "react";
import MapContentSection from "@/components/MapContentSection";

export default function MapPage() {
  return (
    <main className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden">
      {/* 認証とデータ取得が終わるまでこの fallback が表示される */}
      <Suspense fallback={
        <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
          <p className="text-slate-400 font-bold">AUTHENTICATING...</p>
        </div>
      }>
        <MapContentSection />
      </Suspense>
    </main>
  );
}