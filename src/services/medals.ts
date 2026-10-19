export type MedalType =
  | 'platinum_1'
  | 'platinum_2'
  | 'platinum_3'
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'none';

export interface LevelMedalInfo {
  level: number;
  bestScore: number;
  rank?: number;
  topPercentage?: number;
  medal: MedalType;
}

export function calculateMedal(rank?: number, topPercentage?: number): MedalType {
  if (rank === 1) return 'platinum_1';
  if (rank === 2) return 'platinum_2';
  if (rank === 3) return 'platinum_3';
  if (typeof topPercentage === 'number') {
    if (topPercentage <= 0.5) return 'gold';
    if (topPercentage <= 2.5) return 'silver';
    if (topPercentage <= 5.0) return 'bronze';
  }
  return 'none';
}

export function getMedalName(medal: MedalType, isSpanish: boolean = true): string {
  if (isSpanish) {
    switch (medal) {
      case 'platinum_1':
        return 'Medalla de Platino #1';
      case 'platinum_2':
        return 'Medalla de Platino #2';
      case 'platinum_3':
        return 'Medalla de Platino #3';
      case 'gold':
        return 'Medalla de Oro';
      case 'silver':
        return 'Medalla de Plata';
      case 'bronze':
        return 'Medalla de Bronce';
      default:
        return 'Sin medalla';
    }
  } else {
    switch (medal) {
      case 'platinum_1':
        return 'Platinum #1 Medal';
      case 'platinum_2':
        return 'Platinum #2 Medal';
      case 'platinum_3':
        return 'Platinum #3 Medal';
      case 'gold':
        return 'Gold Medal';
      case 'silver':
        return 'Silver Medal';
      case 'bronze':
        return 'Bronze Medal';
      default:
        return 'No medal';
    }
  }
}

const STORAGE_KEY_MEDALS = 'armero_level_medals_v3';

export function getSavedMedals(): Record<number, LevelMedalInfo> {
  try {
    // Clean old v1/v2 keys if present
    localStorage.removeItem('armero_level_medals_v2');
    localStorage.removeItem('armero_level_medals_v1');
    const raw = localStorage.getItem(STORAGE_KEY_MEDALS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getMedalForLevel(level: number): LevelMedalInfo | undefined {
  const all = getSavedMedals();
  return all[level];
}

export function saveLevelResult(
  level: number,
  score: number,
  rank?: number,
  topPercentage?: number
): { medal: MedalType; isNewMedal: boolean } {
  const allMedals = getSavedMedals();
  const current = allMedals[level];
  const newMedal = calculateMedal(rank, topPercentage);

  const prevBestScore = current ? current.bestScore : 0;
  const bestScore = Math.max(prevBestScore, score);

  // Determine if medal upgraded
  const rankOrder: Record<MedalType, number> = {
    none: 0,
    bronze: 1,
    silver: 2,
    gold: 3,
    platinum_3: 4,
    platinum_2: 5,
    platinum_1: 6,
  };

  const oldMedal = current ? current.medal : 'none';
  const finalMedal =
    rankOrder[newMedal] >= rankOrder[oldMedal] ? newMedal : oldMedal;

  const isNewMedal =
    rankOrder[finalMedal] > rankOrder[oldMedal] && finalMedal !== 'none';

  const isBetterRun = score >= prevBestScore || rankOrder[newMedal] > rankOrder[oldMedal];

  allMedals[level] = {
    level,
    bestScore,
    rank: isBetterRun ? rank : (current?.rank ?? rank),
    topPercentage: isBetterRun ? topPercentage : (current?.topPercentage ?? topPercentage),
    medal: finalMedal,
  };

  try {
    localStorage.setItem(STORAGE_KEY_MEDALS, JSON.stringify(allMedals));
  } catch {
    // ignore
  }

  return { medal: finalMedal, isNewMedal };
}

export interface MedalCounts {
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export function getTotalMedalCounts(): MedalCounts {
  const medals = getSavedMedals();
  let platinum = 0;
  let gold = 0;
  let silver = 0;
  let bronze = 0;

  Object.values(medals).forEach((m) => {
    if (m.medal.startsWith('platinum')) platinum++;
    else if (m.medal === 'gold') gold++;
    else if (m.medal === 'silver') silver++;
    else if (m.medal === 'bronze') bronze++;
  });

  return {
    platinum,
    gold,
    silver,
    bronze,
    total: platinum + gold + silver + bronze,
  };
}
