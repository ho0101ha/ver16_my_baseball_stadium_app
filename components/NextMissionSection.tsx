import { prisma } from '@/lib/prisma';
import { computeStadiumStats } from '@/lib/stats';
import NextTarget from './NextTarget';
import { auth } from '@/lib/auth';


export default async function NextMissionSection(
  {userId}:{userId:string}

) {
  // const session = await auth();
  //     const userId = session?.user?.id;
       const userData = userId ?
        await prisma.user.findUnique({
            where:{id:userId },
            include:{visits:true}
        }) : null;
    
        const visits = userData ?.visits || [];
    
        const stadiumStats = await computeStadiumStats(visits);
  return (
     <section className="bg-white p-8 rounded-none border-l-4 border-slate-900 shadow-lg relative overflow-hidden ">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 transform rotate-45 translate-x-12 -translate-y-12 transition-transform "></div>
                   <h2 className="text-xl font-black italic tracking-wider mb-4 text-slate-900 flex items-center gap-2">
                     <span className="text-slate-300">/</span> NEXT MISSION
                   </h2>
                   <NextTarget isLogin={true} stadiumStats={stadiumStats} />
                 </section>
  )
}

