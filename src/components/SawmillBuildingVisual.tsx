import React from 'react';

interface SawmillBuildingVisualProps {
  level?: number;
  className?: string;
  isWorldMap?: boolean;
}

export const SawmillBuildingVisual: React.FC<SawmillBuildingVisualProps> = ({
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
          <linearGradient id="sawmillWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="sawBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="plankGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
        </defs>

        {/* Soft Ground Shadow & Woodchip/Dirt Yard */}
        <ellipse cx="120" cy="155" rx="105" ry="20" fill="#1c1917" opacity="0.65" />
        <ellipse cx="120" cy="152" rx="90" ry="14" fill="#292524" />
        {/* Scattered yellow woodchip shavings */}
        <circle cx="105" cy="153" r="2" fill="#ca8a04" opacity="0.8" />
        <circle cx="112" cy="156" r="2.5" fill="#eab308" opacity="0.8" />
        <circle cx="95" cy="154" r="1.5" fill="#ca8a04" opacity="0.7" />
        <circle cx="135" cy="155" r="2" fill="#eab308" opacity="0.8" />

        {/* Mill Water Flume Stream (Running down the left side) */}
        <path
          d="M 15 80 L 45 80 L 42 165 L 12 165 Z"
          fill="url(#sawmillWaterGrad)"
          opacity="0.85"
        />
        <path
          d="M 18 80 L 22 165 M 32 80 L 35 165 M 40 80 L 41 165"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.6"
        />
        {/* Splash foam at base */}
        <ellipse cx="28" cy="162" rx="14" ry="4" fill="#e0f2fe" opacity="0.8" />

        {/* Big Rotating Timber Waterwheel (Left) */}
        <g transform="translate(30, 120)">
          {/* Wheel rim outer */}
          <circle cx="0" cy="0" r="28" fill="none" stroke="#451a03" strokeWidth="4" />
          <circle cx="0" cy="0" r="25" fill="#1c1917" opacity="0.4" />
          <circle cx="0" cy="0" r="12" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <circle cx="0" cy="0" r="4" fill="#a8a29e" stroke="#1c1917" strokeWidth="1.5" />

          {/* Wheel 8 wooden paddles */}
          <g className="animate-[spin_10s_linear_infinite] origin-center">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle})`}>
                <line x1="0" y1="4" x2="0" y2="28" stroke="#78350f" strokeWidth="2.5" />
                <rect x="-4" y="24" width="8" height="3" rx="0.5" fill="#b45309" stroke="#451a03" strokeWidth="1" />
              </g>
            ))}
          </g>
        </g>

        {/* Riverstone Masonry Foundation (Center & Right) */}
        <rect x="52" y="132" width="145" height="20" rx="3" fill="#44403c" stroke="#1c1917" strokeWidth="2" />
        <path
          d="M 52 142 L 197 142 M 75 132 L 75 142 M 115 132 L 115 142 M 155 132 L 155 142 M 95 142 L 95 152 M 135 142 L 135 152 M 175 142 L 175 152"
          stroke="#292524"
          strokeWidth="1.5"
        />

        {/* Sawmill Building Main Timber Structure */}
        {/* Rear Wall Plank Paneling */}
        <polygon points="56,70 125,32 194,70 194,132 56,132" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        {/* Horizontal plank groove lines */}
        {[85, 98, 110, 122].map((y) => (
          <line key={y} x1="57" y1={y} x2="193" y2={y} stroke="#451a03" strokeWidth="1.5" opacity="0.7" />
        ))}

        {/* Heavy Oak Timber Corner Columns */}
        <rect x="54" y="68" width="8" height="66" rx="1.5" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />
        <rect x="188" y="68" width="8" height="66" rx="1.5" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />
        <rect x="121" y="70" width="8" height="64" rx="1.5" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />

        {/* Open Workshop Bay Arch */}
        <path d="M 68 132 L 68 85 Q 94 75 121 85 L 121 132 Z" fill="#1c1917" opacity="0.85" />

        {/* Log Carriage Track & Slide Mechanism */}
        <rect x="64" y="122" width="60" height="7" rx="1" fill="#292524" stroke="#1c1917" strokeWidth="1" />
        <line x1="66" y1="125" x2="122" y2="125" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Large Timber Log being cut */}
        <ellipse cx="76" cy="116" rx="6" ry="7" fill="#b45309" stroke="#451a03" strokeWidth="1.5" />
        <rect x="76" y="109" width="38" height="14" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />

        {/* Giant Circular Steel Saw Blade (Cutting through log) */}
        <g transform="translate(100, 114)">
          <circle cx="0" cy="0" r="14" fill="url(#sawBladeGrad)" stroke="#1e293b" strokeWidth="1.5" />
          {/* Central Iron Arbor Hub */}
          <circle cx="0" cy="0" r="4.5" fill="#0f172a" />
          <circle cx="0" cy="0" r="2" fill="#e2e8f0" />
          {/* Saw Teeth Rays */}
          <g className="animate-[spin_2s_linear_infinite] origin-center">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <line
                key={i}
                x1="0"
                y1="-11"
                x2="3"
                y2="-15"
                stroke="#f8fafc"
                strokeWidth="1.8"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>
          {/* Flying bright cutting sparks & sawdust */}
          <circle cx="4" cy="9" r="1.5" fill="#fde047" className="animate-ping" />
          <circle cx="-5" cy="8" r="1.2" fill="#ea580c" />
          <circle cx="7" cy="11" r="1.2" fill="#fbbf24" />
        </g>

        {/* Sawdust Pile Beneath Saw */}
        <path d="M 88 132 Q 100 124 112 132 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Neatly Stacked Lumber Planks (Right Bay) */}
        <g transform="translate(136, 102)">
          {/* Stack 1 */}
          <rect x="0" y="22" width="46" height="4" rx="0.5" fill="url(#plankGrad)" stroke="#78350f" strokeWidth="0.8" />
          <rect x="2" y="17" width="44" height="4" rx="0.5" fill="url(#plankGrad)" stroke="#78350f" strokeWidth="0.8" />
          <rect x="0" y="12" width="46" height="4" rx="0.5" fill="url(#plankGrad)" stroke="#78350f" strokeWidth="0.8" />
          <rect x="4" y="7" width="40" height="4" rx="0.5" fill="url(#plankGrad)" stroke="#78350f" strokeWidth="0.8" />
          <rect x="8" y="2" width="32" height="4" rx="0.5" fill="url(#plankGrad)" stroke="#78350f" strokeWidth="0.8" />
          {/* Binding Ropes */}
          <line x1="12" y1="2" x2="12" y2="26" stroke="#451a03" strokeWidth="1" strokeDasharray="1,1" />
          <line x1="36" y1="2" x2="36" y2="26" stroke="#451a03" strokeWidth="1" strokeDasharray="1,1" />
          {/* Finished plank ends display */}
          <circle cx="46" cy="14" r="1.5" fill="#451a03" />
        </g>

        {/* Overhead Gantry Crane Beam with Rope & Pulley */}
        <rect x="52" y="66" width="144" height="5" rx="1" fill="#451a03" stroke="#1c1917" strokeWidth="1.2" />
        <rect x="94" y="63" width="14" height="6" rx="1" fill="#713f12" />
        <line x1="101" y1="69" x2="101" y2="82" stroke="#451a03" strokeWidth="1.5" />
        <path d="M 98 82 Q 101 87 104 84" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

        {/* Gabled Timber Roof with Overhang */}
        <polygon points="46,74 125,28 204,74 196,78 125,36 54,78" fill="#451a03" stroke="#1c1917" strokeWidth="2" />
        <polygon points="52,70 125,30 198,70" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
        {/* Shingle Layers on Roof */}
        <path d="M 68 62 L 125 31 L 182 62" fill="none" stroke="#78350f" strokeWidth="2.5" />
        <path d="M 85 52 L 125 31 L 165 52" fill="none" stroke="#b45309" strokeWidth="2.5" />
        <path d="M 102 42 L 125 31 L 148 42" fill="none" stroke="#78350f" strokeWidth="2" />

        {/* Roof Peak Ridge Cap & Weather Vane */}
        <rect x="122" y="24" width="6" height="7" fill="#451a03" />
        <line x1="125" y1="24" x2="125" y2="14" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <polygon points="125,14 135,16 125,18" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />

        {/* Glowing Brass Oil Lantern on Post */}
        <path d="M 188 78 L 198 78 L 198 84" fill="none" stroke="#1c1917" strokeWidth="1.5" />
        <rect x="195" y="84" width="6" height="9" rx="1.5" fill="#f59e0b" stroke="#451a03" strokeWidth="1" className="animate-pulse" />
        <ellipse cx="198" cy="88" rx="7" ry="7" fill="#fef08a" opacity="0.3" className="animate-ping" />

        {/* Wooden Signboard: Sawmill */}
        <g transform="translate(125, 78)">
          <rect x="-24" y="-8" width="48" height="15" rx="3" fill="#292524" stroke="#d97706" strokeWidth="1.5" />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="0.5"
          >
            SAWMILL
          </text>
        </g>
      </svg>

      {/* Floating Interactive Badge / Tag */}
      <div className="mt-1 flex items-center gap-1.5 bg-stone-950/90 px-3 py-1 rounded-full border border-amber-500/60 shadow-xl group-hover:border-amber-400 group-hover:scale-105 transition-all">
        <span className="text-sm">⚙️</span>
        <span className="text-xs font-bold text-amber-200">Timber Sawmill</span>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-700/50">
          Craft Planks
        </span>
      </div>
    </div>
  );
};
