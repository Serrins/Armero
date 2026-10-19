import React from 'react';
import { getLevelConfig } from '../services/levelGenerator';
import { ITEM_DEFINITIONS } from '../data/items';
import { ItemGraphic } from './ItemGraphic';
import { Language } from '../types/game';
import { t } from '../services/translations';
import { getSavedMedals, MedalType, getMedalName } from '../services/medals';
import { MedalGraphic } from './MedalGraphic';

interface LevelSelectModalProps {
  highestLevel: number;
  currentLevel: number;
  language: Language;
  onSelectLevel: (lvl: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  highestLevel,
  currentLevel,
  language,
  onSelectLevel,
  onClose,
}) => {
  const strings = t(language);
  const savedMedals = getSavedMedals();
  const levels = Array.from({ length: 18 }, (_, i) => i + 1);

  const getMedalBadgeName = (m: MedalType): string => {
    return getMedalName(m, language === 'es');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg max-h-[90vh] rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#3a2215] via-[#24150d] to-[#170c07] border-4 border-[#854d0e] shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/50 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#ca8a04]">
              {strings.levelRegistry}
            </h2>
            <p className="text-xs text-amber-200/70 font-sans">
              {strings.levelRegistrySub}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={strings.close}
            className="w-8 h-8 rounded-full bg-black/50 border border-amber-700/60 text-amber-300 flex items-center justify-center hover:bg-black/80 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Level Grid */}
        <div className="overflow-y-auto my-3 pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[64vh]">
          {levels.map((lvl) => {
            const config = getLevelConfig(lvl);
            const isUnlocked = lvl <= Math.max(highestLevel + 1, 1);
            const isCurrent = lvl === currentLevel;
            const keyItemType = config.itemTypes[config.itemTypes.length - 1];
            const itemDef = ITEM_DEFINITIONS[keyItemType];
            const medalInfo = savedMedals[lvl];
            const medal: MedalType = medalInfo?.medal || 'none';
            const hasMedal = medal !== 'none';

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(lvl)}
                className={`relative flex flex-col justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer text-left min-h-[148px] ${
                  isCurrent
                    ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] ring-2 ring-amber-400'
                    : isUnlocked
                    ? hasMedal
                      ? medal.startsWith('platinum')
                        ? 'bg-gradient-to-b from-sky-950/50 via-black/60 to-black/70 border-sky-400/70 hover:border-sky-300'
                        : medal === 'gold'
                        ? 'bg-gradient-to-b from-amber-950/50 via-black/60 to-black/70 border-amber-400/80 hover:border-amber-300'
                        : medal === 'silver'
                        ? 'bg-gradient-to-b from-slate-900/50 via-black/60 to-black/70 border-slate-400/70 hover:border-slate-300'
                        : 'bg-gradient-to-b from-orange-950/50 via-black/60 to-black/70 border-orange-600/70 hover:border-orange-500'
                      : 'bg-black/50 border-[#854d0e] hover:border-amber-400 hover:bg-black/70'
                    : 'bg-black/30 border-stone-800 opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Top Row: Level name & Stands */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs sm:text-sm font-bold font-cinzel text-amber-200">
                    {strings.armoryLevel} {lvl}
                  </span>
                  {isUnlocked ? (
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {config.totalStands} {strings.standsShort}
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-500">🔒</span>
                  )}
                </div>

                {/* Center Item Graphic */}
                <div className="flex items-center justify-center my-1.5 w-full">
                  {isUnlocked ? (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <ItemGraphic type={keyItemType} className="w-9 h-9" />
                      </div>
                      <span className="text-[10px] text-stone-300 font-sans line-clamp-1 max-w-[80px]">
                        {itemDef.name[language]}
                      </span>
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-600 text-xs">
                      ?
                    </div>
                  )}
                </div>

                {/* Bottom Medal Status Strip */}
                <div className="w-full pt-2 border-t border-amber-900/40">
                  {isUnlocked ? (
                    hasMedal ? (
                      <div className="flex items-center gap-2">
                        <MedalGraphic medal={medal} className="w-7 h-7 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] font-bold font-cinzel text-amber-200 leading-tight truncate">
                            {getMedalBadgeName(medal)}
                          </span>
                          {medalInfo?.topPercentage !== undefined && (
                            <span className="text-[10px] text-[#fef08a] font-semibold leading-tight">
                              {strings.topPercentOfArmorers(medalInfo.topPercentage)}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-[10px] font-bold font-cinzel text-stone-400">
                          <span className="text-stone-500">○</span>
                          <span>{strings.noMedalInLevelShort}</span>
                        </div>
                        {medalInfo?.topPercentage !== undefined ? (
                          <div className="text-[9px] text-[#fde047] font-semibold leading-tight">
                            {strings.topPercentOfArmorers(medalInfo.topPercentage)}
                            <span className="block text-[8px] text-amber-400/80 font-normal">
                              ({strings.needTopForBronze})
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-amber-400/70 leading-tight">
                            {strings.needTopForBronze}
                          </span>
                        )}
                      </div>
                    )
                  ) : (
                    <span className="text-[10px] text-stone-500 italic flex items-center gap-1">
                      <span>🔒</span>
                      <span>{strings.locked}</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-black/60 border border-amber-900 text-amber-200 font-cinzel text-xs font-bold hover:bg-black/80 transition-colors cursor-pointer shrink-0 mt-1"
        >
          {strings.close}
        </button>
      </div>
    </div>
  );
};
