import React from 'react';
import { Language } from '../types/game';
import { t } from '../services/translations';
import { soundscape } from '../services/soundscape';

interface PauseModalProps {
  currentLevel: number;
  isMuted: boolean;
  language: Language;
  onToggleLanguage: () => void;
  onToggleMute: () => void;
  onResume: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onExitToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  currentLevel,
  isMuted,
  language,
  onToggleLanguage,
  onToggleMute,
  onResume,
  onRestart,
  onOpenLevelSelect,
  onExitToMenu,
}) => {
  const strings = t(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-[#3a2215] via-[#24150d] to-[#170c07] border-4 border-[#854d0e] shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-center animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#ca8a04]">
          {strings.pausedTitle}
        </h2>
        <p className="text-xs text-amber-200/80 font-cinzel mt-1">
          {strings.armoryLevel} {currentLevel}
        </p>

        {/* Audio & Language Controls */}
        <div className="my-5 p-3.5 rounded-2xl bg-black/50 border border-amber-900/60 text-left space-y-3">
          {/* Language Switch */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-amber-100 font-semibold">
              {strings.languageLabel}
            </span>
            <button
              onClick={() => {
                onToggleLanguage();
                soundscape.playPick();
              }}
              className="px-3 py-1 rounded-full text-xs font-cinzel font-bold bg-[#3f2414] border border-[#a16207] text-[#fef08a] hover:bg-[#52331f] transition-all cursor-pointer"
            >
              <span className={language === 'es' ? 'text-amber-300 font-extrabold' : 'text-stone-400'}>
                Español
              </span>
              <span className="text-amber-700 mx-1">/</span>
              <span className={language === 'en' ? 'text-amber-300 font-extrabold' : 'text-stone-400'}>
                English
              </span>
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-800">
            <span className="text-xs font-cinzel text-amber-100 font-semibold">
              {strings.forestSounds}
            </span>
            <button
              onClick={onToggleMute}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isMuted
                  ? 'bg-emerald-800 text-emerald-100 border border-emerald-500'
                  : 'bg-stone-800 text-stone-400 border border-stone-700'
              }`}
            >
              {!isMuted ? strings.enabled : strings.disabled}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-xl bg-gradient-to-b from-[#eab308] via-[#ca8a04] to-[#854d0e] border-2 border-[#fef08a] text-stone-950 font-cinzel font-bold text-base shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            {strings.resume}
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-black/50 border border-amber-900 text-amber-200 font-cinzel text-xs font-semibold hover:bg-black/70 cursor-pointer"
          >
            {strings.restartLevel}
          </button>
          <button
            onClick={onOpenLevelSelect}
            className="w-full py-2.5 rounded-xl bg-black/50 border border-amber-900 text-amber-200 font-cinzel text-xs font-semibold hover:bg-black/70 cursor-pointer"
          >
            {strings.changeLevel}
          </button>
          <button
            onClick={onExitToMenu}
            className="w-full py-2 rounded-xl text-stone-400 font-cinzel text-xs hover:text-stone-200 cursor-pointer"
          >
            {strings.exitToMenu}
          </button>
        </div>
      </div>
    </div>
  );
};
