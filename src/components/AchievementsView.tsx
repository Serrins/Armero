import React from 'react';
import { Language } from '../types/game';
import { t } from '../services/translations';
import { getSavedMedals, MedalType } from '../services/medals';
import { MedalGraphic } from './MedalGraphic';

interface AchievementsViewProps {
  highestLevel: number;
  language: Language;
  onSelectLevel?: (level: number) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  highestLevel,
  language,
  onSelectLevel,
}) => {
  const strings = t(language);
  const savedMedals = getSavedMedals();

  const totalLevels = 18;
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  // Compute counts
  let platinumCount = 0;
  let goldCount = 0;
  let silverCount = 0;
  let bronzeCount = 0;

  Object.values(savedMedals).forEach((m) => {
    if (m.medal.startsWith('platinum')) platinumCount++;
    else if (m.medal === 'gold') goldCount++;
    else if (m.medal === 'silver') silverCount++;
    else if (m.medal === 'bronze') bronzeCount++;
  });

  const getMedalTitle = (m: MedalType): string => {
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
        return strings.medalNone;
    }
  };

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto flex-1 min-h-0 flex flex-col px-4 pt-2 pb-32 overflow-y-auto select-none touch-pan-y overscroll-contain">
      {/* Header */}
      <div className="text-center mb-3">
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#fde047] to-[#ca8a04] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-wider flex items-center justify-center gap-2">
          <span>🏆</span>
          <span>{strings.achievementsTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 font-sans mt-0.5">
          {strings.achievementsSub}
        </p>
      </div>

      {/* Medals Summary Counter Bar */}
      <div className="my-2 px-3 py-2.5 rounded-2xl bg-black/60 border border-amber-800/60 grid grid-cols-4 gap-2 text-center shrink-0 shadow-md">
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-sky-300 font-cinzel font-bold">Platino</span>
          <span className="text-lg sm:text-xl font-black font-cinzel text-sky-200 tabular-nums">
            {platinumCount}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-amber-300 font-cinzel font-bold">Oro</span>
          <span className="text-lg sm:text-xl font-black font-cinzel text-[#fef08a] tabular-nums">
            {goldCount}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-slate-300 font-cinzel font-bold">Plata</span>
          <span className="text-lg sm:text-xl font-black font-cinzel text-slate-200 tabular-nums">
            {silverCount}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-orange-300 font-cinzel font-bold">Bronce</span>
          <span className="text-lg sm:text-xl font-black font-cinzel text-orange-200 tabular-nums">
            {bronzeCount}
          </span>
        </div>
      </div>

      {/* Legend Criteria Strip */}
      <div className="mb-3 p-2.5 rounded-xl bg-amber-950/50 border border-amber-900/50 text-[10px] text-amber-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">💎</span>
          <span><strong>Platino</strong>: {strings.legendPlatinum}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🥇</span>
          <span><strong>Oro</strong>: {strings.legendGold}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🥈</span>
          <span><strong>Plata</strong>: {strings.legendSilver}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🥉</span>
          <span><strong>Bronce</strong>: {strings.legendBronze}</span>
        </div>
      </div>

      {/* Levels Grid List */}
      <div className="space-y-2">
        {levels.map((lvl) => {
          const info = savedMedals[lvl];
          const isUnlocked = lvl <= Math.max(highestLevel + 1, 1);
          const medal: MedalType = info?.medal || 'none';

          return (
            <div
              key={lvl}
              onClick={() => {
                if (isUnlocked && onSelectLevel) {
                  onSelectLevel(lvl);
                }
              }}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'cursor-pointer hover:border-amber-400 hover:brightness-110 active:scale-[0.99]'
                  : 'opacity-70 cursor-not-allowed'
              } ${
                medal.startsWith('platinum')
                  ? 'bg-gradient-to-r from-sky-950/70 to-black/70 border-sky-400/80 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : medal === 'gold'
                  ? 'bg-gradient-to-r from-amber-950/70 to-black/70 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : medal === 'silver'
                  ? 'bg-gradient-to-r from-slate-900/70 to-black/70 border-slate-400/60'
                  : medal === 'bronze'
                  ? 'bg-gradient-to-r from-orange-950/70 to-black/70 border-orange-700/60'
                  : 'bg-black/40 border-stone-800/80'
              }`}
            >
              {/* Left: Medal Graphic & Title */}
              <div className="flex items-center gap-3">
                <MedalGraphic medal={medal} className="w-11 h-11 shrink-0" />

                <div className="flex flex-col">
                  <span className="font-cinzel text-xs sm:text-sm font-bold text-amber-100">
                    {strings.armoryLevel} {lvl}
                  </span>
                  <span className="text-[10px] text-amber-300/80 font-medium leading-tight">
                    {getMedalTitle(medal)}
                  </span>
                </div>
              </div>

              {/* Right: Score, Placement and Play Action */}
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  {info && info.bestScore > 0 ? (
                    <>
                      <div className="font-cinzel font-extrabold text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] to-[#fde047] tabular-nums">
                        {info.bestScore.toLocaleString()} pts
                      </div>
                      <div className="text-[10px] text-stone-300 font-medium">
                        {info.rank ? `#${info.rank}` : ''}
                        {info.topPercentage !== undefined
                          ? ` · ${strings.topPercentOfArmorers(info.topPercentage)}`
                          : ''}
                      </div>
                      {medal === 'none' && (
                        <div className="text-[9px] text-amber-500/90 font-sans">
                          {strings.needTopForBronze}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-stone-400 font-cinzel">
                        {isUnlocked ? strings.noMedalInLevelShort : strings.locked}
                      </span>
                      {isUnlocked && (
                        <span className="text-[9px] text-amber-500/70 font-sans">
                          {strings.needTopForBronze}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isUnlocked && onSelectLevel && (
                  <button
                    onClick={() => onSelectLevel(lvl)}
                    title={`${strings.playLevel} ${strings.armoryLevel} ${lvl}`}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-bold text-xs shadow cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    ▶ {strings.playLevel}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
