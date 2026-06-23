// components/MapContentSection.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MapWrapper from "@/components/MapWrapper";

export default async function MapContentSection() {
  // 1. ここで認証を待つ（このコンポーネントだけがストリーミングされる）
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. DBからデータを取得
  const userVisits = await prisma.visit.findMany({
    where: { userId: session.user.id },
  });

  // 3. 地図を表示
  return <MapWrapper userVisits={userVisits} />;
}