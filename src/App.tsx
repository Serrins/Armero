/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameScreen,
  ItemInstance,
  Language,
  LevelConfig,
  Stand,
} from './types/game';
import { generateInitialStands, getLevelConfig } from './services/levelGenerator';
import { soundscape } from './services/soundscape';
import { t } from './services/translations';
import {
  submitScore,
  getLevelLeaderboard,
  calculateLevelScore,
  getBaseScoreForLevel,
} from './services/leaderboard';
import { saveLevelResult, getMedalForLevel, MedalType } from './services/medals';
import { ArmoryShelf } from './components/ArmoryShelf';
import { GameHUD } from './components/GameHUD';
import { TitleScreen } from './components/TitleScreen';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { PauseModal } from './components/PauseModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { AmbientEffects } from './components/AmbientEffects';
import { BottomNavBar, MainNavTab } from './components/BottomNavBar';
import { FriendsView } from './components/FriendsView';
import { AchievementsView } from './components/AchievementsView';

const STORAGE_KEY_LEVEL = 'armero_highest_level';
const STORAGE_KEY_LANG = 'armero_language';
const STORAGE_KEY_NAME = 'armero_player_name';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('TITLE_MENU');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [highestLevel, setHighestLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEVEL);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      return saved === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_NAME) || 'Escudero Eric';
    } catch {
      return 'Escudero Eric';
    }
  });

  // Current Level-Only Score (1 point subtracted per millisecond elapsed)
  const [levelScore, setLevelScore] = useState<number>(0);
  const [baseLevelScore, setBaseLevelScore] = useState<number>(() => getBaseScoreForLevel(1, 90));
  const [timeElapsedMs, setTimeElapsedMs] = useState<number>(0);
  const [matchPointsEarned, setMatchPointsEarned] = useState<number>(0);
  const [latestScoreAddition, setLatestScoreAddition] = useState<{
    points: number;
    isSpeedBonus: boolean;
  } | null>(null);
  const [latestEarnedMedal, setLatestEarnedMedal] = useState<MedalType>('none');
  const [latestTopPercentage, setLatestTopPercentage] = useState<number | undefined>(undefined);

  // Modals state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [mainTab, setMainTab] = useState<MainNavTab>('home');

  const lastMatchTimestampRef = useRef<number>(Date.now());
  const scorePopupTimerRef = useRef<number | null>(null);
  const isMatchingRef = useRef<boolean>(false);

  // Performance timer & bonuses tracking
  const levelStartPerfRef = useRef<number>(performance.now());
  const matchBonusesRef = useRef<number>(0);

  // Synchronized refs to avoid infinite re-renders
  const levelScoreRef = useRef<number>(0);
  const currentLevelRef = useRef<number>(1);
  const playerNameRef = useRef<string>('Escudero Eric');
  const timeLeftRef = useRef<number>(120);

  const [config, setConfig] = useState<LevelConfig>(() => getLevelConfig(1));
  const [stands, setStands] = useState<Stand[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    standId: number;
    item: ItemInstance;
    index: number;
  } | null>(null);

  const [matchingStandIds, setMatchingStandIds] = useState<number[]>([]);
  const [burstTrigger, setBurstTrigger] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundscape.getIsMuted());

  // Clean out any old legacy accumulated cross-session and obsolete scores
  useEffect(() => {
    try {
      localStorage.removeItem('armero_session_score');
      localStorage.removeItem('armero_game_mode');
      localStorage.removeItem('armero_level_medals_v2');
      localStorage.removeItem('armero_level_medals_v1');
      for (let i = 1; i <= 18; i++) {
        localStorage.removeItem(`armero_local_scores_${i}`);
      }
    } catch {
      // ignore
    }
  }, []);

  // Keep refs synchronized
  useEffect(() => {
    currentLevelRef.current = currentLevel;
  }, [currentLevel]);
  useEffect(() => {
    playerNameRef.current = playerName;
  }, [playerName]);

  const handleUpdatePlayerName = (newName: string) => {
    setPlayerName(newName);
    playerNameRef.current = newName;
    try {
      localStorage.setItem(STORAGE_KEY_NAME, newName);
    } catch {
      // ignore
    }
  };

  // Initialize or restart level: Resets score and starts high-precision performance timer
  const startLevel = useCallback(
    (lvl: number) => {
      const newConfig = getLevelConfig(lvl);
      const initialStands = generateInitialStands(newConfig);
      const base = getBaseScoreForLevel(lvl, newConfig.timeLimitSeconds);

      isMatchingRef.current = false;
      setConfig(newConfig);
      setCurrentLevel(lvl);
      currentLevelRef.current = lvl;
      setStands(initialStands);
      setSelectedItem(null);
      setMatchingStandIds([]);
      timeLeftRef.current = newConfig.timeLimitSeconds;
      setBaseLevelScore(base);
      matchBonusesRef.current = 0;
      setMatchPointsEarned(0);
      levelStartPerfRef.current = performance.now();
      setTimeElapsedMs(0);
      setLevelScore(base);
      levelScoreRef.current = base;
      setLatestEarnedMedal('none');
      setLatestTopPercentage(undefined);
      lastMatchTimestampRef.current = Date.now();
      setScreen('PLAYING');

      if (!soundscape.getIsAmbienceActive() && !isMuted) {
        soundscape.startAmbience();
      }
    },
    [isMuted]
  );

  // Live millisecond score countdown ticker while playing: subtracts 1 pt per millisecond
  useEffect(() => {
    if (screen !== 'PLAYING') return;

    const interval = window.setInterval(() => {
      const elapsed = Math.round(performance.now() - levelStartPerfRef.current);
      const currentScore = calculateLevelScore(
        currentLevelRef.current,
        config.timeLimitSeconds,
        elapsed,
        matchBonusesRef.current
      );
      setLevelScore(currentScore);
      levelScoreRef.current = currentScore;
      setTimeElapsedMs(elapsed);
    }, 80);

    return () => clearInterval(interval);
  }, [screen, config.timeLimitSeconds]);

  // Pure event-driven match evaluator (called directly upon moves, never in uncontrolled loops)
  const checkAndHandleMatches = useCallback((currentStands: Stand[]) => {
    if (isMatchingRef.current) return;

    const newlyMatched: number[] = [];

    currentStands.forEach((stand) => {
      if (stand.items.length === 3) {
        const firstType = stand.items[0].type;
        const allSame = stand.items.every((it) => it.type === firstType);
        if (allSame) {
          newlyMatched.push(stand.id);
        }
      }
    });

    if (newlyMatched.length === 0) return;

    isMatchingRef.current = true;
    setMatchingStandIds(newlyMatched);
    soundscape.playMatch3();
    setBurstTrigger((prev) => prev + 1);

    // Calculate Match Speed Score for this level
    const now = Date.now();
    const secondsSinceLastAction = (now - lastMatchTimestampRef.current) / 1000;
    lastMatchTimestampRef.current = now;

    const baseMatchPoints = 5000;
    let speedBonus = 0;
    let isSpeedBonus = false;

    if (secondsSinceLastAction <= 3.5) {
      speedBonus = 2500; // Fast speed bonus
      isSpeedBonus = true;
    } else if (secondsSinceLastAction <= 7.0) {
      speedBonus = 1000;
      isSpeedBonus = true;
    }

    const totalEarnedForMatch = (baseMatchPoints + speedBonus) * newlyMatched.length;
    matchBonusesRef.current += totalEarnedForMatch;
    setMatchPointsEarned(matchBonusesRef.current);

    // Update live score immediately
    const elapsedNow = Math.round(performance.now() - levelStartPerfRef.current);
    const updatedScore = calculateLevelScore(
      currentLevelRef.current,
      config.timeLimitSeconds,
      elapsedNow,
      matchBonusesRef.current
    );
    setLevelScore(updatedScore);
    levelScoreRef.current = updatedScore;

    // Show floating score indicator
    if (scorePopupTimerRef.current) clearTimeout(scorePopupTimerRef.current);
    setLatestScoreAddition({ points: totalEarnedForMatch, isSpeedBonus });
    scorePopupTimerRef.current = window.setTimeout(() => {
      setLatestScoreAddition(null);
    }, 1500);

    // Clear matched items after glowing aura animation settles
    setTimeout(() => {
      setStands((prev) => {
        const updated = prev.map((s) => {
          if (newlyMatched.includes(s.id)) {
            return {
              ...s,
              items: [],
            };
          }
          return s;
        });

        // Check if board is cleared!
        const remainingItems = updated.reduce((acc, s) => acc + s.items.length, 0);
        if (remainingItems === 0) {
          soundscape.playVictory();

          const exactElapsedMs = Math.round(performance.now() - levelStartPerfRef.current);
          setTimeElapsedMs(exactElapsedMs);

          // Total score for this level run alone:
          // Base + MatchBonuses - (1 point per millisecond elapsed)
          const finalLevelScore = calculateLevelScore(
            currentLevelRef.current,
            config.timeLimitSeconds,
            exactElapsedMs,
            matchBonusesRef.current
          );

          setLevelScore(finalLevelScore);
          levelScoreRef.current = finalLevelScore;

          // Submit to Firestore Leaderboard and evaluate rank & medal achievements
          submitScore(
            currentLevelRef.current,
            playerNameRef.current,
            finalLevelScore,
            exactElapsedMs,
            timeLeftRef.current
          )
            .then(() => getLevelLeaderboard(currentLevelRef.current, finalLevelScore))
            .then(({ playerPercentile }) => {
              if (playerPercentile) {
                const { medal } = saveLevelResult(
                  currentLevelRef.current,
                  finalLevelScore,
                  playerPercentile.rank,
                  playerPercentile.topPercentage
                );
                setLatestEarnedMedal(medal);
                setLatestTopPercentage(playerPercentile.topPercentage);
              }
            })
            .catch((e) => console.warn('Leaderboard/medal sync:', e));

          setScreen('LEVEL_COMPLETE');
          setHighestLevel((oldHighest) => {
            const next = Math.max(oldHighest, currentLevelRef.current + 1);
            try {
              localStorage.setItem(STORAGE_KEY_LEVEL, next.toString());
            } catch {
              // ignore
            }
            return next;
          });
        }

        return updated;
      });

      setMatchingStandIds([]);
      isMatchingRef.current = false;
    }, 450);
  }, [config.timeLimitSeconds]);

  // Select an item or move to stand
  const handleSelectItem = (standId: number, item: ItemInstance, index: number) => {
    if (isMatchingRef.current || matchingStandIds.length > 0) return;

    if (!selectedItem) {
      setSelectedItem({ standId, item, index });
      soundscape.playPick();
    } else if (selectedItem.standId === standId && selectedItem.index === index) {
      setSelectedItem(null);
      soundscape.playPick();
    } else {
      handleMoveToStand(standId);
    }
  };

  // Move selected or dragged item into target stand
  const handleMoveToStand = (
    targetStandId: number,
    sourceItem?: { standId: number; item: ItemInstance; index: number }
  ) => {
    const itemToMove = sourceItem || selectedItem;
    if (!itemToMove || isMatchingRef.current || matchingStandIds.length > 0) return;
    if (itemToMove.standId === targetStandId) {
      setSelectedItem(null);
      return;
    }

    const targetStand = stands.find((s) => s.id === targetStandId);
    if (!targetStand || targetStand.items.length >= 3) {
      return;
    }

    const nextStands = stands.map((s) => {
      if (s.id === itemToMove.standId) {
        const newItems = [...s.items];
        newItems.splice(itemToMove.index, 1);
        return { ...s, items: newItems };
      }
      if (s.id === targetStandId) {
        return { ...s, items: [...s.items, itemToMove.item] };
      }
      return s;
    });

    setStands(nextStands);
    soundscape.playDrop();
    setSelectedItem(null);

    // Directly evaluate matches on user movement
    checkAndHandleMatches(nextStands);
  };

  const handleToggleMute = () => {
    const muted = soundscape.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, nextLang);
    } catch {
      // ignore
    }
  };

  const strings = t(language);

  return (
    <main className="relative w-full h-full min-h-screen bg-stone-950 text-amber-100 flex flex-col justify-between overflow-x-hidden">
      {/* Background Medieval Forest Armory Image */}
      <div
        className="fixed inset-0 bg-cover bg-center brightness-[0.4] filter saturate-125 pointer-events-none"
        style={{
          backgroundImage: `url(/src/assets/images/cozy_forest_armory_1792343200435.jpg)`,
        }}
      />

      {/* Floating Forest Fireflies & Match 3 Particle Explosions */}
      <AmbientEffects burstTrigger={burstTrigger} />

      {/* Title / Main Screen Tabs */}
      {screen === 'TITLE_MENU' && (
        <div className="relative z-10 w-full h-screen h-[100dvh] max-h-screen flex flex-col justify-between overflow-hidden">
          {/* Top Corner Controls when on Friends or Achievements */}
          {mainTab !== 'home' && (
            <div className="w-full max-w-lg mx-auto flex items-center justify-between px-4 pt-3 select-none shrink-0 z-20">
              {/* Left side: Language Toggle Switch (ES / EN) */}
              <button
                onClick={() => {
                  handleToggleLanguage();
                  soundscape.playPick();
                }}
                title={strings.languageLabel}
                className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-600/40 text-amber-200 text-xs font-cinzel font-bold flex items-center gap-1 hover:border-amber-400 transition-colors cursor-pointer"
              >
                <span className={language === 'es' ? 'text-amber-300 font-extrabold' : 'text-stone-400'}>
                  ES
                </span>
                <span className="text-amber-700">/</span>
                <span className={language === 'en' ? 'text-amber-300 font-extrabold' : 'text-stone-400'}>
                  EN
                </span>
              </button>

              {/* Right side: Audio Toggle */}
              <button
                onClick={() => {
                  handleToggleMute();
                  soundscape.startAmbience();
                }}
                className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-600/40 text-amber-200 text-xs font-cinzel flex items-center gap-1.5 hover:border-amber-400 transition-colors cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    <span>{strings.soundMuted}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-emerald-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>{strings.soundActive}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab 1: Amigos */}
          {mainTab === 'friends' && (
            <FriendsView
              playerName={playerName}
              language={language}
            />
          )}

          {/* Tab 2: Home */}
          {mainTab === 'home' && (
            <TitleScreen
              onStartGame={() => startLevel(1)}
              onOpenLevelSelect={() => setScreen('LEVEL_SELECT')}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              highestLevel={highestLevel}
              language={language}
              onToggleLanguage={handleToggleLanguage}
            />
          )}

          {/* Tab 3: Logros */}
          {mainTab === 'achievements' && (
            <AchievementsView
              highestLevel={highestLevel}
              language={language}
              onSelectLevel={(lvl) => startLevel(lvl)}
            />
          )}

          {/* Bottom Navigation Bar */}
          <BottomNavBar
            activeTab={mainTab}
            onChangeTab={(t) => setMainTab(t)}
            language={language}
          />
        </div>
      )}

      {/* Active Game Play: Shows current level score */}
      {screen === 'PLAYING' && (
        <div className="relative z-10 flex flex-col justify-between min-h-screen max-w-lg mx-auto w-full py-1">
          {/* Top Plaque Header with Level Score, Medal Status & Leaderboard Access */}
          <GameHUD
            levelNumber={config.level}
            sessionScore={levelScore}
            latestScoreAddition={latestScoreAddition}
            medalInfo={getMedalForLevel(config.level)}
            isMuted={isMuted}
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onToggleMute={handleToggleMute}
            onOpenMenu={() => setScreen('PAUSED')}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />

          {/* Center Playfield: The Armory Bookcase Stand */}
          <section aria-label="Armory shelves" className="flex-1 flex flex-col items-center justify-center my-auto w-full">
            <ArmoryShelf
              stands={stands}
              columns={config.columns}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              onMoveToStand={handleMoveToStand}
              matchingStandIds={matchingStandIds}
            />

            {/* In-game helper note */}
            <div className="text-center mt-3 px-4 pointer-events-none">
              <span className="text-xs font-cinzel text-amber-200/80 drop-shadow">
                {currentLevel === 1
                  ? strings.level1Hint
                  : strings.levelNHint(currentLevel)}
              </span>
            </div>
          </section>

          {/* Subtle bottom spacing */}
          <div className="h-6" />
        </div>
      )}

      {/* Pause & Settings Modal */}
      {screen === 'PAUSED' && (
        <PauseModal
          currentLevel={currentLevel}
          isMuted={isMuted}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onToggleMute={handleToggleMute}
          onResume={() => setScreen('PLAYING')}
          onRestart={() => startLevel(currentLevel)}
          onOpenLevelSelect={() => setScreen('LEVEL_SELECT')}
          onExitToMenu={() => setScreen('TITLE_MENU')}
        />
      )}

      {/* Level Complete / Victory Modal: Millisecond-based score of this level run */}
      {screen === 'LEVEL_COMPLETE' && (
        <VictoryModal
          completedLevel={currentLevel}
          baseScore={baseLevelScore}
          matchPointsEarned={matchPointsEarned}
          timeElapsedMs={timeElapsedMs}
          finalLevelScore={levelScore}
          earnedMedal={latestEarnedMedal}
          topPercentage={latestTopPercentage}
          language={language}
          onSelectLevel={() => {
            setScreen('TITLE_MENU');
            setMainTab('achievements');
          }}
          onReplayLevel={() => startLevel(currentLevel)}
          onOpenMenu={() => setScreen('TITLE_MENU')}
        />
      )}

      {/* Level Select Modal */}
      {screen === 'LEVEL_SELECT' && (
        <LevelSelectModal
          highestLevel={highestLevel}
          currentLevel={currentLevel}
          language={language}
          onSelectLevel={(lvl) => startLevel(lvl)}
          onClose={() => setScreen(stands.length > 0 ? 'PLAYING' : 'TITLE_MENU')}
        />
      )}

      {/* Global Leaderboard & Percentile Modal */}
      {isLeaderboardOpen && (
        <LeaderboardModal
          initialLevel={currentLevel}
          highestLevel={highestLevel}
          currentScore={levelScore}
          playerName={playerName}
          onUpdatePlayerName={handleUpdatePlayerName}
          language={language}
          onClose={() => setIsLeaderboardOpen(false)}
        />
      )}

      {/* Achievements & Medals Modal */}
      {isAchievementsOpen && (
        <AchievementsModal
          highestLevel={highestLevel}
          language={language}
          onSelectLevel={(lvl) => {
            setIsAchievementsOpen(false);
            startLevel(lvl);
          }}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}
    </main>
  );
}
