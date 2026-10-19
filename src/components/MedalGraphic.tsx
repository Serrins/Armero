import React from 'react';
import { MedalType } from '../services/medals';

interface MedalGraphicProps {
  medal: MedalType;
  className?: string;
  showLabel?: boolean;
}

export const MedalGraphic: React.FC<MedalGraphicProps> = ({
  medal,
  className = 'w-12 h-12',
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" fill="none">
        <defs>
          {/* Platinum Gradients */}
          <linearGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="70%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="platCyanGleam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Gold Gradients */}
          <radialGradient id="goldMedalGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#713f12" />
          </radialGradient>

          {/* Silver Gradients */}
          <radialGradient id="silverMedalGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#cbd5e1" />
            <stop offset="80%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </radialGradient>

          {/* Bronze Gradients */}
          <radialGradient id="bronzeMedalGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="45%" stopColor="#c2410c" />
            <stop offset="85%" stopColor="#7c2d12" />
            <stop offset="100%" stopColor="#431407" />
          </radialGradient>

          {/* Ribbon Gradients */}
          <linearGradient id="ribbonCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          <linearGradient id="ribbonRoyalBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Ribbon on top for earned medals */}
        {medal !== 'none' && (
          <g>
            <path
              d="M32 10 L44 45 L50 42 L56 45 L68 10 L50 20 Z"
              fill={medal.startsWith('platinum') ? 'url(#ribbonRoyalBlue)' : 'url(#ribbonCrimson)'}
              stroke="#1e1b4b"
              strokeWidth="1.2"
            />
            <path d="M48 10 L50 42 L52 10 Z" fill="#fbbf24" opacity="0.8" />
          </g>
        )}

        {/* PLATINUM MEDALS with #1, #2, or #3 */}
        {medal.startsWith('platinum') && (
          <g>
            {/* Outer Laurel Ring */}
            <circle cx="50" cy="58" r="32" fill="url(#platCyanGleam)" stroke="#0284c7" strokeWidth="2" />
            {/* Disc */}
            <circle cx="50" cy="58" r="28" fill="url(#platGrad)" stroke="#64748b" strokeWidth="1.5" />
            {/* Inner Ring */}
            <circle cx="50" cy="58" r="23" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Central Number (1, 2, or 3) */}
            <text
              x="50"
              y="58"
              textAnchor="middle"
              dominantBaseline="central"
              className="font-cinzel font-black select-none"
              fontSize="26"
              fontWeight="900"
              fill="#fde047"
              stroke="#854d0e"
              strokeWidth="1.2"
            >
              {medal === 'platinum_1' ? '1' : medal === 'platinum_2' ? '2' : '3'}
            </text>

            {/* Radiant Star Flares */}
            <circle cx="50" cy="38" r="2" fill="#ffffff" />
            <circle cx="34" cy="54" r="1.5" fill="#38bdf8" />
            <circle cx="66" cy="54" r="1.5" fill="#38bdf8" />
          </g>
        )}

        {/* GOLD MEDAL (Top 0.5%) */}
        {medal === 'gold' && (
          <g>
            <circle cx="50" cy="58" r="32" fill="#713f12" stroke="#eab308" strokeWidth="2" />
            <circle cx="50" cy="58" r="28" fill="url(#goldMedalGrad)" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="50" cy="58" r="22" fill="#854d0e" stroke="#fde047" strokeWidth="1" />
            {/* Crown Emblem */}
            <path
              d="M38 64 L40 52 L46 58 L50 48 L54 58 L60 52 L62 64 Z"
              fill="#fef08a"
              stroke="#713f12"
              strokeWidth="1"
            />
            <circle cx="50" cy="46" r="1.5" fill="#ffffff" />
          </g>
        )}

        {/* SILVER MEDAL (Top 2.5%) */}
        {medal === 'silver' && (
          <g>
            <circle cx="50" cy="58" r="32" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="50" cy="58" r="28" fill="url(#silverMedalGrad)" stroke="#f1f5f9" strokeWidth="1.5" />
            <circle cx="50" cy="58" r="22" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
            {/* Fleur-de-lis Emblem */}
            <path
              d="M50 48 C51 52, 54 55, 55 57 C52 58, 49 58, 50 62 C48 62, 48 58, 45 57 C46 55, 49 52, 50 48 Z"
              fill="#ffffff"
            />
            <rect x="44" y="63" width="12" height="2" rx="1" fill="#e2e8f0" />
          </g>
        )}

        {/* BRONZE MEDAL (Top 5%) */}
        {medal === 'bronze' && (
          <g>
            <circle cx="50" cy="58" r="32" fill="#431407" stroke="#c2410c" strokeWidth="2" />
            <circle cx="50" cy="58" r="28" fill="url(#bronzeMedalGrad)" stroke="#fdba74" strokeWidth="1.5" />
            <circle cx="50" cy="58" r="22" fill="#5a210b" stroke="#ea580c" strokeWidth="1" />
            {/* Shield Emblem */}
            <path
              d="M40 50 C40 50, 50 48, 50 48 C50 48, 60 50, 60 50 C60 62, 56 68, 50 72 C44 68, 40 62, 40 50 Z"
              fill="#fdba74"
              stroke="#431407"
              strokeWidth="1"
            />
          </g>
        )}

        {/* NONE / LOCKED */}
        {medal === 'none' && (
          <g opacity="0.45">
            <circle cx="50" cy="50" r="30" fill="#1c1917" stroke="#44403c" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="50" cy="50" r="23" fill="#0c0a09" stroke="#292524" strokeWidth="1" />
            {/* Lock symbol */}
            <rect x="42" y="48" width="16" height="12" rx="2" fill="#57534e" />
            <path d="M45 48 V42 C45 39, 55 39, 55 42 V48" fill="none" stroke="#78716c" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
