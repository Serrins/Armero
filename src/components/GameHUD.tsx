import React from 'react';
import { Language } from '../types/game';
import { soundscape } from '../services/soundscape';
import { t } from '../services/translations';
import { LevelMedalInfo, MedalType } from '../services/medals';
import { MedalGraphic } from './MedalGraphic';

interface GameHUDProps {
  levelNumber: number;
  sessionScore: number;
  latestScoreAddition: { points: number; isSpeedBonus: boolean } | null;
  medalInfo?: LevelMedalInfo;
  isMuted: boolean;
  language: Language;
  onToggleLanguage: () => void;
  onToggleMute: () => void;
  onOpenMenu: () => void;
  onOpenLeaderboard: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  levelNumber,
  sessionScore,
  latestScoreAddition,
  medalInfo,
  isMuted,
  language,
  onToggleLanguage,
  onToggleMute,
  onOpenMenu,
  onOpenLeaderboard,
}) => {
  const strings = t(language);
  const medal: MedalType = medalInfo?.medal || 'none';
  const hasMedal = medal !== 'none';

  const getMedalShortTitle = (m: MedalType): string => {
    switch (m) {
      case 'platinum_1':
        return 'Platino #1';
      case 'platinum_2':
        return 'Platino #2';
      case 'platinum_3':
        return 'Platino #3';
      case 'gold':
        return 'Oro';
      case 'silver':
        return 'Plata';
      case 'bronze':
        return 'Bronce';
      default:
        return strings.noMedalInLevelShort;
    }
  };

  return (
    <header className="relative w-full max-w-lg mx-auto pt-2 pb-1.5 px-3 z-30 select-none">
      {/* Main Top Bar */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left cluster: Menu button + Language Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenMenu}
            aria-label={strings.mainMenu}
            title={strings.mainMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-[#422616] to-[#20120a] border-2 border-[#854d0e] text-[#fef08a] shadow-[0_4px_8px_rgba(0,0,0,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Language Switcher Button (ES / EN) */}
          <button
            onClick={() => {
              onToggleLanguage();
              soundscape.playPick();
            }}
            title={strings.languageLabel}
            className="h-10 px-2.5 rounded-full flex items-center gap-1 bg-gradient-to-b from-[#422616] to-[#20120a] border-2 border-[#854d0e] text-[#fef08a] shadow-[0_4px_8px_rgba(0,0,0,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer font-cinzel text-xs font-bold"
          >
            <span className={language === 'es' ? 'text-amber-300 font-extrabold' : 'text-stone-400'}>
              ES
            </span>
            <span className="text-amber-700">/</span>
            <span className={language === 'en' ? 'text-amber-300 font-extrabold' : 'text-stone-400'}>
              EN
            </span>
          </button>
        </div>

        {/* Center Plaque: Level Name + Real-time Medal Status */}
        <div className="relative px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-b from-[#3a2215] via-[#24150d] to-[#170c07] border-2 border-[#854d0e] shadow-[0_6px_16px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col items-center">
          {/* Ornamental Brass Tabs on Left & Right */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-4 bg-[#ca8a04] border border-[#713f12] rounded-sm pointer-events-none" />
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-4 bg-[#ca8a04] border border-[#713f12] rounded-sm pointer-events-none" />

          <h1 className="text-base sm:text-lg font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#ca8a04] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wider whitespace-nowrap">
            {strings.armoryLevel} {levelNumber}
          </h1>

          {/* Medal Status for this level */}
          <div className="mt-0.5 flex items-center justify-center">
            {hasMedal ? (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 border border-amber-500/60 shadow-sm">
                <MedalGraphic medal={medal} className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-bold font-cinzel text-amber-200">
                  {getMedalShortTitle(medal)}
                </span>
                {medalInfo?.topPercentage !== undefined && (
                  <span className="text-[9px] text-[#fef08a] font-semibold">
                    · {strings.topPercentOfArmorers(medalInfo.topPercentage)}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-stone-800">
                <span className="text-stone-500 text-[10px]">○</span>
                <span className="text-[9px] text-amber-300/80 font-sans tracking-tight">
                  {medalInfo?.topPercentage !== undefined
                    ? strings.medalNoneWithPct(medalInfo.topPercentage)
                    : strings.noMedalInLevel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right cluster: Leaderboard Trophy + Sound */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Leaderboard Trophy Button */}
          <button
            onClick={() => {
              onOpenLeaderboard();
              soundscape.playPick();
            }}
            title={strings.leaderboardTitle}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-[#422616] to-[#20120a] border-2 border-amber-500 text-amber-300 shadow-[0_4px_8px_rgba(0,0,0,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer text-sm"
          >
            🏆
          </button>

          {/* Soundscape Ambient Audio Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              soundscape.playPick();
            }}
            title={isMuted ? strings.soundMuted : strings.soundActive}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-[#422616] to-[#20120a] border-2 border-[#854d0e] text-[#fef08a] shadow-[0_4px_8px_rgba(0,0,0,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            {isMuted ? (
              <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[#fde047]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Prominent Score Bar with Speed Bonus Popups */}
      <div className="relative mt-2 flex items-center justify-center">
        <div className="relative flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 via-black/90 to-amber-950/80 border border-amber-500/40 shadow-[0_4px_12px_rgba(0,0,0,0.7)] backdrop-blur-sm">
          {/* Coin Icon */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#854d0e] flex items-center justify-center border border-[#ca8a04] shadow-sm">
            <span className="text-[10px] font-bold text-amber-950">◈</span>
          </div>

          <span className="text-xs font-cinzel text-amber-300/80 uppercase tracking-wider">
            {strings.levelScore}:
          </span>

          <span className="font-cinzel text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#fde047] to-[#ca8a04] tabular-nums tracking-wide">
            {sessionScore.toLocaleString()}
          </span>

          {/* Floating Score / Speed Bonus Popup */}
          {latestScoreAddition && (
            <div className="absolute -top-7 right-2 animate-bounce flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-cinzel font-extrabold text-xs shadow-[0_0_10px_rgba(245,158,11,0.8)] pointer-events-none">
              <span>+{latestScoreAddition.points}</span>
              {latestScoreAddition.isSpeedBonus && (
                <span className="text-[9px] uppercase tracking-tighter">⚡ {strings.speedBonus}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
