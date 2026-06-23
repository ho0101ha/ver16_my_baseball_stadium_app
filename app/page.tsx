import HeroSection from "@/components/HeroSection";
import StadiumLogsSection from "@/components/StadiumLogsSection";
import RankingSection from "@/components/RankingSection";
import {Suspense} from "react";

import {MainUserPage} from "@/components/MainUserPage";

interface OpponentStat {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: string;
}

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans antialiased text-slate-900">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-48" />
        }>
        <HeroSection />
      </Suspense>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12">
        <div className="flex flex-col gap-10">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-48" />
            }>
            <StadiumLogsSection />
          </Suspense>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-48" />
            }>
            <RankingSection />
          </Suspense>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-48" />
            }>
            <MainUserPage />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
