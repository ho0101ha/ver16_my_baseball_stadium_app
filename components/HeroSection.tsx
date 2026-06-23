import { prisma } from '@/lib/prisma';
import { computeHeroStats, computeLogStats, computeStadiumStats } from '@/lib/stats';
import { Session } from 'next-auth';
import React from 'react'
import Hero from './home/Hero';
import { auth } from '@/lib/auth';


// interface HeroSectionProos {
//     userId? :string;
//     session:Session | null;
// }
export default  async function HeroSection(
 
) {
  const session = await auth();
  const userId = session?.user?.id;
    const isLogin = !!userId;  
    const userData = userId ?
        await prisma.user.findUnique({
            where:{id:userId },
            include:{visits:true}
        }) : null;
    
        const visits = userData ?.visits || await prisma.visit.findMany({});

        const stats = await computeHeroStats(visits);
        const stadiumStats = await computeStadiumStats(visits);
        const visitedCount = stadiumStats.filter((s) => s.isVisited).length;
  return (
          <Hero
            isLogin={isLogin}
            session={session}
            visitedCount={visitedCount}
            totalWins={stats.totalWins}
            totalLosses={stats.totalLosses}
            totalDraws={stats.totalDraws}
            totalWinRate={stats.totalWinRate}
          />
  )
}

