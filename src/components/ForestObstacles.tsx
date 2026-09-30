import React from 'react';
import { ForestObstacle } from '../types/game';

interface ForestObstaclesProps {
  obstacles: ForestObstacle[];
}

export const ForestObstacles: React.FC<ForestObstaclesProps> = React.memo(({ obstacles }) => {
  return (
    <>
      {obstacles.map((obs) => {
        if (obs.type === 'boulder') {
          return (
            <div
              key={obs.id}
              className="absolute pointer-events-none select-none flex items-center justify-center"
              style={{
                left: `${obs.x}px`,
                top: `${obs.y}px`,
                transform: 'translate(-50%, -65%)',
                zIndex: Math.round(obs.y) - 5,
              }}
            >
              {/* Soft Ground Shadow */}
              <div className="absolute -bottom-1 w-24 h-8 bg-black/40 rounded-full blur-[3px]" />

              <svg viewBox="0 0 100 80" className="w-24 h-20 drop-shadow-md overflow-visible">
                {/* Main Boulder Silhouette */}
                <path
                  d="M 15 55 C 10 40 25 15 50 12 C 75 10 92 28 88 52 C 85 70 70 75 48 76 C 25 76 18 68 15 55 Z"
                  fill="#57534e"
                  stroke="#292524"
                  strokeWidth="2.5"
                />
                {/* Secondary Rock Shading */}
                <path
                  d="M 22 56 C 20 44 32 24 52 20 C 66 18 80 28 78 48 C 76 64 64 68 45 68 C 30 68 24 62 22 56 Z"
                  fill="#78716c"
                />
                {/* Light highlight face */}
                <path
                  d="M 35 24 C 45 18 65 18 72 26 C 62 30 46 32 35 24 Z"
                  fill="#a8a29e"
                  opacity="0.6"
                />
                {/* Stone fissures/cracks */}
                <path d="M 45 28 L 52 42 L 48 56" stroke="#292524" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M 68 34 L 62 46" stroke="#292524" strokeWidth="1.2" fill="none" opacity="0.6" />

                {/* Lush Forest Moss Patches */}
                <path
                  d="M 30 18 Q 42 12 55 16 Q 48 24 38 24 Z"
                  fill="#4d7c0f"
                />
                <circle cx="36" cy="18" r="4" fill="#65a30d" />
                <circle cx="48" cy="16" r="3.5" fill="#84cc16" />
                <circle cx="28" cy="45" r="4.5" fill="#4d7c0f" />
                <circle cx="31" cy="47" r="3" fill="#65a30d" />

                {/* Small adjacent pebble cluster */}
                <ellipse cx="88" cy="68" rx="6" ry="3.5" fill="#44403c" stroke="#1c1917" strokeWidth="1" />
                <ellipse cx="12" cy="65" rx="5" ry="3" fill="#44403c" stroke="#1c1917" strokeWidth="1" />
              </svg>
            </div>
          );
        }

        if (obs.type === 'fallen_log') {
          const rot = obs.rotation || 0;
          return (
            <div
              key={obs.id}
              className="absolute pointer-events-none select-none flex items-center justify-center"
              style={{
                left: `${obs.x}px`,
                top: `${obs.y}px`,
                transform: `translate(-50%, -50%) rotate(${rot}deg)`,
                zIndex: Math.round(obs.y) - 5,
              }}
            >
              {/* Soft Ground Shadow */}
              <div className="absolute -bottom-1 w-32 h-9 bg-black/45 rounded-full blur-[3px]" />

              <svg viewBox="0 0 140 50" className="w-32 h-14 drop-shadow-md overflow-visible">
                {/* Horizontal Hollow Tree Trunk */}
                <path
                  d="M 20 12 L 120 12 C 126 12 128 22 128 32 C 128 42 124 46 118 46 L 22 46 C 14 46 12 38 12 28 C 12 18 16 12 20 12 Z"
                  fill="#451a03"
                  stroke="#1c1917"
                  strokeWidth="2.5"
                />
                {/* Bark upper highlights and grain lines */}
                <rect x="22" y="15" width="98" height="12" rx="2" fill="#78350f" />
                <line x1="28" y1="20" x2="114" y2="20" stroke="#451a03" strokeWidth="1.5" opacity="0.7" />
                <line x1="35" y1="24" x2="105" y2="24" stroke="#451a03" strokeWidth="1.5" opacity="0.7" />
                <line x1="25" y1="36" x2="118" y2="36" stroke="#292524" strokeWidth="1.5" opacity="0.8" />

                {/* Left Cut End / Hollow Tree Ring */}
                <ellipse cx="20" cy="29" rx="8" ry="16" fill="#b45309" stroke="#451a03" strokeWidth="2" />
                <ellipse cx="20" cy="29" rx="5" ry="11" fill="#78350f" />
                <ellipse cx="20" cy="29" rx="2.5" ry="5.5" fill="#1c1917" />

                {/* Moss Overgrowth */}
                <path d="M 45 12 Q 60 8 75 13 Q 65 18 50 17 Z" fill="#4d7c0f" />
                <circle cx="58" cy="14" r="3" fill="#84cc16" />
                <circle cx="70" cy="13" r="2.5" fill="#a3e635" />

                {/* Wild Sprouting Forest Mushrooms */}
                {/* Mushroom 1 */}
                <path d="M 85 14 L 86 6" stroke="#f5f5f4" strokeWidth="2" />
                <path d="M 82 8 C 82 2 91 2 91 8 Z" fill="#ea580c" />
                <circle cx="85" cy="5" r="0.8" fill="#fef08a" />
                {/* Mushroom 2 */}
                <path d="M 94 15 L 95 9" stroke="#f5f5f4" strokeWidth="1.8" />
                <path d="M 92 10 C 92 5 99 5 99 10 Z" fill="#f97316" />
                {/* Bracket fungus on side */}
                <ellipse cx="106" cy="30" rx="5" ry="2.5" fill="#d97706" />
                <ellipse cx="107" cy="35" rx="4" ry="2" fill="#b45309" />
              </svg>
            </div>
          );
        }

        if (obs.type === 'bramble') {
          return (
            <div
              key={obs.id}
              className="absolute pointer-events-none select-none flex items-center justify-center"
              style={{
                left: `${obs.x}px`,
                top: `${obs.y}px`,
                transform: 'translate(-50%, -60%)',
                zIndex: Math.round(obs.y) - 5,
              }}
            >
              {/* Soft Ground Shadow */}
              <div className="absolute -bottom-1 w-24 h-9 bg-black/40 rounded-full blur-[3px]" />

              <svg viewBox="0 0 100 80" className="w-24 h-20 drop-shadow-sm overflow-visible">
                {/* Tangled Thorny Vine Stems */}
                <path
                  d="M 20 65 Q 35 30 50 40 T 80 55"
                  fill="none"
                  stroke="#3f2305"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 30 68 Q 45 20 68 25 T 85 62"
                  fill="none"
                  stroke="#2c1810"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 15 50 Q 50 15 75 45"
                  fill="none"
                  stroke="#451a03"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Sharp Thorns */}
                <line x1="32" y1="42" x2="28" y2="38" stroke="#1c1917" strokeWidth="2" />
                <line x1="45" y1="32" x2="48" y2="26" stroke="#1c1917" strokeWidth="2" />
                <line x1="62" y1="28" x2="68" y2="22" stroke="#1c1917" strokeWidth="2" />
                <line x1="72" y1="48" x2="78" y2="45" stroke="#1c1917" strokeWidth="2" />

                {/* Dense Serrated Leaves */}
                <circle cx="36" cy="48" r="8" fill="#14532d" />
                <circle cx="48" cy="38" r="9" fill="#166534" />
                <circle cx="62" cy="42" r="9.5" fill="#15803d" />
                <circle cx="50" cy="52" r="10" fill="#166534" />
                <circle cx="68" cy="54" r="8" fill="#14532d" />
                <circle cx="32" cy="58" r="7" fill="#14532d" />

                {/* Leaf Highlights */}
                <circle cx="46" cy="36" r="4.5" fill="#22c55e" opacity="0.7" />
                <circle cx="60" cy="40" r="4.5" fill="#4ade80" opacity="0.6" />

                {/* Ripe Wild Forest Berries */}
                <circle cx="40" cy="44" r="3.5" fill="#dc2626" />
                <circle cx="42" cy="43" r="1" fill="#fecaca" />

                <circle cx="56" cy="48" r="3.5" fill="#991b1b" />
                <circle cx="58" cy="47" r="1" fill="#fecaca" />

                <circle cx="64" cy="36" r="3.5" fill="#dc2626" />
                <circle cx="66" cy="35" r="1" fill="#fecaca" />

                <circle cx="70" cy="50" r="3" fill="#7f1d1d" />
                <circle cx="34" cy="54" r="3" fill="#b91c1c" />
              </svg>
            </div>
          );
        }

        if (obs.type === 'monolith') {
          return (
            <div
              key={obs.id}
              className="absolute pointer-events-none select-none flex items-center justify-center"
              style={{
                left: `${obs.x}px`,
                top: `${obs.y}px`,
                transform: 'translate(-50%, -85%)',
                zIndex: Math.round(obs.y) - 5,
              }}
            >
              {/* Soft Ground Shadow */}
              <div className="absolute -bottom-2 w-20 h-7 bg-black/45 rounded-full blur-[3px]" />

              <svg viewBox="0 0 80 120" className="w-20 h-28 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id={`runeGlow_${obs.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                {/* Base Rubble Slabs */}
                <polygon points="12,110 68,110 64,118 16,118" fill="#292524" stroke="#1c1917" strokeWidth="2" />
                <polygon points="18,102 62,102 66,110 14,110" fill="#44403c" stroke="#292524" strokeWidth="1.5" />

                {/* Ancient Weathered Standing Obelisk Pillar */}
                <polygon
                  points="24,102 28,18 40,8 52,18 56,102"
                  fill="#57534e"
                  stroke="#1c1917"
                  strokeWidth="2.5"
                />
                {/* Lit Facet Shading */}
                <polygon
                  points="40,8 52,18 56,102 40,102"
                  fill="#78716c"
                />
                <polygon
                  points="28,18 40,8 40,102 24,102"
                  fill="#44403c"
                />

                {/* Glowing Arcane Runic Inscriptions */}
                <g stroke={`url(#runeGlow_${obs.id})`} strokeWidth="2" strokeLinecap="round" fill="none" className="animate-pulse">
                  {/* Rune 1: Diamond Crest */}
                  <polygon points="40,24 45,30 40,36 35,30" strokeWidth="1.8" />
                  <line x1="40" y1="20" x2="40" y2="42" strokeWidth="1.8" />
                  {/* Rune 2: Arcane Glyphs */}
                  <path d="M 35 48 L 45 48 M 40 44 L 40 58 M 36 56 L 44 56" />
                  {/* Rune 3: Spiraling Sigil */}
                  <circle cx="40" cy="70" r="4.5" strokeWidth="1.8" />
                  <line x1="40" y1="64" x2="40" y2="84" strokeWidth="1.8" />
                  <path d="M 34 78 L 40 84 L 46 78" strokeWidth="1.8" />
                </g>

                {/* Glowing Core Gem */}
                <circle cx="40" cy="30" r="2.5" fill="#86efac" className="animate-ping" />
                <circle cx="40" cy="30" r="2" fill="#ffffff" />
              </svg>
            </div>
          );
        }

        return null;
      })}
    </>
  );
});
