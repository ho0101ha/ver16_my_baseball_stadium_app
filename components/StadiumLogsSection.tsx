import { prisma } from "@/lib/prisma"
import { computeStadiumStats } from "@/lib/stats";
import VisitedWinRat from "./home/VisitedWinRate";
import { auth } from "@/lib/auth";


export default async function StadiumLogsSection(
  
 
) {
      const session = await auth();
  const userId = session?.user?.id;
    const userData = userId ?
    await prisma.user.findUnique({
        where:{id:userId },
        include:{visits:true}
    }) : null;

    const visits = userData ?.visits || await prisma.visit.findMany({});

    const stadiumStats = await computeStadiumStats(visits);
    return (
         <section className="bg-white p-8 rounded-none border-t-4 border-slate-900 shadow-xl relative overflow-hidden ">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 transform rotate-45 translate-x-12 -translate-y-12 transition-transform "></div>
    
                <h2 className="text-xl font-black italic tracking-wider mb-6 text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-slate-900 block"></span>
                  STADIUM LOGS
                </h2>
                <VisitedWinRat stadiumStats={stadiumStats} />
              </section>
  )
}

