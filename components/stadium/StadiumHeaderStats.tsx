import { auth } from "@/lib/auth";
import { getCachedStadiumData } from "@/lib/stadium-cache";
import StatsSwitcher from "@/components/StatsSwitcher";

export async function StadiumHeaderStats({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params; // ここで解決
  const session = await auth();
  if (!session?.user?.id) return null;

  const { visit, logs, totalGames } = await getCachedStadiumData(id, session.user.id);

  return (
    <div className="p-4">
      <StatsSwitcher logs={logs} visit={visit} />
      <div className="bg-white p-6 text-center border border-slate-200 mt-4">
        <p className="text-xs font-black text-slate-400 uppercase">Total Games</p>
        <p className="text-3xl font-black italic">{totalGames}</p>
      </div>
    </div>
  );
}