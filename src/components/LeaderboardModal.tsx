import React, { useState, useEffect } from 'react';
import { Language } from '../types/game';
import { t } from '../services/translations';
import { getLevelLeaderboard, LeaderboardEntry, PercentileResult, formatTimeWithMs } from '../services/leaderboard';
import { soundscape } from '../services/soundscape';

interface LeaderboardModalProps {
  initialLevel: number;
  highestLevel: number;
  currentScore?: number;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  language: Language;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  initialLevel,
  highestLevel,
  currentScore,
  playerName,
  onUpdatePlayerName,
  language,
  onClose,
}) => {
  const strings = t(language);
  const [selectedLevel, setSelectedLevel] = useState<number>(initialLevel || 1);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [percentile, setPercentile] = useState<PercentileResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nameInput, setNameInput] = useState<string>(playerName);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const availableLevels = Array.from(
    { length: Math.max(highestLevel, 1) },
    (_, i) => i + 1
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getLevelLeaderboard(
      selectedLevel,
      selectedLevel === initialLevel ? currentScore : undefined
    )
      .then((data) => {
        if (isMounted) {
          setEntries(data.entries);
          setPercentile(data.playerPercentile);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLevel, initialLevel, currentScore]);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdatePlayerName(nameInput.trim());
      setIsEditingName(false);
      soundscape.playPick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md max-h-[90vh] rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#3a2215] via-[#24150d] to-[#170c07] border-4 border-[#ca8a04] shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-amber-900/50">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#ca8a04] tracking-wide">
              {strings.leaderboardTitle}
            </h2>
            <p className="text-[11px] text-amber-200/70 font-sans">
              {strings.leaderboardSub}
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

        {/* Level Tabs (Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none shrink-0">
          {availableLevels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                soundscape.playPick();
              }}
              className={`px-3 py-1 rounded-full text-xs font-cinzel font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-stone-950 shadow-md border border-amber-300 scale-105'
                  : 'bg-black/40 border border-amber-900/60 text-amber-200 hover:bg-black/60'
              }`}
            >
              {strings.armoryLevel} {lvl}
            </button>
          ))}
        </div>

        {/* Player Percentile Spotlight Banner */}
        {percentile && (
          <div className="mb-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-950/90 via-[#2e170c] to-amber-950/90 border border-amber-500/60 shadow-lg text-center shrink-0">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold font-cinzel">
              <span className="text-base">👑</span>
              <span>{strings.percentileTop(percentile.topPercentage)}</span>
            </div>

            <p className="text-xs text-amber-100 font-sans mt-0.5">
              {strings.percentileBeaten(percentile.percentile)}
            </p>

            {/* Visual Percentile Gauge */}
            <div className="mt-2 w-full h-2.5 rounded-full bg-black/60 border border-amber-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-[#fef08a] transition-all duration-700"
                style={{ width: `${Math.max(5, percentile.percentile)}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-1 text-[10px] text-amber-300/80 font-cinzel font-semibold">
              <span>{strings.yourRank}: #{percentile.rank}</span>
              <span>{strings.outOf(percentile.totalPlayers)}</span>
            </div>
          </div>
        )}

        {/* Armorer Name Customizer */}
        <div className="mb-2 px-2 py-1.5 rounded-xl bg-black/40 border border-amber-900/50 flex items-center justify-between shrink-0 text-xs">
          <span className="text-stone-400 font-sans text-[11px]">{strings.armorerName}:</span>
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={nameInput}
                maxLength={20}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-2 py-0.5 rounded bg-stone-900 border border-amber-600 text-amber-100 text-xs font-cinzel outline-none w-32"
              />
              <button
                onClick={handleSaveName}
                className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold font-cinzel text-xs cursor-pointer"
              >
                {strings.saveName}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-bold text-amber-300">{playerName}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[10px] text-amber-500 hover:underline cursor-pointer"
              >
                ✎
              </button>
            </div>
          )}
        </div>

        {/* Scores Table */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-1.5 min-h-[160px] max-h-[36vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-amber-400/80 font-cinzel text-xs animate-pulse">
              <span>{strings.loading}</span>
            </div>
          ) : (
            entries.map((entry, idx) => {
              const isCurrentUser =
                entry.playerName === playerName ||
                (percentile && percentile.rank === idx + 1);

              return (
                <div
                  key={`${entry.playerName}_${idx}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                    isCurrentUser
                      ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] ring-1 ring-amber-400'
                      : idx === 0
                      ? 'bg-amber-900/30 border-amber-500/60'
                      : 'bg-black/40 border-stone-800'
                  }`}
                >
                  {/* Rank medal */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 text-center font-cinzel font-black text-xs">
                      {idx === 0 ? (
                        <span className="text-amber-300 text-base">🥇</span>
                      ) : idx === 1 ? (
                        <span className="text-slate-300 text-base">🥈</span>
                      ) : idx === 2 ? (
                        <span className="text-amber-600 text-base">🥉</span>
                      ) : (
                        <span className="text-stone-400 tabular-nums">{idx + 1}</span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={`font-cinzel text-xs font-bold leading-tight ${
                          isCurrentUser ? 'text-amber-200' : 'text-stone-200'
                        }`}
                      >
                        {entry.playerName} {isCurrentUser ? `(${strings.you})` : ''}
                      </span>
                      <span className="text-[9px] text-amber-400/80 font-cinzel">
                        ⏱ {formatTimeWithMs(entry.timeElapsedMs || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <span className="font-cinzel font-extrabold text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] to-[#fde047] tabular-nums">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-amber-900/50 mt-2 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-black/60 border border-amber-900 text-amber-200 font-cinzel text-xs font-bold hover:bg-black/80 transition-colors cursor-pointer"
          >
            {strings.close}
          </button>
        </div>
      </div>
    </div>
  );
};
