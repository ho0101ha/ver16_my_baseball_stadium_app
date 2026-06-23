import { auth } from "@/lib/auth";
import { getCachedStadiumData } from "@/lib/stadium-cache";
import { GameResult } from "@/lib/constants";
import { NPB_STADIUMS } from "@/lib/stadiums";

// UI Components (既存のものをインポート)
import LogForm from "@/components/LogForm";
import OpponentStats from "@/components/OpponentStats";
import FoodRanking from "@/components/home/FoodRanking";
import TopOpponents from "@/components/TopOpponents";
import QuickAddForm from "@/components/QuickAddForm";
import DeleteLogButton from "@/components/DeleteLogButton";
import EditLogModal from "@/components/EditLogModal";

export async function StadiumStatsSection({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return null;

  const stadium = NPB_STADIUMS.find((s) => s.id === id)!;
  const { visit, logs, opponentStats, chartDate, topFoods } = 
    await getCachedStadiumData(id, session.user.id);

  const maxGames = Math.max(...chartDate.map((d) => d.total), 1);

  return (
    <>
      <section className="bg-white p-8 shadow-lg border border-slate-200">
        <h3 className="text-lg font-black italic text-slate-800 uppercase mb-8 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-slate-900 block" />曜日別
        </h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {chartDate.map((data) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full max-w-8 flex flex-col-reverse h-24 bg-slate-100 overflow-hidden">
                <div style={{ height: `${(data.wins / maxGames) * 100}%` }} className="bg-blue-600" />
                <div style={{ height: `${(data.losses / maxGames) * 100}%` }} className="bg-red-500" />
                <div style={{ height: `${(data.draws / maxGames) * 100}%` }} className="bg-slate-400" />
              </div>
              <p className="text-xs font-black">{data.day}</p>
            </div>
          ))}
        </div>
      </section>

      {opponentStats.length > 0 && <TopOpponents stats={opponentStats.slice(0, 3)} />}
      <OpponentStats opponentStats={opponentStats} stadiumName={stadium.name} />
      {topFoods.length > 0 && <FoodRanking foods={topFoods as any} />}
      
      <QuickAddForm stadiumId={id} />

      <section className="bg-white p-6 shadow-lg border border-slate-200">
        <LogForm stadium={stadium} current={visit || undefined} />
      </section>

      <section className="pb-10">
        <h3 className="text-xl font-black italic mb-6 px-4">観戦歴</h3>
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white p-5 border border-slate-200 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 flex items-center justify-center font-black text-white ${
                  log.result === GameResult.WIN ? "bg-blue-600" : 
                  log.result === GameResult.LOSS ? "bg-red-500" : "bg-slate-400"
                }`}>
                  {log.result[0]}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">{new Date(log.date).toLocaleDateString()}</p>
                  <p className="font-bold">vs {log.opponent || "不明"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <EditLogModal log={log} />
                <DeleteLogButton logId={log.id} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}