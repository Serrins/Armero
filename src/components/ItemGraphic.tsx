import React from 'react';
import { ItemType } from '../types/game';

interface ItemGraphicProps {
  type: ItemType;
  className?: string;
  isGlowing?: boolean;
}

export const ItemGraphic: React.FC<ItemGraphicProps> = ({
  type,
  className = 'w-full h-full',
  isGlowing = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-200 ${className} ${
        isGlowing ? 'scale-105' : ''
      }`}
    >
      {/* Golden Aura Glow for 3-match highlight as seen in screenshot */}
      {isGlowing && (
        <div className="absolute inset-0 rounded-2xl bg-amber-400/30 blur-md animate-pulse pointer-events-none" />
      )}

      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] ${
          isGlowing ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]' : ''
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Shield Gradients */}
          <radialGradient id="goldGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#713f12" />
          </radialGradient>

          {/* Steel Helm Gradients */}
          <linearGradient id="steelGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Crimson Red Shield */}
          <linearGradient id="redShieldGrad" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="60%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          {/* Royal Blue Shield */}
          <linearGradient id="blueShieldGrad" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="60%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Potions Liquid Gradients */}
          <radialGradient id="manaLiquid" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="90%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#091838" />
          </radialGradient>

          <radialGradient id="healthLiquid" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="85%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>

          <radialGradient id="forestLiquid" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="85%" stopColor="#14532d" />
            <stop offset="100%" stopColor="#052e16" />
          </radialGradient>

          {/* Wood Texture */}
          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a27b5c" />
            <stop offset="50%" stopColor="#6f4e37" />
            <stop offset="100%" stopColor="#3f2e23" />
          </linearGradient>

          {/* Blade Steel */}
          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="48%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* 1. Golden Lion Shield */}
        {type === 'gold_shield' && (
          <g>
            {/* Outer Shield Rim */}
            <path
              d="M18 16 C18 16, 50 12, 50 12 C50 12, 82 16, 82 16 C82 52, 72 74, 50 88 C28 74, 18 52, 18 16 Z"
              fill="url(#goldGlow)"
              stroke="#583101"
              strokeWidth="2.5"
            />
            {/* Inner Recessed Plate */}
            <path
              d="M23 20 C23 20, 50 16, 50 16 C50 16, 77 20, 77 20 C77 50, 68 70, 50 82 C32 70, 23 50, 23 20 Z"
              fill="#ca8a04"
              stroke="#854d0e"
              strokeWidth="1.5"
            />
            {/* Heraldic Lion Rampant Emblem */}
            <path
              d="M50 28 C53 25, 57 26, 57 30 C55 32, 52 32, 52 34 C55 35, 60 33, 62 36 C59 38, 55 38, 53 40 C56 42, 63 43, 64 47 C60 48, 55 46, 52 48 C51 52, 56 56, 57 60 C53 60, 49 57, 47 54 C45 58, 47 64, 48 68 C44 68, 42 63, 42 58 C39 62, 35 65, 33 62 C37 57, 41 53, 42 47 C40 45, 35 46, 34 42 C38 41, 43 41, 45 37 C43 35, 38 34, 40 31 C43 33, 47 34, 48 30 Z"
              fill="#fef08a"
              stroke="#713f12"
              strokeWidth="1"
            />
            {/* Shield Rivets */}
            <circle cx="21" cy="22" r="1.5" fill="#fef08a" stroke="#451a03" strokeWidth="0.5" />
            <circle cx="79" cy="22" r="1.5" fill="#fef08a" stroke="#451a03" strokeWidth="0.5" />
            <circle cx="50" cy="14" r="1.5" fill="#fef08a" stroke="#451a03" strokeWidth="0.5" />
            <circle cx="50" cy="85" r="1.5" fill="#fef08a" stroke="#451a03" strokeWidth="0.5" />
          </g>
        )}

        {/* 2. Crusader Knight Helm */}
        {type === 'knight_helm' && (
          <g>
            {/* Dome Helmet */}
            <path
              d="M26 44 C26 22, 36 14, 50 14 C64 14, 74 22, 74 44 C74 72, 70 82, 50 84 C30 82, 26 72, 26 44 Z"
              fill="url(#steelGrad)"
              stroke="#1e293b"
              strokeWidth="2"
            />
            {/* Brow Ridge Band */}
            <path
              d="M26 40 C34 44, 66 44, 74 40 C74 46, 66 50, 50 50 C34 50, 26 46, 26 40 Z"
              fill="url(#brassGrad)"
              stroke="#713f12"
              strokeWidth="1"
            />
            {/* Brass Cross Visor Guard */}
            <rect x="46" y="24" width="8" height="52" rx="2" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="1" />
            <rect x="28" y="44" width="44" height="7" rx="2" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="1" />
            {/* Eye Slits (Oculars) */}
            <rect x="32" y="46" width="12" height="3" rx="1" fill="#090d16" />
            <rect x="56" y="46" width="12" height="3" rx="1" fill="#090d16" />
            {/* Breathing Ventilation Holes */}
            <circle cx="40" cy="60" r="1.2" fill="#090d16" />
            <circle cx="44" cy="64" r="1.2" fill="#090d16" />
            <circle cx="40" cy="68" r="1.2" fill="#090d16" />
            <circle cx="60" cy="60" r="1.2" fill="#090d16" />
            <circle cx="56" cy="64" r="1.2" fill="#090d16" />
            <circle cx="60" cy="68" r="1.2" fill="#090d16" />
            {/* Helmet Rim Studs */}
            <circle cx="28" cy="42" r="1.2" fill="#fef08a" />
            <circle cx="72" cy="42" r="1.2" fill="#fef08a" />
          </g>
        )}

        {/* 3. Blue Fleur-de-lis Shield */}
        {type === 'blue_shield' && (
          <g>
            <path
              d="M20 18 C20 18, 50 14, 50 14 C50 14, 80 18, 80 18 C80 54, 70 76, 50 88 C30 76, 20 54, 20 18 Z"
              fill="url(#steelGrad)"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M25 22 C25 22, 50 18, 50 18 C50 18, 75 22, 75 22 C75 52, 66 72, 50 82 C34 72, 25 52, 25 22 Z"
              fill="url(#blueShieldGrad)"
            />
            {/* Golden Fleur-de-lis */}
            <path
              d="M50 28 C51 34, 55 38, 57 41 C53 43, 49 43, 50 48 C48 48, 48 43, 43 41 C45 38, 49 34, 50 28 Z"
              fill="url(#goldGlow)"
            />
            <path
              d="M50 42 C44 42, 36 38, 36 46 C36 51, 41 52, 47 48 Z"
              fill="url(#goldGlow)"
            />
            <path
              d="M50 42 C56 42, 64 38, 64 46 C64 51, 59 52, 53 48 Z"
              fill="url(#goldGlow)"
            />
            <rect x="42" y="49" width="16" height="3" rx="1.5" fill="url(#brassGrad)" />
            <path d="M46 52 L50 64 L54 52 Z" fill="url(#goldGlow)" />
          </g>
        )}

        {/* 4. Red Gryphon Shield */}
        {type === 'red_shield' && (
          <g>
            <path
              d="M20 18 C20 18, 50 14, 50 14 C50 14, 80 18, 80 18 C80 54, 70 76, 50 88 C30 76, 20 54, 20 18 Z"
              fill="url(#steelGrad)"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M24 22 C24 22, 50 18, 50 18 C50 18, 76 22, 76 22 C76 52, 67 72, 50 82 C33 72, 24 52, 24 22 Z"
              fill="url(#redShieldGrad)"
            />
            {/* Heraldic Gold Lion in Center */}
            <path
              d="M50 30 C53 27, 57 28, 57 32 C55 34, 52 34, 52 36 C55 37, 60 35, 62 38 C59 40, 55 40, 53 42 C56 44, 62 45, 63 48 C59 49, 55 47, 52 49 C51 53, 56 57, 56 61 C52 61, 48 58, 47 55 C45 59, 47 64, 48 67 C44 67, 42 62, 42 57 C39 61, 35 64, 33 61 C37 56, 41 52, 42 46 C40 44, 35 45, 34 41 C38 40, 43 40, 45 36 C43 34, 38 33, 40 30 C43 32, 47 33, 48 29 Z"
              fill="#fbbf24"
              stroke="#78350f"
              strokeWidth="0.8"
            />
          </g>
        )}

        {/* 5. Knight's Broadsword */}
        {type === 'royal_sword' && (
          <g transform="rotate(-35 50 50)">
            {/* Blade */}
            <path d="M48 14 L50 6 L52 14 L53 66 L47 66 Z" fill="url(#bladeGrad)" stroke="#64748b" strokeWidth="1" />
            {/* Central Fuller Groove */}
            <line x1="50" y1="12" x2="50" y2="60" stroke="#475569" strokeWidth="1.2" />
            {/* Crossguard */}
            <path d="M30 66 C32 63, 68 63, 70 66 L68 70 C58 69, 42 69, 32 70 Z" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="1" />
            {/* Grip */}
            <rect x="47" y="70" width="6" height="15" rx="1" fill="#451a03" stroke="#291203" strokeWidth="0.8" />
            {/* Pommel */}
            <circle cx="50" cy="88" r="4.5" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="1" />
            <circle cx="50" cy="88" r="1.8" fill="#dc2626" />
          </g>
        )}

        {/* 6. Double Battleaxe */}
        {type === 'battle_axe' && (
          <g transform="rotate(35 50 50)">
            {/* Wood Shaft */}
            <rect x="47" y="14" width="6" height="74" rx="2" fill="url(#woodGrad)" stroke="#261a12" strokeWidth="1" />
            {/* Iron Collar */}
            <rect x="46" y="24" width="8" height="18" fill="url(#steelGrad)" stroke="#1e293b" strokeWidth="1" />
            {/* Left Axe Blade */}
            <path
              d="M46 25 C30 15, 14 24, 14 33 C14 42, 30 51, 46 41 Z"
              fill="url(#bladeGrad)"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Right Axe Blade */}
            <path
              d="M54 25 C70 15, 86 24, 86 33 C86 42, 70 51, 54 41 Z"
              fill="url(#bladeGrad)"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Leather Wrap */}
            <line x1="47" y1="52" x2="53" y2="58" stroke="#fcd34d" strokeWidth="1" />
            <line x1="47" y1="62" x2="53" y2="68" stroke="#fcd34d" strokeWidth="1" />
            <line x1="47" y1="72" x2="53" y2="78" stroke="#fcd34d" strokeWidth="1" />
          </g>
        )}

        {/* 7. Azure Mana Potion */}
        {type === 'mana_potion' && (
          <g>
            {/* Cork */}
            <rect x="44" y="16" width="12" height="8" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            {/* Neck Rim */}
            <ellipse cx="50" cy="24" rx="8" ry="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
            {/* Bottle Neck */}
            <rect x="45" y="24" width="10" height="14" fill="#93c5fd" opacity="0.4" stroke="#64748b" strokeWidth="1" />
            {/* Bulbous Glass Body */}
            <circle cx="50" cy="56" r="26" fill="url(#manaLiquid)" stroke="#1e3a8a" strokeWidth="2" />
            {/* Magical Glowing Bubbles */}
            <circle cx="44" cy="52" r="3.5" fill="#ffffff" opacity="0.75" />
            <circle cx="58" cy="62" r="2.5" fill="#ffffff" opacity="0.6" />
            <circle cx="52" cy="46" r="1.8" fill="#ffffff" opacity="0.8" />
            {/* Glass Curvature Reflection */}
            <path d="M34 46 C34 38, 42 34, 46 34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          </g>
        )}

        {/* 8. Crimson Health Flask */}
        {type === 'health_potion' && (
          <g>
            <rect x="44" y="16" width="12" height="8" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            <ellipse cx="50" cy="24" rx="8" ry="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
            <rect x="45" y="24" width="10" height="14" fill="#fca5a5" opacity="0.4" stroke="#64748b" strokeWidth="1" />
            <circle cx="50" cy="56" r="26" fill="url(#healthLiquid)" stroke="#881337" strokeWidth="2" />
            <circle cx="44" cy="52" r="3.5" fill="#ffffff" opacity="0.75" />
            <circle cx="58" cy="62" r="2.5" fill="#ffffff" opacity="0.6" />
            <path d="M34 46 C34 38, 42 34, 46 34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          </g>
        )}

        {/* 9. Forest Elixir Vial */}
        {type === 'forest_elixir' && (
          <g>
            <rect x="45" y="16" width="10" height="7" rx="1.5" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            <ellipse cx="50" cy="23" rx="7" ry="2.5" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
            {/* Teardrop / Amphora Shape */}
            <path
              d="M45 23 L45 35 C34 44, 28 56, 30 68 C32 78, 40 84, 50 84 C60 84, 68 78, 70 68 C72 56, 66 44, 55 35 L55 23 Z"
              fill="url(#forestLiquid)"
              stroke="#064e3b"
              strokeWidth="2"
            />
            {/* Leaf Vine Emblem */}
            <path d="M47 52 C50 48, 54 48, 54 53 C54 57, 49 57, 47 52 Z" fill="#86efac" />
            <path d="M53 58 C50 62, 46 62, 46 57 C46 53, 51 53, 53 58 Z" fill="#86efac" />
            {/* Reflection */}
            <path d="M37 54 C35 62, 38 72, 43 76" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
          </g>
        )}

        {/* 10. Arrow Quiver */}
        {type === 'arrow_quiver' && (
          <g transform="rotate(-15 50 50)">
            {/* Arrows Sticking Out */}
            <line x1="42" y1="10" x2="42" y2="40" stroke="#78350f" strokeWidth="2" />
            <path d="M39 10 L42 5 L45 10 L42 12 Z" fill="#f8fafc" stroke="#475569" strokeWidth="0.8" />

            <line x1="50" y1="8" x2="50" y2="40" stroke="#78350f" strokeWidth="2" />
            <path d="M47 8 L50 3 L53 8 L50 10 Z" fill="#f8fafc" stroke="#475569" strokeWidth="0.8" />

            <line x1="58" y1="12" x2="58" y2="40" stroke="#78350f" strokeWidth="2" />
            <path d="M55 12 L58 7 L61 12 L58 14 Z" fill="#f8fafc" stroke="#475569" strokeWidth="0.8" />

            {/* Quiver Leather Body */}
            <path
              d="M38 32 L62 30 L58 84 C58 86, 42 86, 42 84 Z"
              fill="url(#woodGrad)"
              stroke="#29180c"
              strokeWidth="2"
            />
            {/* Stitched Bands */}
            <rect x="37" y="38" width="26" height="5" rx="1" fill="#451a03" stroke="#fcd34d" strokeWidth="0.8" />
            <rect x="40" y="66" width="20" height="5" rx="1" fill="#451a03" stroke="#fcd34d" strokeWidth="0.8" />
          </g>
        )}

        {/* 11. Crossbow */}
        {type === 'crossbow' && (
          <g transform="rotate(25 50 50)">
            {/* Prod / Steel Bow */}
            <path d="M16 26 C34 40, 66 40, 84 26 L81 22 C65 34, 35 34, 19 22 Z" fill="url(#steelGrad)" stroke="#1e293b" strokeWidth="1.2" />
            {/* Bowstring */}
            <line x1="16" y1="26" x2="50" y2="52" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="84" y1="26" x2="50" y2="52" stroke="#e2e8f0" strokeWidth="1" />
            {/* Wooden Tiller Stock */}
            <path d="M47 28 L53 28 L52 82 L48 82 Z" fill="url(#woodGrad)" stroke="#261a12" strokeWidth="1.5" />
            {/* Stirrup */}
            <circle cx="50" cy="20" r="6" fill="none" stroke="#94a3b8" strokeWidth="2" />
            {/* Bolt in Track */}
            <line x1="50" y1="25" x2="50" y2="52" stroke="#cbd5e1" strokeWidth="1.8" />
            <polygon points="50,22 47,27 53,27" fill="#64748b" />
          </g>
        )}

        {/* 12. Spiked Morningstar */}
        {type === 'morningstar' && (
          <g transform="rotate(-30 50 50)">
            {/* Handle */}
            <rect x="47" y="44" width="6" height="44" rx="2" fill="url(#woodGrad)" stroke="#261a12" strokeWidth="1" />
            <rect x="46" y="80" width="8" height="6" fill="url(#steelGrad)" />
            {/* Spiked Ball */}
            <circle cx="50" cy="30" r="16" fill="url(#steelGrad)" stroke="#0f172a" strokeWidth="2" />
            {/* Spikes */}
            <polygon points="50,10 46,20 54,20" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
            <polygon points="30,30 40,26 40,34" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
            <polygon points="70,30 60,26 60,34" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
            <polygon points="36,16 45,24 40,29" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
            <polygon points="64,16 55,24 60,29" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
            <polygon points="36,44 45,36 40,31" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
            <polygon points="64,44 55,36 60,31" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
          </g>
        )}

        {/* 13. Javelins / Spears */}
        {type === 'javelins' && (
          <g>
            {/* Spear 1 */}
            <g transform="rotate(-15 50 50)">
              <rect x="36" y="32" width="4" height="58" rx="1" fill="url(#woodGrad)" stroke="#261a12" strokeWidth="0.8" />
              {/* Spearhead */}
              <polygon points="38,12 33,26 43,26" fill="url(#bladeGrad)" stroke="#334155" strokeWidth="1" />
              <rect x="35" y="26" width="6" height="6" fill="url(#brassGrad)" />
            </g>
            {/* Spear 2 */}
            <g transform="rotate(15 50 50)">
              <rect x="60" y="32" width="4" height="58" rx="1" fill="url(#woodGrad)" stroke="#261a12" strokeWidth="0.8" />
              {/* Spearhead */}
              <polygon points="62,12 57,26 67,26" fill="url(#bladeGrad)" stroke="#334155" strokeWidth="1" />
              <rect x="59" y="26" width="6" height="6" fill="url(#brassGrad)" />
            </g>
          </g>
        )}

        {/* 14. Golden Chalice */}
        {type === 'golden_chalice' && (
          <g>
            {/* Cup */}
            <path
              d="M32 20 C32 44, 44 52, 48 54 L48 70 L40 78 L60 78 L52 70 L52 54 C56 52, 68 44, 68 20 Z"
              fill="url(#goldGlow)"
              stroke="#583101"
              strokeWidth="2"
            />
            {/* Embedded Ruby */}
            <polygon points="50,32 55,37 50,42 45,37" fill="#dc2626" stroke="#450a0a" strokeWidth="1" />
            {/* Golden Rim */}
            <ellipse cx="50" cy="20" rx="18" ry="4" fill="#fef08a" stroke="#713f12" strokeWidth="1" />
          </g>
        )}

        {/* 15. Royal Crown */}
        {type === 'royal_crown' && (
          <g>
            <path
              d="M20 64 L22 36 L34 50 L50 28 L66 50 L78 36 L80 64 Z"
              fill="url(#goldGlow)"
              stroke="#583101"
              strokeWidth="2"
            />
            {/* Base Band */}
            <rect x="20" y="62" width="60" height="10" rx="2" fill="#ca8a04" stroke="#713f12" strokeWidth="1" />
            {/* Jewels */}
            <circle cx="28" cy="67" r="2.5" fill="#dc2626" />
            <circle cx="39" cy="67" r="2.5" fill="#2563eb" />
            <circle cx="50" cy="67" r="2.5" fill="#16a34a" />
            <circle cx="61" cy="67" r="2.5" fill="#2563eb" />
            <circle cx="72" cy="67" r="2.5" fill="#dc2626" />
            {/* Peak pearls */}
            <circle cx="22" cy="34" r="2.5" fill="#ffffff" stroke="#713f12" strokeWidth="0.8" />
            <circle cx="50" cy="26" r="3" fill="#ffffff" stroke="#713f12" strokeWidth="0.8" />
            <circle cx="78" cy="34" r="2.5" fill="#ffffff" stroke="#713f12" strokeWidth="0.8" />
          </g>
        )}

        {/* 16. Ancient Grimoire */}
        {type === 'ancient_grimoire' && (
          <g transform="rotate(10 50 50)">
            <rect x="26" y="20" width="48" height="60" rx="4" fill="#3f2e23" stroke="#1c130d" strokeWidth="2" />
            <rect x="26" y="20" width="8" height="60" rx="2" fill="#24180f" />
            {/* Brass Corner Guards */}
            <polygon points="26,20 38,20 26,32" fill="url(#brassGrad)" />
            <polygon points="74,20 62,20 74,32" fill="url(#brassGrad)" />
            <polygon points="74,80 62,80 74,68" fill="url(#brassGrad)" />
            <polygon points="26,80 38,80 26,68" fill="url(#brassGrad)" />
            {/* Mystic Center Seal */}
            <circle cx="52" cy="50" r="10" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
            <polygon points="52,42 60,55 44,55" fill="none" stroke="#fcd34d" strokeWidth="1" />
            <polygon points="52,58 60,45 44,45" fill="none" stroke="#fcd34d" strokeWidth="1" />
          </g>
        )}

        {/* 17. Iron Gauntlet */}
        {type === 'iron_gauntlet' && (
          <g>
            <path
              d="M36 28 C36 24, 46 20, 56 22 L62 48 C66 52, 66 60, 62 68 L60 82 L40 82 L38 68 C34 60, 34 52, 36 28 Z"
              fill="url(#steelGrad)"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Knuckle Flutes */}
            <rect x="36" y="32" width="26" height="5" rx="1.5" fill="url(#brassGrad)" />
            <rect x="38" y="42" width="24" height="4" rx="1.5" fill="#475569" />
            <rect x="39" y="52" width="22" height="4" rx="1.5" fill="#475569" />
            {/* Thumb */}
            <path d="M36 44 C30 46, 28 54, 34 58 L37 54 Z" fill="url(#steelGrad)" stroke="#0f172a" strokeWidth="1" />
          </g>
        )}

        {/* 18. Hunting Horn */}
        {type === 'hunting_horn' && (
          <g transform="rotate(-15 50 50)">
            <path
              d="M24 64 C28 42, 54 26, 76 34 L78 44 C60 38, 40 48, 36 68 Z"
              fill="url(#goldGlow)"
              stroke="#583101"
              strokeWidth="2"
            />
            {/* Mouthpiece */}
            <rect x="22" y="62" width="6" height="8" rx="1" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="1" />
            {/* Flared Bell */}
            <ellipse cx="77" cy="39" rx="4" ry="7" fill="#451a03" stroke="#fef08a" strokeWidth="1.2" />
          </g>
        )}
      </svg>
    </div>
  );
};
