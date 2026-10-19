import React from 'react';
import { Language } from '../types/game';
import { soundscape } from '../services/soundscape';
import { t } from '../services/translations';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAchievements?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  highestLevel: number;
  language: Language;
  onToggleLanguage: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenLeaderboard,
  isMuted,
  onToggleMute,
  highestLevel,
  language,
  onToggleLanguage,
}) => {
  const strings = t(language);

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-6 pb-24 overflow-hidden select-none">
      {/* Background with warm ambient lighting */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75 scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url(/src/assets/images/cozy_forest_armory_1792343200435.jpg)`,
        }}
      />
      {/* Vignette Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/75 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between pt-2">
        {/* Left side: Language Toggle Switch (ES / EN) */}
        <button
          onClick={() => {
            onToggleLanguage();
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
            onToggleMute();
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

      {/* Hero Centerpiece & Title Lockup */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-4 max-w-sm">
        {/* Emblem Crest */}
        <div className="w-20 h-20 mb-3 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] animate-pulse">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <path
              d="M18 16 C18 16, 50 12, 50 12 C50 12, 82 16, 82 16 C82 52, 72 74, 50 88 C28 74, 18 52, 18 16 Z"
              fill="url(#titleGold)"
              stroke="#583101"
              strokeWidth="3"
            />
            <path
              d="M50 28 C53 25, 57 26, 57 30 C55 32, 52 32, 52 34 C55 35, 60 33, 62 36 C59 38, 55 38, 53 40 C56 42, 63 43, 64 47 C60 48, 55 46, 52 48 C51 52, 56 56, 57 60 C53 60, 49 57, 47 54 C45 58, 47 64, 48 68 C44 68, 42 63, 42 58 C39 62, 35 65, 33 62 C37 57, 41 53, 42 47 C40 45, 35 46, 34 42 C38 41, 43 41, 45 37 C43 35, 38 34, 40 31 C43 33, 47 34, 48 30 Z"
              fill="#fef08a"
              stroke="#713f12"
              strokeWidth="1.2"
            />
            <defs>
              <radialGradient id="titleGold" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#713f12" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Bespoke Royal Armory Title */}
        <h1 className="text-4xl sm:text-5xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#fde047] to-[#ca8a04] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-wider">
          {strings.armoryTitle}
        </h1>
        <p className="mt-1 text-base sm:text-lg font-cinzel text-amber-200/90 font-semibold tracking-wide">
          {strings.subTitle}
        </p>

        {/* Cozy Lore Subtitle */}
        <p className="mt-3 text-xs sm:text-sm text-stone-300 max-w-xs font-sans leading-relaxed drop-shadow">
          {strings.lore}
        </p>
      </div>

      {/* Bottom CTA Actions */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-2.5 pb-4">
        {/* Main Start Button */}
        <button
          onClick={() => {
            soundscape.startAmbience();
            soundscape.playPick();
            onStartGame();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-b from-[#eab308] via-[#ca8a04] to-[#854d0e] border-2 border-[#fef08a] text-stone-950 font-cinzel font-extrabold text-lg sm:text-xl shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-3"
        >
          <span>{strings.enterArmory}</span>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Level Select Full-Width Action (Clasificación removed as requested) */}
        <button
          onClick={() => {
            soundscape.playPick();
            onOpenLevelSelect();
          }}
          className="w-full py-3 rounded-xl bg-black/60 border border-amber-800/60 text-amber-200/90 font-cinzel text-xs font-bold hover:bg-black/80 hover:border-amber-600 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
        >
          <span>⚔️</span>
          <span>{strings.selectLevel} ({strings.highestReached} {highestLevel})</span>
        </button>

        {/* Flat control-hint line */}
        <p className="text-center text-[11px] text-amber-300/60 font-sans tracking-wide pt-0.5">
          {strings.controlHint}
        </p>
      </div>
    </div>
  );
};
