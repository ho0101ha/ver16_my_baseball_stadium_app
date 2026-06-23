import {GameLog, Visit} from "@prisma/client";
import {NPB_STADIUMS} from "./stadiums";
import {GameResult} from "./constants";
import {OpponentStat, FoodStat, StadiumStat} from "@/type";

export async function computeHeroStats(visists: Visit[]) {
  "use cache";
  const totalWins = visists.reduce((sum, v) => sum + v.wins, 0);
  const totalLosses = visists.reduce((sum, v) => sum + v.losses, 0);
  const totalDraws = visists.reduce((sum, v) => sum + v.draws, 0);
  const totalGames = totalWins + totalLosses;
  const totalWinRate =
    totalGames > 0 ? (totalWins / totalGames).toFixed(3) : ".000";

  return {
    totalWins,
    totalLosses,
    totalDraws,
    totalWinRate,
  };
}

export async function computeStadiumStats(
  visits: Visit[]
): Promise<StadiumStat[]> {
  "use cache";
  return NPB_STADIUMS.map((stadium) => {
    const records = visits.filter((v) => v.stadiumId === stadium.id);
    const wins = records.reduce((sum, r) => sum + r.wins, 0);
    const losses = records.reduce((sum, r) => sum + r.losses, 0);
    const draws = records.reduce((sum, r) => sum + r.draws, 0);
    const total = wins + losses;

    return {
      ...stadium,
      wins,
      losses,
      draws,
      winRate: total > 0 ? (wins / total).toFixed(3) : ".000",
      isVisited: wins + losses + draws > 0,
    };
  });
}

export async function computeLogStats(userLogs: GameLog[]) {
  "use cache";

  const statsMap = userLogs.reduce<Record<string, OpponentStat>>((acc, log) => {
    const name = log.opponent || "未設定";

    if (!acc[name]) {
      acc[name] = {name, wins: 0, losses: 0, draws: 0, winRate: "0.00"};
    }

    if (log.result === GameResult.WIN) {
      acc[name].wins += 1;
    }
    if (log.result === GameResult.LOSS) {
      acc[name].losses += 1;
    }
    if (log.result === GameResult.DRAW) {
      acc[name].draws += 1;
    }
    return acc;
  }, {});

  const opponentStats = Object.values(statsMap)
    .map((stat)=> {
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

  const foodMap = userLogs.reduce<
    Record<string, {name: string; count: number; ids: Set<string>}>
  >((acc, log) => {
    if (!log.food?.trim()) return acc;
    const name = log.food.trim();
    if (!acc[name]) acc[name] = {name, count: 0, ids: new Set()};
    acc[name].count += 1;
    acc[name].ids.add(log.stadiumId);
    return acc;
  }, {});

  const topFoods: FoodStat[] = Object.values(foodMap)
    .map((f) => ({
      name: f.name,
      count: f.count,
      stadiumCount: f.ids.size,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {opponentStats, topFoods};
}
