import React from 'react';
import { AnimalMonster, ANIMAL_DEFINITIONS } from '../types/game';

interface AnimalMonsterGraphicProps {
  monster: AnimalMonster;
  onAttack?: (monsterId: string) => void;
}

export const AnimalMonsterGraphic: React.FC<AnimalMonsterGraphicProps> = React.memo(({ monster, onAttack }) => {
  const def = ANIMAL_DEFINITIONS[monster.type];
  const hpPercent = Math.max(0, Math.min(100, (monster.currentHp / monster.maxHp) * 100));
  const isDead = monster.state === 'dead';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (!isDead && onAttack) onAttack(monster.id);
      }}
      className={`absolute select-none flex flex-col items-center cursor-pointer transition-transform duration-100 ${
        monster.isHit ? 'filter brightness-150 contrast-125' : ''
      }`}
      style={{
        left: `${monster.x}px`,
        top: `${monster.y}px`,
        transform: `translate(-50%, -75%) ${isDead ? 'scale(0.85) rotate(70deg)' : ''}`,
        opacity: isDead ? 0.4 : 1,
        transition: isDead ? 'all 0.6s ease-out' : 'transform 0.1s ease-out',
        zIndex: Math.round(monster.y) + 10,
      }}
    >
      {/* Aggro Alert Indicator */}
      {monster.isAggro && !isDead && (
        <div className="mb-1 flex items-center gap-1 bg-red-600/90 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-red-400 animate-bounce pointer-events-none">
          <span className="text-amber-300">⚠️</span>
          <span>ATTACKING!</span>
        </div>
      )}

      {/* Monster HP Bar & Name */}
      {!isDead && (
        <div className="mb-1 flex flex-col items-center pointer-events-none">
          <div className="flex items-center gap-1 bg-stone-950/80 px-1.5 py-0.5 rounded text-[8px] text-stone-200 font-bold border border-stone-700/80 whitespace-nowrap shadow">
            <span>{def.icon}</span>
            <span>{def.name}</span>
            <span className="text-amber-400 font-mono">+{def.goldReward}g</span>
          </div>
          <div className="w-14 h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-700 mt-0.5 p-0.2">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 20 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Monster Model Container with directional flip */}
      <div
        className={`relative flex items-center justify-center ${
          monster.state === 'attacking' ? 'animate-ping' : monster.state === 'chasing' ? 'scale-105' : ''
        }`}
        style={{
          transform: monster.facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        {/* Soft Ground Shadow */}
        <div className="absolute -bottom-1 w-16 h-4 bg-black/40 rounded-full blur-[2px]" />

        {/* 1. WILD BOAR */}
        {monster.type === 'wild_boar' && (
          <div className="relative w-16 h-12 flex items-center justify-center">
            <svg viewBox="0 0 64 48" className="w-full h-full drop-shadow-md overflow-visible">
              {/* Legs */}
              <rect x="16" y="32" width="5" height="12" rx="2" fill="#451a03" />
              <rect x="25" y="34" width="5" height="10" rx="2" fill="#291203" />
              <rect x="42" y="32" width="5" height="12" rx="2" fill="#451a03" />
              <rect x="50" y="34" width="5" height="10" rx="2" fill="#291203" />

              {/* Robust Boar Body */}
              <ellipse cx="32" cy="24" rx="20" ry="14" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              {/* Dark Back Bristle Spine */}
              <path d="M 16 14 Q 28 8 44 16 L 40 20 Q 28 14 18 18 Z" fill="#291203" />

              {/* Boar Head & Snout */}
              <path d="M 40 16 L 56 22 L 54 32 L 38 30 Z" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
              <ellipse cx="56" cy="26" rx="4" ry="5" fill="#f43f5e" />
              <circle cx="56" cy="25" r="1.5" fill="#881337" />
              <circle cx="56" cy="28" r="1.5" fill="#881337" />

              {/* Razor White Curved Tusk */}
              <path d="M 52 28 Q 58 30 57 20 Q 54 26 50 27 Z" fill="#f8fafc" stroke="#451a03" strokeWidth="1" />

              {/* Piercing Eye */}
              <circle cx="44" cy="20" r="2" fill="#ef4444" />
              <circle cx="44" cy="20" r="0.8" fill="#ffffff" />

              {/* Boar Ear */}
              <polygon points="36,16 42,8 44,17" fill="#78350f" stroke="#451a03" strokeWidth="1" />

              {/* Curly Tail */}
              <path d="M 12 22 Q 8 16 10 12" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* 2. DIRE WOLF */}
        {monster.type === 'dire_wolf' && (
          <div className="relative w-20 h-14 flex items-center justify-center">
            <svg viewBox="0 0 76 52" className="w-full h-full drop-shadow-md overflow-visible">
              {/* Back Legs */}
              <rect x="14" y="32" width="5" height="16" rx="2" fill="#334155" />
              <rect x="22" y="34" width="5" height="14" rx="2" fill="#1e293b" />
              {/* Front Legs */}
              <rect x="48" y="32" width="5" height="16" rx="2" fill="#334155" />
              <rect x="56" y="34" width="5" height="14" rx="2" fill="#1e293b" />

              {/* Bushy Wolf Tail */}
              <path d="M 12 24 C 6 28 4 36 2 40 C 6 36 10 32 14 28 Z" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />

              {/* Sleek Torso */}
              <ellipse cx="34" cy="26" rx="22" ry="12" fill="#64748b" stroke="#334155" strokeWidth="2" />
              {/* Silver Chest Ruff */}
              <path d="M 46 20 Q 56 26 48 34 Q 42 28 46 20 Z" fill="#cbd5e1" />

              {/* Wolf Head */}
              <path d="M 46 20 L 64 16 L 68 24 L 52 30 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
              {/* Snout and Black Nose */}
              <ellipse cx="68" cy="22" rx="2" ry="2.5" fill="#0f172a" />

              {/* Pointed Ears */}
              <polygon points="46,18 48,6 54,16" fill="#475569" stroke="#1e293b" strokeWidth="1" />
              <polygon points="52,18 56,8 60,17" fill="#475569" stroke="#1e293b" strokeWidth="1" />

              {/* Glowing Yellow/Amber Eye */}
              <circle cx="56" cy="18" r="2.2" fill="#fbbf24" className="animate-pulse" />
              <circle cx="56" cy="18" r="1" fill="#0f172a" />

              {/* Sharp Fangs */}
              <polygon points="62,24 64,28 66,24" fill="#ffffff" />
            </svg>
          </div>
        )}

        {/* 3. GRIZZLY BEAR */}
        {monster.type === 'grizzly_bear' && (
          <div className="relative w-24 h-16 flex items-center justify-center">
            <svg viewBox="0 0 90 60" className="w-full h-full drop-shadow-md overflow-visible">
              {/* Heavy Bear Limbs */}
              <rect x="20" y="38" width="8" height="18" rx="3" fill="#451a03" />
              <rect x="32" y="40" width="8" height="16" rx="3" fill="#291203" />
              <rect x="60" y="38" width="8" height="18" rx="3" fill="#451a03" />
              <rect x="70" y="40" width="8" height="16" rx="3" fill="#291203" />

              {/* Massive Bear Torso & Heavy Shoulder Hump */}
              <ellipse cx="44" cy="30" rx="28" ry="18" fill="#5c2605" stroke="#291203" strokeWidth="2.5" />
              <circle cx="56" cy="22" r="14" fill="#713f12" />

              {/* Stubby Tail */}
              <circle cx="15" cy="26" r="4.5" fill="#451a03" />

              {/* Bear Head and Thick Snout */}
              <circle cx="68" cy="24" r="12" fill="#713f12" stroke="#291203" strokeWidth="1.5" />
              <ellipse cx="76" cy="27" rx="6" ry="5" fill="#a16207" />
              <circle cx="80" cy="26" r="2.5" fill="#1c1917" />

              {/* Round Ears */}
              <circle cx="62" cy="14" r="4.5" fill="#451a03" stroke="#291203" strokeWidth="1" />
              <circle cx="70" cy="13" r="4" fill="#451a03" stroke="#291203" strokeWidth="1" />

              {/* Deep Eyes */}
              <circle cx="70" cy="22" r="1.8" fill="#f97316" />
              <circle cx="70" cy="22" r="0.8" fill="#1c1917" />

              {/* Claws */}
              <line x1="61" y1="56" x2="61" y2="59" stroke="#f5f5f4" strokeWidth="1.5" />
              <line x1="64" y1="56" x2="64" y2="59" stroke="#f5f5f4" strokeWidth="1.5" />
              <line x1="67" y1="56" x2="67" y2="59" stroke="#f5f5f4" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* 4. SHADOW DRAKE */}
        {monster.type === 'shadow_drake' && (
          <div className="relative w-28 h-20 flex items-center justify-center">
            <svg viewBox="0 0 100 70" className="w-full h-full drop-shadow-xl overflow-visible">
              <defs>
                <radialGradient id={`drakeAura_${monster.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Arcane Mystic Aura */}
              <circle cx="50" cy="35" r="38" fill={`url(#drakeAura_${monster.id})`} className="animate-pulse" />

              {/* Claws & Legs */}
              <path d="M 30 46 L 26 62 L 32 62" stroke="#2e1065" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 64 46 L 68 62 L 74 62" stroke="#2e1065" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Long Spaded Dragon Tail */}
              <path d="M 22 36 Q 10 32 6 42 Q 2 48 8 54" fill="none" stroke="#4c1d95" strokeWidth="4" strokeLinecap="round" />
              <polygon points="6,50 0,56 8,58" fill="#c084fc" />

              {/* Mystic Body */}
              <ellipse cx="48" cy="38" rx="25" ry="15" fill="#3b0764" stroke="#1e1b4b" strokeWidth="2.5" />

              {/* Dragon Wings */}
              <g className="animate-pulse">
                <path d="M 44 28 Q 30 6 52 4 Q 40 18 48 26 Z" fill="#6b21a8" stroke="#c084fc" strokeWidth="1.5" />
                <path d="M 52 28 Q 65 8 78 8 Q 62 20 54 26 Z" fill="#7e22ce" stroke="#c084fc" strokeWidth="1.5" />
              </g>

              {/* Dragon Neck & Horned Head */}
              <path d="M 64 34 Q 74 24 82 22 L 90 28 L 74 38 Z" fill="#581c87" stroke="#1e1b4b" strokeWidth="2" />

              {/* Glowing Arcane Horns */}
              <path d="M 76 22 Q 82 12 90 8" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 72 24 Q 76 15 82 12" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />

              {/* Glowing Arcane Eye */}
              <circle cx="82" cy="25" r="2.5" fill="#f43f5e" className="animate-ping" />
              <circle cx="82" cy="25" r="2" fill="#fb7185" />

              {/* Mystic runes on scales */}
              <circle cx="40" cy="36" r="1.5" fill="#c084fc" className="animate-pulse" />
              <circle cx="48" cy="40" r="2" fill="#c084fc" className="animate-pulse" />
              <circle cx="56" cy="36" r="1.5" fill="#c084fc" className="animate-pulse" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
});
