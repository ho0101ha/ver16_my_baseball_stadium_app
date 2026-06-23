import Account from "@/components/Account";
import { Suspense } from "react";




export default  function Accountpage() {
    
  return (
    <div className="min-h-screen bg-slate-50">
        <Suspense>
        <Account/>
        </Suspense>
       
       
        
    </div>
  )
}

