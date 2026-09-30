import React from 'react';
import { ToolDefinition } from '../types/game';

interface PlayerCharacterProps {
  x: number;
  y: number;
  facing: 'left' | 'right';
  isMoving: boolean;
  isChopping: boolean;
  currentTool: ToolDefinition;
  weaponUpgradeLevel: number;
  nearTreeName?: string | null;
  nearMonsterName?: string | null;
  currentHp?: number;
  maxHp?: number;
  isHit?: boolean;
}

export const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  x,
  y,
  facing,
  isMoving,
  isChopping,
  currentTool,
  weaponUpgradeLevel,
  nearTreeName,
  nearMonsterName,
  currentHp = 100,
  maxHp = 100,
  isHit = false,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  return (
    <div
      className="absolute pointer-events-none select-none transition-none flex flex-col items-center"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -85%)',
        zIndex: Math.round(y) + 15,
      }}
    >
      {/* Player Floating Health Bar (Visible in combat or when below 100%) */}
      {(currentHp < maxHp || nearMonsterName) && (
        <div className="mb-1 flex flex-col items-center pointer-events-none animate-fadeIn">
          <div className="w-16 h-2 bg-stone-950/90 rounded-full overflow-hidden border border-stone-700/80 p-0.5 shadow-md flex items-center">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : hpPercent > 25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="text-[8px] font-mono text-stone-200 font-extrabold drop-shadow">
            {currentHp} / {maxHp} HP
          </span>
        </div>
      )}

      {/* Interactive Proximity Tag / Indicator */}
      {nearMonsterName ? (
        <div className="mb-1 flex items-center gap-1 bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full text-[10px] shadow-lg animate-bounce uppercase tracking-wider border border-red-400">
          <span>⚔️</span>
          <span>Attack {nearMonsterName}!</span>
        </div>
      ) : nearTreeName ? (
        <div className="mb-1 flex items-center gap-1 bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-lg animate-bounce uppercase tracking-wider">
          <span>🪓</span>
          <span>{nearTreeName}</span>
        </div>
      ) : null}

      {/* Main Character Body Container */}
      <div
        className={`relative flex items-center justify-center transition-transform ${
          isMoving ? 'animate-bounce' : ''
        } ${isChopping ? 'scale-110' : ''} ${isHit ? 'filter brightness-150 invert-25' : ''}`}
        style={{
          transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        {/* Soft Ground Shadow */}
        <div
          className="absolute -bottom-1 w-12 h-3.5 bg-black/40 rounded-full blur-[2px]"
          style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
        />

        {/* Character Avatar SVG */}
        <div className="relative w-14 h-16 flex items-center justify-center">
          <svg viewBox="0 0 64 72" className="w-full h-full drop-shadow-lg">
            {/* Back Hair / Beanie */}
            <rect x="22" y="8" width="20" height="12" rx="6" fill="#78350f" />
            {/* Lumberjack Wool Beanie Cap */}
            <path
              d="M 20 16 C 20 8 26 4 32 4 C 38 4 44 8 44 16 Z"
              fill="#dc2626"
            />
            {/* Beanie Pom-Pom */}
            <circle cx="32" cy="3" r="3" fill="#fef2f2" />
            {/* Head */}
            <circle cx="32" cy="18" r="9" fill="#fbcfe8" />
            {/* Eyes */}
            <circle cx="35" cy="17" r="1.5" fill="#1c1917" />
            {/* Beard */}
            <path
              d="M 27 19 C 27 26 37 26 37 19 C 37 21 35 24 32 24 C 29 24 27 21 27 19 Z"
              fill="#92400e"
            />

            {/* Plaid Shirt Body */}
            <rect x="23" y="27" width="18" height="18" rx="4" fill="#b91c1c" />
            {/* Plaid Black Grid Lines */}
            <line x1="29" y1="27" x2="29" y2="45" stroke="#1c1917" strokeWidth="1.5" opacity="0.4" />
            <line x1="35" y1="27" x2="35" y2="45" stroke="#1c1917" strokeWidth="1.5" opacity="0.4" />
            <line x1="23" y1="36" x2="41" y2="36" stroke="#1c1917" strokeWidth="1.5" opacity="0.4" />

            {/* Leather Belt */}
            <rect x="22" y="44" width="20" height="4" fill="#451a03" />
            <rect x="30" y="44" width="4" height="4" fill="#fbbf24" />

            {/* Denim Trousers / Legs */}
            <rect x="24" y="48" width="7" height="14" rx="2" fill="#1e3a8a" />
            <rect x="33" y="48" width="7" height="14" rx="2" fill="#1e3a8a" />

            {/* Heavy Leather Work Boots */}
            <rect x="22" y="60" width="10" height="6" rx="2" fill="#78350f" />
            <rect x="32" y="60" width="10" height="6" rx="2" fill="#78350f" />

            {/* Swinging Axe Hand */}
            <g
              className={`origin-[26px_34px] transition-transform ${
                isChopping
                  ? 'animate-axe-swing'
                  : isMoving
                  ? 'rotate-12'
                  : 'rotate-0'
              }`}
            >
              {/* Arm */}
              <rect x="38" y="30" width="5" height="12" rx="2" fill="#b91c1c" />
              <circle cx="40.5" cy="42" r="3" fill="#fbcfe8" />

              {/* Axe Shaft */}
              <line
                x1="40"
                y1="46"
                x2="52"
                y2="18"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Axe Head */}
              <path
                d="M 50 16 L 58 12 L 60 22 L 52 24 Z"
                fill={currentTool.tier >= 4 ? '#e2e8f0' : currentTool.tier >= 2 ? '#d97706' : '#94a3b8'}
                stroke="#1e293b"
                strokeWidth="1"
              />
              <path
                d="M 58 12 Q 62 17 60 22"
                stroke="#38bdf8"
                strokeWidth="1.5"
                fill="none"
              />
            </g>

            {/* Dynamic Axe Slash Arc when chopping */}
            {isChopping && (
              <path
                d="M 58 10 A 28 28 0 0 1 52 46"
                fill="none"
                stroke="rgba(254, 240, 138, 0.85)"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Player Title & Gear Badge */}
      <div className="mt-0.5 bg-stone-950/90 px-2 py-0.5 rounded-full border border-amber-500/60 shadow flex items-center gap-1">
        <span className="text-[9px] font-bold text-amber-300">
          Lv.{weaponUpgradeLevel + 1} Settler
        </span>
        <span className="text-[8px] text-stone-400">({currentTool.name.split(' ')[0]})</span>
      </div>
    </div>
  );
};
