import React from 'react';

interface HouseBuildingVisualProps {
  level: number;
  className?: string;
  isWorldMap?: boolean;
}

export const HouseBuildingVisual: React.FC<HouseBuildingVisualProps> = ({
  level,
  className = '',
  isWorldMap = false,
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* LEVEL 0: Shabby Forest Hut / Makeshift Lean-to */}
      {level === 0 && (
        <svg
          viewBox="0 0 240 180"
          className="w-full h-full drop-shadow-xl overflow-visible"
        >
          {/* Ground dirt patch & weeds */}
          <ellipse cx="120" cy="155" rx="85" ry="18" fill="#1c1917" opacity="0.6" />
          <ellipse cx="120" cy="152" rx="72" ry="12" fill="#292524" />

          {/* Campfire stone ring & smoking embers */}
          <ellipse cx="185" cy="150" rx="16" ry="9" fill="#44403c" />
          <line x1="176" y1="148" x2="194" y2="152" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          <line x1="192" y1="147" x2="178" y2="153" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          <circle cx="185" cy="146" r="5" fill="#f97316" className="animate-pulse" />
          <circle cx="185" cy="145" r="2.5" fill="#fde047" />
          {/* Smoke puffs */}
          <circle cx="186" cy="135" r="4" fill="#a8a29e" opacity="0.5" className="animate-bounce" />
          <circle cx="189" cy="122" r="6" fill="#a8a29e" opacity="0.3" className="animate-pulse" />

          {/* Crooked wooden main support poles */}
          <path d="M 65 150 L 85 70" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          <path d="M 155 150 L 135 70" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          <path d="M 80 72 L 140 72" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />

          {/* Shabby wooden plank walls (crooked, uneven gaps) */}
          <path d="M 72 148 L 76 95 L 144 95 L 148 148 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          <line x1="73" y1="108" x2="147" y2="108" stroke="#451a03" strokeWidth="1.5" />
          <line x1="74" y1="122" x2="146" y2="122" stroke="#451a03" strokeWidth="1.5" />
          <line x1="75" y1="136" x2="145" y2="136" stroke="#451a03" strokeWidth="1.5" />

          {/* Worn patched canvas / tarp with rope stitches */}
          <polygon points="68,95 110,50 152,95" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          {/* Straw thatch roof overhang */}
          <path d="M 60 98 Q 110 40 160 98" fill="none" stroke="#ca8a04" strokeWidth="7" strokeLinecap="round" />
          <path d="M 65 96 L 70 106 M 85 86 L 90 98 M 110 65 L 112 78 M 135 86 L 132 98 M 155 96 L 150 106" stroke="#eab308" strokeWidth="2.5" />

          {/* Canvas patch with stitch lines */}
          <rect x="90" y="70" width="22" height="16" rx="2" fill="#713f12" stroke="#451a03" strokeWidth="1" />
          <line x1="90" y1="70" x2="112" y2="70" stroke="#facc15" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="90" y1="86" x2="112" y2="86" stroke="#facc15" strokeWidth="1" strokeDasharray="2,2" />

          {/* Crooked hut doorway with lantern glow */}
          <path d="M 98 148 L 100 112 Q 110 108 120 112 L 122 148 Z" fill="#1c1917" />
          <ellipse cx="110" cy="130" rx="8" ry="12" fill="#f59e0b" opacity="0.4" className="animate-pulse" />
          <circle cx="110" cy="132" r="3" fill="#fef08a" />

          {/* Makeshift wooden signpost */}
          <line x1="52" y1="150" x2="52" y2="130" stroke="#451a03" strokeWidth="2.5" />
          <rect x="42" y="125" width="20" height="9" rx="1.5" fill="#a16207" stroke="#451a03" strokeWidth="1" />
          <line x1="45" y1="129" x2="59" y2="129" stroke="#451a03" strokeWidth="1" />
        </svg>
      )}

      {/* LEVEL 1: Rustic Timber Cabin */}
      {level === 1 && (
        <svg
          viewBox="0 0 250 190"
          className="w-full h-full drop-shadow-xl overflow-visible"
        >
          {/* Ground shadow */}
          <ellipse cx="125" cy="162" rx="90" ry="18" fill="#1c1917" opacity="0.6" />

          {/* Stone Chimney on left */}
          <rect x="68" y="55" width="22" height="65" fill="#57534e" stroke="#292524" strokeWidth="1.5" />
          <line x1="68" y1="70" x2="90" y2="70" stroke="#292524" strokeWidth="1" />
          <line x1="68" y1="88" x2="90" y2="88" stroke="#292524" strokeWidth="1" />
          {/* Chimney smoke rising */}
          <circle cx="79" cy="46" r="4.5" fill="#d6d3d1" opacity="0.6" className="animate-bounce" />
          <circle cx="83" cy="32" r="6.5" fill="#d6d3d1" opacity="0.4" className="animate-pulse" />
          <circle cx="88" cy="18" r="8" fill="#d6d3d1" opacity="0.25" />

          {/* Horizontal Notched Pine Logs */}
          <rect x="60" y="95" width="130" height="62" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <line x1="60" y1="108" x2="190" y2="108" stroke="#451a03" strokeWidth="2" />
          <line x1="60" y1="121" x2="190" y2="121" stroke="#451a03" strokeWidth="2" />
          <line x1="60" y1="134" x2="190" y2="134" stroke="#451a03" strokeWidth="2" />
          <line x1="60" y1="147" x2="190" y2="147" stroke="#451a03" strokeWidth="2" />

          {/* Notched log end circles */}
          <circle cx="62" cy="101" r="3" fill="#92400e" stroke="#451a03" strokeWidth="1" />
          <circle cx="62" cy="114" r="3" fill="#92400e" stroke="#451a03" strokeWidth="1" />
          <circle cx="62" cy="127" r="3" fill="#92400e" stroke="#451a03" strokeWidth="1" />
          <circle cx="62" cy="140" r="3" fill="#92400e" stroke="#451a03" strokeWidth="1" />

          {/* Pitched Shingle Roof */}
          <polygon points="46,98 125,40 204,98" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
          <line x1="46" y1="98" x2="204" y2="98" stroke="#ca8a04" strokeWidth="2" />

          {/* Cabin Door */}
          <rect x="110" y="115" width="28" height="42" rx="2" fill="#451a03" stroke="#292524" strokeWidth="1.5" />
          <circle cx="132" cy="136" r="2" fill="#fbbf24" />

          {/* Warm Glowing Window */}
          <rect x="74" y="112" width="24" height="24" rx="2" fill="#fef08a" stroke="#451a03" strokeWidth="1.5" />
          <line x1="86" y1="112" x2="86" y2="136" stroke="#451a03" strokeWidth="1.5" />
          <line x1="74" y1="124" x2="98" y2="124" stroke="#451a03" strokeWidth="1.5" />

          {/* Firewood Stack outside */}
          <rect x="150" y="132" width="30" height="25" rx="2" fill="#451a03" opacity="0.3" />
          <circle cx="156" cy="150" r="4.5" fill="#b45309" stroke="#451a03" strokeWidth="1" />
          <circle cx="165" cy="150" r="4.5" fill="#b45309" stroke="#451a03" strokeWidth="1" />
          <circle cx="174" cy="150" r="4.5" fill="#b45309" stroke="#451a03" strokeWidth="1" />
          <circle cx="160.5" cy="142" r="4.5" fill="#b45309" stroke="#451a03" strokeWidth="1" />
          <circle cx="169.5" cy="142" r="4.5" fill="#b45309" stroke="#451a03" strokeWidth="1" />

          {/* Porch Lantern */}
          <rect x="142" y="118" width="6" height="10" rx="1" fill="#fde047" stroke="#292524" strokeWidth="1" className="animate-pulse" />
        </svg>
      )}

      {/* LEVEL 2: Two-Story Oak Homestead */}
      {level === 2 && (
        <svg
          viewBox="0 0 270 200"
          className="w-full h-full drop-shadow-xl overflow-visible"
        >
          {/* Ground shadow */}
          <ellipse cx="135" cy="172" rx="105" ry="18" fill="#1c1917" opacity="0.6" />

          {/* Cobblestone Foundation */}
          <rect x="50" y="152" width="170" height="18" rx="2" fill="#57534e" stroke="#292524" strokeWidth="1.5" />

          {/* Ground Floor (Sturdy Oak) */}
          <rect x="55" y="105" width="160" height="48" fill="#854d0e" stroke="#451a03" strokeWidth="2" />

          {/* Second Story with Overhang */}
          <rect x="62" y="60" width="146" height="46" fill="#a16207" stroke="#451a03" strokeWidth="2" />

          {/* High Gabled Roof */}
          <polygon points="44,64 135,16 226,64" fill="#713f12" stroke="#451a03" strokeWidth="2.5" />

          {/* Center Dormer Window on roof */}
          <polygon points="120,40 135,24 150,40" fill="#854d0e" stroke="#451a03" strokeWidth="1.5" />
          <rect x="124" y="40" width="22" height="18" rx="1" fill="#fef08a" stroke="#451a03" strokeWidth="1.5" />
          <line x1="135" y1="40" x2="135" y2="58" stroke="#451a03" strokeWidth="1" />

          {/* Balcony Railings */}
          <rect x="105" y="92" width="60" height="14" fill="none" stroke="#ca8a04" strokeWidth="2" />
          <line x1="117" y1="92" x2="117" y2="106" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="135" y1="92" x2="135" y2="106" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="153" y1="92" x2="153" y2="106" stroke="#ca8a04" strokeWidth="1.5" />

          {/* Double Oak Doors */}
          <rect x="120" y="116" width="30" height="37" fill="#451a03" stroke="#292524" strokeWidth="1.5" />
          <line x1="135" y1="116" x2="135" y2="153" stroke="#292524" strokeWidth="1.5" />
          <circle cx="132" cy="134" r="1.5" fill="#facc15" />
          <circle cx="138" cy="134" r="1.5" fill="#facc15" />

          {/* Windows with Flower Planters */}
          <rect x="68" y="116" width="24" height="24" rx="2" fill="#fef08a" stroke="#451a03" strokeWidth="1.5" />
          <rect x="178" y="116" width="24" height="24" rx="2" fill="#fef08a" stroke="#451a03" strokeWidth="1.5" />
          {/* Flower boxes */}
          <rect x="66" y="138" width="28" height="6" rx="1" fill="#78350f" />
          <circle cx="72" cy="137" r="2.5" fill="#ef4444" />
          <circle cx="80" cy="136" r="2.5" fill="#f59e0b" />
          <circle cx="88" cy="137" r="2.5" fill="#ec4899" />
          <rect x="176" y="138" width="28" height="6" rx="1" fill="#78350f" />
          <circle cx="182" cy="137" r="2.5" fill="#ef4444" />
          <circle cx="190" cy="136" r="2.5" fill="#f59e0b" />
          <circle cx="198" cy="137" r="2.5" fill="#ec4899" />

          {/* Chimney & Smoke */}
          <rect x="185" y="24" width="18" height="40" fill="#57534e" stroke="#292524" strokeWidth="1.5" />
          <circle cx="194" cy="14" r="5" fill="#d6d3d1" opacity="0.6" className="animate-pulse" />
        </svg>
      )}

      {/* LEVEL 3: Craftsman Woodland Manor */}
      {level === 3 && (
        <svg
          viewBox="0 0 290 210"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          {/* Ground shadow */}
          <ellipse cx="145" cy="178" rx="120" ry="20" fill="#1c1917" opacity="0.6" />

          {/* Terraced Cut Stone Foundation */}
          <rect x="35" y="152" width="220" height="24" rx="2" fill="#57534e" stroke="#292524" strokeWidth="2" />
          {/* Front stone stairs */}
          <rect x="120" y="166" width="50" height="12" fill="#78716c" stroke="#44403c" strokeWidth="1" />

          {/* Main Craftsman Timber Hall */}
          <rect x="45" y="85" width="200" height="68" fill="#92400e" stroke="#451a03" strokeWidth="2" />

          {/* Polished White Birch Corner Columns */}
          <rect x="45" y="85" width="12" height="68" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <rect x="233" y="85" width="12" height="68" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />

          {/* Multi-Tier Steep Slate Roofs */}
          <polygon points="30,90 145,26 260,90" fill="#b45309" stroke="#451a03" strokeWidth="3" />
          {/* Left Wing Cross Gable */}
          <polygon points="45,66 85,26 125,66" fill="#92400e" stroke="#451a03" strokeWidth="2" />

          {/* Wraparound Porch Balustrade */}
          <line x1="38" y1="134" x2="252" y2="134" stroke="#ca8a04" strokeWidth="3" />

          {/* Grand Stained Glass Bay Windows */}
          <rect x="65" y="100" width="36" height="34" rx="2" fill="#fef08a" stroke="#451a03" strokeWidth="2" />
          <line x1="83" y1="100" x2="83" y2="134" stroke="#451a03" strokeWidth="1.5" />
          <rect x="189" y="100" width="36" height="34" rx="2" fill="#fef08a" stroke="#451a03" strokeWidth="2" />
          <line x1="207" y1="100" x2="207" y2="134" stroke="#451a03" strokeWidth="1.5" />

          {/* Grand Birch Entry Portico */}
          <polygon points="122,96 145,76 168,96" fill="#f8fafc" stroke="#451a03" strokeWidth="1.5" />
          <rect x="130" y="104" width="30" height="48" fill="#451a03" stroke="#1c1917" strokeWidth="2" />
          {/* Deer / Oak Leaf Carved Crest */}
          <circle cx="145" cy="88" r="4.5" fill="#f59e0b" />

          {/* Carriage Brass Lanterns */}
          <circle cx="123" cy="120" r="4" fill="#fde047" className="animate-pulse" />
          <circle cx="167" cy="120" r="4" fill="#fde047" className="animate-pulse" />
        </svg>
      )}

      {/* LEVEL 4: Redwood Fortified Chateau */}
      {level === 4 && (
        <svg
          viewBox="0 0 310 220"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          {/* Ground shadow */}
          <ellipse cx="155" cy="186" rx="130" ry="22" fill="#1c1917" opacity="0.6" />

          {/* Bastion Stone Fortress Foundation */}
          <rect x="25" y="152" width="260" height="32" rx="3" fill="#44403c" stroke="#1c1917" strokeWidth="2" />

          {/* Left Defensive Watchtower */}
          <rect x="30" y="55" width="52" height="100" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
          <polygon points="20,58 56,18 92,58" fill="#450a0a" stroke="#1c1917" strokeWidth="2" />
          {/* Spire Flagpole & Red Banner */}
          <line x1="56" y1="18" x2="56" y2="4" stroke="#ca8a04" strokeWidth="2" />
          <polygon points="56,4 74,9 56,14" fill="#ef4444" className="animate-pulse" />

          {/* Right Defensive Watchtower */}
          <rect x="228" y="55" width="52" height="100" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
          <polygon points="218,58 254,18 290,58" fill="#450a0a" stroke="#1c1917" strokeWidth="2" />
          {/* Spire Flagpole & Red Banner */}
          <line x1="254" y1="18" x2="254" y2="4" stroke="#ca8a04" strokeWidth="2" />
          <polygon points="254,4 272,9 254,14" fill="#ef4444" className="animate-pulse" />

          {/* Central Redwood Manor Keep */}
          <rect x="78" y="75" width="154" height="80" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
          <polygon points="72,78 155,25 238,78" fill="#7f1d1d" stroke="#450a0a" strokeWidth="3" />

          {/* Arched Redwood Portcullis Gateway */}
          <path d="M 135 152 L 135 110 Q 155 92 175 110 L 175 152 Z" fill="#1c1917" />
          <path d="M 138 152 L 138 112 Q 155 96 172 112 L 172 152 Z" fill="#450a0a" stroke="#ca8a04" strokeWidth="2" />

          {/* High Cathedral Stained Glass Windows */}
          <rect x="96" y="94" width="26" height="38" rx="3" fill="#fef08a" stroke="#450a0a" strokeWidth="2" />
          <rect x="188" y="94" width="26" height="38" rx="3" fill="#fef08a" stroke="#450a0a" strokeWidth="2" />
          {/* Tower slit windows */}
          <rect x="48" y="80" width="16" height="24" rx="2" fill="#fde047" stroke="#450a0a" strokeWidth="1" />
          <rect x="246" y="80" width="16" height="24" rx="2" fill="#fde047" stroke="#450a0a" strokeWidth="1" />

          {/* Wall-Mounted Iron Torch Braziers */}
          <circle cx="124" cy="126" r="3.5" fill="#f97316" className="animate-pulse" />
          <circle cx="186" cy="126" r="3.5" fill="#f97316" className="animate-pulse" />
        </svg>
      )}

      {/* LEVEL 5: Imperial Sovereign Palace (Citadel of the Forest) */}
      {level >= 5 && (
        <svg
          viewBox="0 0 340 230"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            <radialGradient id="palaceAura" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="goldRoof" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
            <linearGradient id="imperialWall" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2e1065" />
              <stop offset="50%" stopColor="#3b0764" />
              <stop offset="100%" stopColor="#2e1065" />
            </linearGradient>
          </defs>

          {/* Divine Palace Magical Aura */}
          <circle cx="170" cy="100" r="110" fill="url(#palaceAura)" className="animate-pulse" />

          {/* Ground shadow */}
          <ellipse cx="170" cy="195" rx="145" ry="24" fill="#0f172a" opacity="0.7" />

          {/* Monumental Carved White Marble Balustrade Base */}
          <rect x="20" y="160" width="300" height="34" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="20" y1="168" x2="320" y2="168" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Palace Grand Staircase */}
          <polygon points="125,194 215,194 205,160 135,160" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

          {/* Outer Palace Wing Towers (Left & Right) */}
          <rect x="35" y="70" width="55" height="95" fill="url(#imperialWall)" stroke="#c084fc" strokeWidth="1.5" />
          <rect x="250" y="70" width="55" height="95" fill="url(#imperialWall)" stroke="#c084fc" strokeWidth="1.5" />

          {/* Golden Cupola Dome Roofs on Wings */}
          <path d="M 30 72 Q 62.5 25 95 72 Z" fill="url(#goldRoof)" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="62.5" cy="22" r="4" fill="#facc15" stroke="#78350f" strokeWidth="1" />
          <path d="M 245 72 Q 277.5 25 310 72 Z" fill="url(#goldRoof)" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="277.5" cy="22" r="4" fill="#facc15" stroke="#78350f" strokeWidth="1" />

          {/* Central Grand Sovereign Hall */}
          <rect x="80" y="60" width="180" height="102" fill="url(#imperialWall)" stroke="#c084fc" strokeWidth="2" />

          {/* Monumental Central Spire Tower */}
          <rect x="130" y="24" width="80" height="138" fill="#4c1d95" stroke="#c084fc" strokeWidth="2" />

          {/* Grand Imperial Spire & Shining Sun Crest */}
          <polygon points="115,26 170,-10 225,26" fill="url(#goldRoof)" stroke="#78350f" strokeWidth="2" />
          <circle cx="170" cy="-14" r="6" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" className="animate-spin" />
          <circle cx="170" cy="-14" r="3" fill="#ffffff" />

          {/* Heraldic Royal Purple & Gold Banners */}
          <polygon points="100,68 118,68 118,115 109,102 100,115" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          <polygon points="222,68 240,68 240,115 231,102 222,115" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />

          {/* Grand Arched Palace Double Gates with Gold Filigree */}
          <path d="M 148 160 L 148 108 Q 170 88 192 108 L 192 160 Z" fill="#1e1b4b" stroke="#facc15" strokeWidth="2.5" />
          <line x1="170" y1="94" x2="170" y2="160" stroke="#facc15" strokeWidth="2" />
          <circle cx="164" cy="135" r="2.5" fill="#fef08a" />
          <circle cx="176" cy="135" r="2.5" fill="#fef08a" />

          {/* Enchanted Crystal Rose Windows */}
          <circle cx="170" cy="55" r="14" fill="#e9d5ff" stroke="#facc15" strokeWidth="2" />
          <circle cx="170" cy="55" r="8" fill="#c084fc" />
          <circle cx="170" cy="55" r="3" fill="#ffffff" />

          {/* Palace Wing Windows */}
          <rect x="52" y="90" width="20" height="34" rx="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <rect x="268" y="90" width="20" height="34" rx="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />

          {/* Sparkling Floating Magic Orbs */}
          <circle cx="95" cy="40" r="2.5" fill="#f3e8ff" className="animate-ping" />
          <circle cx="245" cy="40" r="2.5" fill="#f3e8ff" className="animate-ping" />
          <circle cx="170" cy="10" r="2" fill="#fde047" className="animate-ping" />
        </svg>
      )}
    </div>
  );
};
