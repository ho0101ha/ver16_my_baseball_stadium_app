
import { Suspense } from "react";
import Admin from "@/components/admin/Admin";

export default  function AdminPage() {
 
    return (
  <>
  <Suspense>
    <Admin/>
  </Suspense>
  </>
  );
}