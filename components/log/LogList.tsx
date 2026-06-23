import { getCachedUserVisits } from '@/lib/log-data';
import { NPB_STADIUMS } from '@/lib/stadiums';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'
import LogForm from '../LogForm';
import { auth } from '@/lib/auth';

 export default async function  LogList() {
    const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }
    // const data = await  getCachedUserVisits()
    // if (!data || !data.session) {
    //     redirect("/login");
    //   }
      const userVisits = await getCachedUserVisits(session.user.id);
  return (
        <div className="space-y-4">
              {NPB_STADIUMS.map((stadium) => {
                // 現在の球場に対応するデータを特定
                const currentVisit = userVisits.find(
                  (v) => v.stadiumId === stadium.id
                );
    
                return (
                  
                      <LogForm
                        key={stadium.id}
                        stadium={stadium}
                        current={currentVisit}
                      />
                 
                );
              })}
            </div>
  )
}

