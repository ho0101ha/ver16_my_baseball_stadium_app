import { prisma } from "@/lib/prisma";

import FoodRanking from "@/components/home/FoodRanking";
import TopOpponents from "@/components/TopOpponents";
import { computeLogStats } from "@/lib/stats";
import { auth } from "@/lib/auth";

export default async function RankingSection(

) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const userLogs = await prisma.gameLog.findMany({ where: { userId } });
  const { opponentStats, topFoods } = await computeLogStats(userLogs);

  const topOpponents = opponentStats.slice(0, 3);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {topFoods.length > 0 && (
        <div className="bg-white p-6 rounded-none border border-slate-200 relative shadow-md">
          <div className="absolute top-0 left-0 bg-slate-900 h-1.5 w-16"></div>
          <h2 className="text-lg font-black italic tracking-widest mb-4 text-slate-800 flex items-center gap-2">
            <span className="text-slate-300">/</span> STADIUM GOURMET
          </h2>
          <FoodRanking foods={topFoods} />
        </div>
      )}
      {topOpponents.length > 0 && (
        <div className="bg-white p-6 rounded-none border border-slate-200 relative shadow-md">
          <div className="absolute top-0 left-0 bg-slate-900 h-1.5 w-16"></div>
          <h2 className="text-lg font-black italic tracking-widest mb-4 text-slate-800 flex items-center gap-2">
            <span className="text-slate-300">/</span> MATCHUP TOP 3
          </h2>
          <TopOpponents stats={topOpponents} />
        </div>
      )}
    </section>
  );
}