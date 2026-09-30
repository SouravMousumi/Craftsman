import React from 'react';

interface ForgeBuildingVisualProps {
  level?: number;
  className?: string;
  isWorldMap?: boolean;
}

export const ForgeBuildingVisual: React.FC<ForgeBuildingVisualProps> = ({
  level = 1,
  className = '',
  isWorldMap = false,
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 240 180"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          <linearGradient id="forgeFireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="45%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="hotSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="anvilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="chimneyBrickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#44403c" />
            <stop offset="50%" stopColor="#78716c" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>
        </defs>

        {/* Ground Dirt & Coal Embers Yard */}
        <ellipse cx="120" cy="155" rx="105" ry="20" fill="#1c1917" opacity="0.75" />
        <ellipse cx="120" cy="152" rx="90" ry="14" fill="#292524" />
        {/* Black coal dust and red cinder flecks */}
        <circle cx="85" cy="154" r="2" fill="#ef4444" className="animate-pulse" />
        <circle cx="95" cy="157" r="1.5" fill="#f97316" />
        <circle cx="140" cy="154" r="2.5" fill="#1c1917" />
        <circle cx="150" cy="156" r="2" fill="#ef4444" className="animate-pulse" />

        {/* 1. Stone Masonry Furnace & Chimney (Left Side) */}
        {/* Tall Chimney Stack */}
        <polygon points="46,132 46,38 72,38 72,132" fill="url(#chimneyBrickGrad)" stroke="#1c1917" strokeWidth="2" />
        {/* Chimney Cap */}
        <rect x="42" y="32" width="34" height="7" rx="1.5" fill="#292524" stroke="#1c1917" strokeWidth="1.5" />
        {/* Brick line details on chimney */}
        {[50, 64, 78, 92, 106, 120].map((y) => (
          <line key={y} x1="47" y1={y} x2="71" y2={y} stroke="#1c1917" strokeWidth="1.2" opacity="0.6" />
        ))}

        {/* Chimney Animated Smoke Puffs & Flying Sparks */}
        <g transform="translate(59, 28)">
          <circle cx="-2" cy="-6" r="6" fill="#78716c" opacity="0.6" className="animate-ping" />
          <circle cx="4" cy="-14" r="8" fill="#a8a29e" opacity="0.4" className="animate-pulse" />
          <circle cx="-1" cy="-24" r="11" fill="#d6d3d1" opacity="0.25" className="animate-pulse" />
          {/* Flying bright embers */}
          <circle cx="6" cy="-8" r="1.5" fill="#fbbf24" className="animate-bounce" />
          <circle cx="-4" cy="-18" r="1.2" fill="#f97316" />
          <circle cx="2" cy="-28" r="1" fill="#ef4444" />
        </g>

        {/* Wide Furnace Base Chamber */}
        <rect x="36" y="98" width="54" height="42" rx="4" fill="#44403c" stroke="#1c1917" strokeWidth="2" />
        {/* Fire Hearth Opening Arch */}
        <path d="M 46 140 L 46 114 Q 63 104 80 114 L 80 140 Z" fill="#1c1917" />
        {/* Roaring Hot Furnace Fire Flames */}
        <path
          d="M 50 140 Q 56 112 63 118 Q 70 110 76 140 Z"
          fill="url(#forgeFireGrad)"
          className="animate-pulse"
        />
        <circle cx="63" cy="126" r="6" fill="#fef08a" className="animate-ping" />
        <circle cx="63" cy="126" r="4" fill="#ffffff" />
        {/* Iron Grating Bar */}
        <line x1="46" y1="130" x2="80" y2="130" stroke="#0f172a" strokeWidth="2" />
        <line x1="54" y1="126" x2="54" y2="140" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="63" y1="126" x2="63" y2="140" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="72" y1="126" x2="72" y2="140" stroke="#0f172a" strokeWidth="1.5" />

        {/* Forge Leather Bellows (Left of chimney) */}
        <g transform="translate(18, 115)">
          <polygon points="0,6 18,0 18,16 0,10" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
          <line x1="18" y1="8" x2="24" y2="8" stroke="#334155" strokeWidth="2.5" />
          <circle cx="2" cy="8" r="3" fill="#ca8a04" />
        </g>

        {/* 2. Main Workshop Lean-to Timber Canopy & Rear Walls */}
        <polygon points="76,70 196,70 196,138 76,138" fill="#292524" stroke="#1c1917" strokeWidth="2" />
        {/* Heavy Oak Timber Posts */}
        <rect x="76" y="68" width="8" height="70" rx="1.5" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />
        <rect x="188" y="68" width="8" height="70" rx="1.5" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />

        {/* Wall Weapon Display Rack (Rear Wall) */}
        <rect x="94" y="78" width="84" height="26" rx="2" fill="#1c1917" stroke="#44403c" strokeWidth="1" />
        {/* Hanging Weapon 1: Two-Handed Greataxe */}
        <line x1="102" y1="83" x2="124" y2="99" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 100 82 C 94 77 96 90 106 88 Z" fill="#94a3b8" stroke="#334155" strokeWidth="1" />
        {/* Hanging Weapon 2: Polished Knight Broadsword */}
        <line x1="140" y1="82" x2="140" y2="100" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="134" y1="86" x2="146" y2="86" stroke="#ca8a04" strokeWidth="2" />
        <circle cx="140" cy="83" r="1.5" fill="#fbbf24" />
        {/* Hanging Shield: Iron Heater Shield with Gold Boss */}
        <path d="M 158 83 L 172 83 L 170 95 Q 165 102 158 95 Z" fill="#b91c1c" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="165" cy="89" r="2.5" fill="#f59e0b" />

        {/* Hanging Horseshoe for Luck */}
        <path d="M 88 84 Q 88 78 92 78 Q 96 78 96 84" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

        {/* 3. The Master Blacksmith Anvil & Stump (Center Stage) */}
        {/* Massive Oak Trunk Anvil Base Block */}
        <g transform="translate(132, 116)">
          <rect x="-14" y="8" width="28" height="22" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.8" />
          <line x1="-12" y1="14" x2="12" y2="14" stroke="#451a03" strokeWidth="1" />
          <line x1="-13" y1="22" x2="13" y2="22" stroke="#451a03" strokeWidth="1" />
          {/* Iron Reinforcing Straps */}
          <line x1="-14" y1="18" x2="14" y2="18" stroke="#334155" strokeWidth="2.5" />

          {/* Heavy Steel Anvil */}
          {/* Base foot */}
          <polygon points="-12,8 12,8 9,3 -9,3" fill="url(#anvilGrad)" stroke="#1e293b" strokeWidth="1" />
          {/* Waist / Column */}
          <rect x="-5" y="-3" width="10" height="6" fill="url(#anvilGrad)" />
          {/* Anvil Face & Horn (Left horn, right heel) */}
          <path
            d="M -18,-5 L -8,-3 L 13,-3 L 15,-5 L 14,-9 L -11,-9 Q -18,-7 -18,-5 Z"
            fill="url(#anvilGrad)"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          {/* Gleaming top working face */}
          <line x1="-10" y1="-8.5" x2="13" y2="-8.5" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Glowing Red-Hot Ingot on Anvil */}
          <rect x="-3" y="-11" width="12" height="3" rx="0.5" fill="url(#hotSteelGrad)" className="animate-pulse" />
          {/* Smithing Hammer Resting Beside Hot Steel */}
          <line x1="8" y1="-14" x2="16" y2="-5" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <rect x="5" y="-16" width="6" height="4" rx="0.8" fill="#475569" stroke="#1e293b" strokeWidth="0.8" />
          {/* Quenching tongs holding ingot */}
          <line x1="-14" y1="-10" x2="-2" y2="-10" stroke="#0f172a" strokeWidth="1.5" />

          {/* Impact Spark bursts */}
          <circle cx="3" cy="-13" r="1.5" fill="#fde047" className="animate-ping" />
          <circle cx="-1" cy="-14" r="1" fill="#f97316" />
        </g>

        {/* 4. Water Quenching Barrel with Rising Steam (Right Side) */}
        <g transform="translate(178, 126)">
          <path d="M 0,0 L 16,0 L 14,20 L 2,20 Z" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />
          {/* Iron Hoops */}
          <line x1="1" y1="6" x2="15" y2="6" stroke="#64748b" strokeWidth="1.5" />
          <line x1="2" y1="15" x2="14" y2="15" stroke="#64748b" strokeWidth="1.5" />
          {/* Water Surface inside */}
          <ellipse cx="8" cy="0" rx="7" ry="2" fill="#38bdf8" />
          {/* Rising Quench Steam */}
          <circle cx="8" cy="-6" r="3" fill="#f1f5f9" opacity="0.6" className="animate-bounce" />
          <circle cx="10" cy="-14" r="4.5" fill="#f1f5f9" opacity="0.3" className="animate-pulse" />
        </g>

        {/* Whetstone Pedal Grinder (Far Right) */}
        <g transform="translate(198, 134)">
          <circle cx="6" cy="6" r="7" fill="#64748b" stroke="#334155" strokeWidth="1.2" />
          <circle cx="6" cy="6" r="2" fill="#0f172a" />
          <line x1="0" y1="14" x2="6" y2="6" stroke="#451a03" strokeWidth="2" />
          <line x1="12" y1="14" x2="6" y2="6" stroke="#451a03" strokeWidth="2" />
        </g>

        {/* 5. Forge Gabled Canopy Roof */}
        <polygon points="38,72 135,28 208,72 200,76 135,36 46,76" fill="#292524" stroke="#1c1917" strokeWidth="2" />
        <polygon points="44,70 135,30 204,70" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        {/* Roof Shingle Ridges */}
        <path d="M 65 62 L 135 32 L 185 62" fill="none" stroke="#451a03" strokeWidth="2.5" />
        <path d="M 90 52 L 135 32 L 165 52" fill="none" stroke="#b45309" strokeWidth="2" />

        {/* Lantern on Rafter */}
        <line x1="110" y1="70" x2="110" y2="78" stroke="#1c1917" strokeWidth="1.5" />
        <rect x="107" y="78" width="6" height="8" rx="1.5" fill="#ea580c" stroke="#451a03" strokeWidth="1" className="animate-pulse" />
        <ellipse cx="110" cy="82" rx="6" ry="6" fill="#fde047" opacity="0.35" className="animate-ping" />

        {/* Wooden / Brass Signboard: FORGE */}
        <g transform="translate(135, 78)">
          <rect x="-24" y="-8" width="48" height="15" rx="3" fill="#1c1917" stroke="#e11d48" strokeWidth="1.5" />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill="#fecdd3"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="0.5"
          >
            FORGE
          </text>
        </g>
      </svg>

      {/* Floating Interactive Badge / Tag */}
      <div className="mt-1 flex items-center gap-1.5 bg-stone-950/90 px-3 py-1 rounded-full border border-rose-500/60 shadow-xl group-hover:border-rose-400 group-hover:scale-105 transition-all">
        <span className="text-sm">⚒️</span>
        <span className="text-xs font-bold text-rose-200">Blacksmith Forge</span>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-700/50">
          +2 DMG (10g)
        </span>
      </div>
    </div>
  );
};
