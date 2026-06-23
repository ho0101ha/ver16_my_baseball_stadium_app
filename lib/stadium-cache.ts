import { prisma } from "./prisma";
import { GameResult } from "./constants";
import { OpponentStat } from "@/type";

export async function getCachedStadiumData(stadiumId: string, userId: string) {
  "use cache";

  const [visit, allLogs] = await Promise.all([
    prisma.visit.findUnique({
      where: { userId_stadiumId: { userId, stadiumId } },
    }),
    prisma.gameLog.findMany({
      where: { userId, stadiumId },
      orderBy: { date: "desc" },
    }),
  ]);

  const displayLogs = allLogs.filter(l => l.comment !== "AUTO_GENERATED");

  // 1. 対戦相手別集計 (reduceを使用)
  const statsMap = allLogs.reduce((acc, log) => {
    const name = log.opponent || "未設定";
    if (!acc[name]) acc[name] = { name, wins: 0, losses: 0, draws: 0 };
    
    if (log.result === GameResult.WIN) acc[name].wins++;
    else if (log.result === GameResult.LOSS) acc[name].losses++;
    else if (log.result === GameResult.DRAW) acc[name].draws++;
    
    return acc;
  }, {} as Record<string, Omit<OpponentStat, "winRate">>);

  const opponentStats = Object.values(statsMap)
    .map((stat) => {
      const total = stat.wins + stat.losses;
    // 1. 勝率を計算（分母が0なら0、そうでなければ少数第3位まで）
    const rate = total > 0 ? (stat.wins / total).toFixed(3) : "0.000";
    
    return {
      ...stat,
      // 2. 表示用に "0.xxx" を ".xxx" に変換
      winRate: rate.replace(/^0/, ""),
    };
  })
  // 3. sort は文字列の winRate ではなく、数値として比較を行う
  .sort((a, b) => parseFloat(b.winRate || "0") - parseFloat(a.winRate || "0"));

  
    //   const total = stat.wins + stat.losses;
    //   return { ...stat, winRate: total > 0 ? (stat.wins / total).toFixed(3).replace(/^0/, "") : ".000" };
    // })
    // .sort((a, b) =>  Number(b.winRate) - Number(a.winRate));

  // 2. 曜日別集計 (既存のロジックを維持)
  const DAYS = ["日", "月", "火", "水", "木", "金", "土"];
  const chartDate = DAYS.map((day) => {
    const dayLogs = displayLogs.filter((l) => DAYS[new Date(l.date).getDay()] === day);
    return {
      day,
      total: dayLogs.length,
      wins: dayLogs.filter((l) => l.result === GameResult.WIN).length,
      losses: dayLogs.filter((l) => l.result === GameResult.LOSS).length,
      draws: dayLogs.filter((l) => l.result === GameResult.DRAW).length,
    };
  });

  // 3. 球場飯集計 (reduceを使用)
  const foodCounts = allLogs.reduce((acc, log) => {
    if (log.food) {
      const name = log.food.trim();
      acc[name] = (acc[name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topFoods = Object.entries(foodCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    visit,
    logs: displayLogs,
    opponentStats,
    chartDate,
    topFoods,
    totalGames: (visit?.wins || 0) + (visit?.losses || 0) + (visit?.draws || 0),
  };
}

// import { prisma } from "./prisma";
// import { GameResult } from "./constants";

// export interface OpponentStat {
//   name: string;
//   wins: number;
//   losses: number;
//   draws: number;
//   winRate: string;
// }

// export interface DayStat {
//   day: string;
//   total: number;
//   wins: number;
//   losses: number;
//   draws: number;
// }

// export async function getCachedStadiumData(stadiumId: string, userId: string) {
//   "use cache"; 

//   const [visit, allLogs] = await Promise.all([
//     prisma.visit.findUnique({
//       where: { userId_stadiumId: { userId, stadiumId } },
//     }),
//     prisma.gameLog.findMany({
//       where: { userId, stadiumId },
//       orderBy: { date: "desc" },
//     }),
//   ]);

//   // 表示用（自動生成コメントを除外）
//   const displayLogs = allLogs.filter(l => l.comment !== "AUTO_GENERATED");

//   // 対戦相手別集計
//   const statsMap: Record<string, Omit<OpponentStat, "winRate">> = {};
//   allLogs.forEach((log) => {
//     const name = log.opponent || "未設定";
//     if (!statsMap[name]) statsMap[name] = { name, wins: 0, losses: 0, draws: 0 };
//     if (log.result === GameResult.WIN) statsMap[name].wins++;
//     else if (log.result === GameResult.LOSS) statsMap[name].losses++;
//     else if (log.result === GameResult.DRAW) statsMap[name].draws++;
//   });

//   const opponentStats = Object.values(statsMap)
//     .map((stat) => {
//       const total = stat.wins + stat.losses;
//       return { ...stat, winRate: total > 0 ? (stat.wins / total).toFixed(3) : ".000" };
//     })
//     .sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));

//   // 曜日別集計
//   const DAYS = ["日", "月", "火", "水", "木", "金", "土"];
//   const chartDate = DAYS.map((day) => {
//     const dayLogs = displayLogs.filter((l) => DAYS[new Date(l.date).getDay()] === day);
//     return {
//       day,
//       total: dayLogs.length,
//       wins: dayLogs.filter((l) => l.result === GameResult.WIN).length,
//       losses: dayLogs.filter((l) => l.result === GameResult.LOSS).length,
//       draws: dayLogs.filter((l) => l.result === GameResult.DRAW).length,
//     };
//   });

//   // 球場飯
//   const foodMap: Record<string, number> = {};
//   allLogs.forEach((log) => {
//     if (log.food) {
//       const name = log.food.trim();
//       foodMap[name] = (foodMap[name] || 0) + 1;
//     }
//   });
//   const topFoods = Object.entries(foodMap)
//     .map(([name, count]) => ({ name, count }))
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 5);

//   return {
//     visit,
//     logs: displayLogs,
//     opponentStats,
//     chartDate,
//     topFoods,
//     totalGames: (visit?.wins || 0) + (visit?.losses || 0) + (visit?.draws || 0),
//   };
// }