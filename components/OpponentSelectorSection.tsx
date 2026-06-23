import { prisma } from "@/lib/prisma";

import OpponentSelector from "@/components/OpponentSelector";
import { computeLogStats } from "@/lib/stats";


export default async function OpponentSelectorSection(
  { userId }: { userId?: string }

) {

  if (!userId) return null;


  const userLogs = await prisma.gameLog.findMany({
    where: { userId },
  });


  const { opponentStats } = await computeLogStats(userLogs);

  return (
    <section className="bg-white p-8 rounded-none border-b-4 border-slate-400 shadow-md">
      <h2 className="text-xl font-black italic tracking-wider mb-4 text-slate-900 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-slate-400 block"></span>
        OPPONENT SELECTOR
      </h2>
      <OpponentSelector stats={opponentStats} />
    </section>
  );
}