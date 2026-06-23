import {Suspense} from "react";
import QuickAddForm from "./QuickAddForm";
import NextMissionSection from "./NextMissionSection";
import OpponentSelectorSection from "./OpponentSelectorSection";
import {auth} from "@/lib/auth";

export async function MainUserPage() {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <>
      {userId && (
        <>
        
            <OpponentSelectorSection userId={userId} />
         
          <section>
         
              <QuickAddForm />
          Ï
          </section>
          
        
            <NextMissionSection userId={userId} />
    

      
        </>
      )}
    </>
  );
}
