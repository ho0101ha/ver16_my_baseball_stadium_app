import { prisma } from "@/lib/prisma";

export async function getCachedUserVisits(userId: string) {
  "use cache";
  // 配列を直接返すようにします
  return await prisma.visit.findMany({
    where: { userId },
  });
}