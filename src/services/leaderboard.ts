import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface LeaderboardEntry {
  id?: string;
  playerName: string;
  level: number;
  score: number;
  timeElapsedMs: number; // Milliseconds taken (1 point subtracted per ms)
  timeRemaining?: number;
  createdAt: string;
}

export interface PercentileResult {
  percentile: number;
  topPercentage: number;
  rank: number;
  totalPlayers: number;
}

/**
 * Base score starting pot for a level.
 * From this base score, 1 point is subtracted per millisecond elapsed.
 */
export function getBaseScoreForLevel(level: number, timeLimitSeconds: number): number {
  return Math.max(150_000, (timeLimitSeconds + 60) * 1000);
}

/**
 * Calculates level score:
 * Score = Base + MatchBonuses - (1 point per millisecond elapsed)
 */
export function calculateLevelScore(
  level: number,
  timeLimitSeconds: number,
  timeElapsedMs: number,
  matchBonuses: number = 0
): number {
  const base = getBaseScoreForLevel(level, timeLimitSeconds);
  const penalty = Math.max(0, Math.round(timeElapsedMs));
  return Math.max(0, base + matchBonuses - penalty);
}

/**
 * Format milliseconds into human-readable seconds with millisecond precision
 * e.g. 8425 ms -> "8.425s", 74210 ms -> "1m 14.210s"
 */
export function formatTimeWithMs(timeElapsedMs: number): string {
  if (timeElapsedMs < 0) return '0.000s';
  const totalSeconds = timeElapsedMs / 1000;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(3)}s`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const remainingSecs = (totalSeconds % 60).toFixed(3);
  return `${mins}m ${remainingSecs.padStart(6, '0')}s`;
}

// Seed baseline entries calibrated with realistic millisecond speeds
const SEED_TITLES = [
  'Sir Galahad',
  'Dame Yvaine',
  'Master Aldous',
  'Thorin Ironbeard',
  'Lady Elenor',
  'Arch-Armorer Beric',
  'Rowan Swiftblade',
  'Gareth of the Pine',
];

function getBaselineScores(level: number): LeaderboardEntry[] {
  const timeLimitSeconds = Math.max(90, 60 + level * 20);
  const base = getBaseScoreForLevel(level, timeLimitSeconds);
  const matchBonus = level * 6500;

  // Realistic speed clears by realm champions (each ms = 1 point)
  const champMs = Math.round(level * 6200 + 1420);
  const secondMs = Math.round(level * 8600 + 2310);
  const thirdMs = Math.round(level * 11400 + 3480);
  const fourthMs = Math.round(level * 15200 + 4890);
  const fifthMs = Math.round(level * 20400 + 6650);

  return [
    {
      playerName: SEED_TITLES[0],
      level,
      score: base + matchBonus - champMs,
      timeElapsedMs: champMs,
      timeRemaining: Math.max(5, timeLimitSeconds - Math.round(champMs / 1000)),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      playerName: SEED_TITLES[1],
      level,
      score: base + matchBonus - secondMs,
      timeElapsedMs: secondMs,
      timeRemaining: Math.max(5, timeLimitSeconds - Math.round(secondMs / 1000)),
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      playerName: SEED_TITLES[2],
      level,
      score: base + matchBonus - thirdMs,
      timeElapsedMs: thirdMs,
      timeRemaining: Math.max(5, timeLimitSeconds - Math.round(thirdMs / 1000)),
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      playerName: SEED_TITLES[3],
      level,
      score: base + matchBonus - fourthMs,
      timeElapsedMs: fourthMs,
      timeRemaining: Math.max(5, timeLimitSeconds - Math.round(fourthMs / 1000)),
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      playerName: SEED_TITLES[4],
      level,
      score: base + matchBonus - fifthMs,
      timeElapsedMs: fifthMs,
      timeRemaining: Math.max(5, timeLimitSeconds - Math.round(fifthMs / 1000)),
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
  ];
}

/**
 * Submit a player's score to Firestore
 */
export async function submitScore(
  level: number,
  playerName: string,
  score: number,
  timeElapsedMs: number,
  timeRemaining?: number
): Promise<void> {
  const path = `leaderboards/${level}/entries`;
  try {
    const colRef = collection(db, 'leaderboards', level.toString(), 'entries');
    await addDoc(colRef, {
      level,
      playerName: playerName.trim() || 'Armero Anónimo',
      score,
      timeElapsedMs,
      timeRemaining: timeRemaining ?? 0,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    // Fallback: save to localStorage with new key namespace
    try {
      const localKey = `armero_scores_v3_${level}`;
      const existing: LeaderboardEntry[] = JSON.parse(localStorage.getItem(localKey) || '[]');
      existing.push({
        playerName: playerName.trim() || 'Armero Anónimo',
        level,
        score,
        timeElapsedMs,
        timeRemaining: timeRemaining ?? 0,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(localKey, JSON.stringify(existing));
    } catch {
      // ignore
    }
  }
}

/**
 * Fetch leaderboard for a given level and compute ranking with millisecond accuracy
 */
export async function getLevelLeaderboard(
  level: number,
  playerScore?: number
): Promise<{ entries: LeaderboardEntry[]; playerPercentile: PercentileResult | null }> {
  const path = `leaderboards/${level}/entries`;
  let liveEntries: LeaderboardEntry[] = [];

  try {
    const colRef = collection(db, 'leaderboards', level.toString(), 'entries');
    const q = query(colRef, orderBy('score', 'desc'), limit(50));
    const snap = await getDocs(q);

    snap.forEach((doc) => {
      const data = doc.data() as LeaderboardEntry;
      liveEntries.push({ ...data, id: doc.id });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  // Merge with localStorage scores if any (v3 only)
  try {
    const localKey = `armero_scores_v3_${level}`;
    const localEntries: LeaderboardEntry[] = JSON.parse(localStorage.getItem(localKey) || '[]');
    liveEntries = [...liveEntries, ...localEntries];
  } catch {
    // ignore
  }

  // Combine with baseline seed scores to ensure a rich competitive field
  const baselines = getBaselineScores(level);
  const combined = [...liveEntries, ...baselines];

  // Remove duplicates and sort descending by score
  const uniqueMap = new Map<string, LeaderboardEntry>();
  combined.forEach((entry) => {
    const key = `${entry.playerName}_${entry.score}_${entry.level}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, entry);
    }
  });

  const sorted = Array.from(uniqueMap.values()).sort((a, b) => b.score - a.score);

  // Compute percentile if player score provided
  let playerPercentile: PercentileResult | null = null;
  if (typeof playerScore === 'number' && playerScore > 0) {
    // 1-indexed rank in active leaderboard table
    const rank = sorted.filter((e) => e.score > playerScore).length + 1;

    const timeLimit = Math.max(90, 60 + level * 20);
    const base = getBaseScoreForLevel(level, timeLimit);
    const totalMatchBonus = level * 7500;

    // Thresholds calibrated to millisecond speed:
    // Gold (top 0.5%): clears very swiftly (champion speed)
    const goldTimeMs = Math.round(level * 7200 + 1500);
    const goldScore = base + totalMatchBonus - goldTimeMs;

    // Silver (top 2.5%): fast solve
    const silverTimeMs = Math.round(level * 9800 + 2600);
    const silverScore = base + totalMatchBonus - silverTimeMs;

    // Bronze (top 5.0%): solid clear pace
    const bronzeTimeMs = Math.round(level * 13500 + 4000);
    const bronzeScore = base + totalMatchBonus - bronzeTimeMs;

    let topPercentage: number;
    if (playerScore >= goldScore) {
      const ratio = Math.min(1, Math.max(0, (playerScore - goldScore) / Math.max(1, 15000)));
      topPercentage = Number((0.5 - ratio * 0.4).toFixed(1));
    } else if (playerScore >= silverScore) {
      const ratio = (playerScore - silverScore) / Math.max(1, goldScore - silverScore);
      topPercentage = Number((2.5 - ratio * 1.9).toFixed(1));
    } else if (playerScore >= bronzeScore) {
      const ratio = (playerScore - bronzeScore) / Math.max(1, silverScore - bronzeScore);
      topPercentage = Number((5.0 - ratio * 2.4).toFixed(1));
    } else {
      const ratio = Math.max(0, playerScore) / Math.max(1, bronzeScore);
      topPercentage = Number(Math.max(5.1, Math.min(99.0, 5.0 + (1 - ratio) * 60)).toFixed(1));
    }

    const percentile = Number((100 - topPercentage).toFixed(1));
    const totalPlayers = Math.max(1200, sorted.length * 150);

    playerPercentile = {
      percentile,
      topPercentage,
      rank,
      totalPlayers,
    };
  }

  return {
    entries: sorted.slice(0, 15),
    playerPercentile,
  };
}
