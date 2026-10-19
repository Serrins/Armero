import React from 'react';
import { ItemGraphic } from './ItemGraphic';
import { getLevelConfig } from '../services/levelGenerator';
import { ITEM_DEFINITIONS } from '../data/items';
import { Language } from '../types/game';
import { t } from '../services/translations';
import { MedalType } from '../services/medals';
import { MedalGraphic } from './MedalGraphic';
import { formatTimeWithMs } from '../services/leaderboard';

interface VictoryModalProps {
  completedLevel: number;
  baseScore: number;
  matchPointsEarned: number;
  timeElapsedMs: number;
  finalLevelScore: number;
  earnedMedal: MedalType;
  topPercentage?: number;
  language: Language;
  onSelectLevel: () => void;
  onReplayLevel: () => void;
  onOpenMenu: () => void;
  onOpenLeaderboard?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  completedLevel,
  baseScore,
  matchPointsEarned,
  timeElapsedMs,
  finalLevelScore,
  earnedMedal,
  topPercentage,
  language,
  onSelectLevel,
  onReplayLevel,
  onOpenMenu,
}) => {
  const strings = t(language);
  const nextConfig = getLevelConfig(completedLevel + 1);
  const nextNewItemType = nextConfig.itemTypes[nextConfig.itemTypes.length - 1];
  const nextNewItemDef = ITEM_DEFINITIONS[nextNewItemType];

  const getMedalName = (m: MedalType): string => {
    switch (m) {
      case 'platinum_1':
        return strings.medalPlatinum1;
      case 'platinum_2':
        return strings.medalPlatinum2;
      case 'platinum_3':
        return strings.medalPlatinum3;
      case 'gold':
        return strings.medalGold;
      case 'silver':
        return strings.medalSilver;
      case 'bronze':
        return strings.medalBronze;
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      {/* Ornate Medieval Plaque Container */}
      <div className="relative w-full max-w-sm rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#3a2215] via-[#24150d] to-[#170c07] border-4 border-[#ca8a04] shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.2)] text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Brass Corner Reinforcements */}
        <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-[#fef08a] rounded-tl-lg pointer-events-none" />
        <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-[#fef08a] rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-[#fef08a] rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-[#fef08a] rounded-br-lg pointer-events-none" />

        {/* Victory Laurel / Stars */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl text-amber-400">★</span>
          <span className="text-3xl text-[#fef08a] animate-bounce">★</span>
          <span className="text-2xl text-amber-400">★</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#fde047] to-[#ca8a04] tracking-wide drop-shadow">
          {strings.levelCleared}
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 font-cinzel mt-0.5">
          {strings.levelClearedSub(completedLevel)}
        </p>

        {/* Medal Status Banner */}
        {earnedMedal !== 'none' ? (
          <div className="mt-2.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-950/90 via-black/90 to-amber-950/90 border border-amber-500/70 shadow flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <MedalGraphic medal={earnedMedal} className="w-8 h-8 shrink-0 animate-pulse" />
              <div className="text-left">
                <span className="font-cinzel text-xs font-bold text-amber-200 block">
                  {getMedalName(earnedMedal)}
                </span>
                {topPercentage !== undefined && (
                  <span className="font-sans text-[11px] text-[#fef08a] font-semibold block leading-tight">
                    {strings.topPercentOfArmorers(topPercentage)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-black/60 border border-stone-800 text-center">
            <span className="text-xs font-cinzel font-semibold text-stone-300 block">
              {strings.noMedalThisRun}
            </span>
            <span className="text-[10px] text-amber-400/80 font-sans block mt-0.5">
              {topPercentage !== undefined
                ? strings.noMedalThisRunSub(topPercentage)
                : strings.needTopForBronze}
            </span>
          </div>
        )}

        {/* Millisecond Score Breakdown Section */}
        <div className="mt-3 p-3 rounded-2xl bg-black/60 border border-amber-900/60 text-xs text-amber-200/90 space-y-1.5 font-cinzel">
          <div className="flex items-center justify-between">
            <span className="text-stone-300 font-sans">{strings.baseScoreLabel}:</span>
            <span className="font-bold text-amber-300 tabular-nums">+{baseScore.toLocaleString()}</span>
          </div>

          {matchPointsEarned > 0 && (
            <div className="flex items-center justify-between text-emerald-300">
              <span className="font-sans">{strings.matchBonus}:</span>
              <span className="font-bold tabular-nums">+{matchPointsEarned.toLocaleString()}</span>
            </div>
          )}

          {/* Time Elapsed & Millisecond Deduction */}
          <div className="flex items-center justify-between text-rose-300 pt-1 border-t border-amber-900/40">
            <div className="text-left font-sans text-[11px]">
              <div>{strings.timeElapsed}: <span className="font-bold font-cinzel">{formatTimeWithMs(timeElapsedMs)}</span></div>
              <div className="text-[10px] text-rose-400/80">{strings.msPenaltyDesc}</div>
            </div>
            <span className="font-bold text-rose-400 tabular-nums text-sm">
              -{timeElapsedMs.toLocaleString()}
            </span>
          </div>

          {/* Total Level Score */}
          <div className="flex items-center justify-between pt-1.5 border-t border-amber-900/60 text-sm font-black text-amber-400">
            <span>{strings.totalScore}:</span>
            <span className="tabular-nums text-base text-[#fef08a]">{finalLevelScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Next Level Teaser Card */}
        <div className="my-3 p-2.5 rounded-2xl bg-black/50 border border-amber-900/60 flex items-center gap-3 text-left">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-950/60 border border-amber-700/50 p-1 flex items-center justify-center shadow-inner">
            <ItemGraphic type={nextNewItemType} isGlowing={true} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              {strings.unlockTeaser(completedLevel + 1)}
            </div>
            <div className="text-sm font-bold font-cinzel text-amber-100 leading-tight mt-0.5">
              {nextNewItemDef.name[language]}
            </div>
            <div className="text-[11px] text-stone-300 mt-0.5">
              {strings.nextComplexity(nextConfig.totalStands)}
            </div>
          </div>
        </div>

        {/* Primary CTA: Select Level (from achievements screen) */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onSelectLevel}
            className="w-full py-3 rounded-xl bg-gradient-to-b from-[#eab308] via-[#ca8a04] to-[#854d0e] border-2 border-[#fef08a] text-stone-950 font-cinzel font-bold text-base shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-lg">📜</span>
            <span>{strings.selectLevel}</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onReplayLevel}
              className="flex-1 py-2 rounded-lg bg-black/40 border border-amber-900/60 text-amber-300 font-cinzel text-xs font-semibold hover:bg-black/60 transition-colors cursor-pointer"
            >
              {strings.replay}
            </button>
            <button
              onClick={onOpenMenu}
              className="flex-1 py-2 rounded-lg bg-black/40 border border-amber-900/60 text-amber-300 font-cinzel text-xs font-semibold hover:bg-black/60 transition-colors cursor-pointer"
            >
              {strings.mainMenu}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
