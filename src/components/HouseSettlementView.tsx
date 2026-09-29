import React from 'react';
import { Hammer, Check, ArrowUpRight, ShieldCheck, Warehouse, Flame, Coins } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { HOUSE_STAGES, WOOD_DEFINITIONS, WoodType, SettlementBuilding } from '../types/game';

// Custom SVG renderer for the player's House based on current level
const HouseGraphic: React.FC<{ level: number }> = ({ level }) => {
  return (
    <div className="relative w-full h-64 sm:h-72 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 border border-stone-800 shadow-inner">
      {/* Sky & Mountain Silhouette Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-stone-900/60 to-stone-950 pointer-events-none" />
      {/* Mountain range outline */}
      <svg className="absolute bottom-16 inset-x-0 w-full h-32 opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 100">
        <polygon points="0,100 80,35 160,100" fill="#44403c" />
        <polygon points="120,100 230,20 340,100" fill="#292524" />
        <polygon points="280,100 360,40 400,100" fill="#44403c" />
      </svg>
      {/* Cobblestone/Grass ground base */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-stone-950 via-stone-900 to-emerald-950/40 border-t border-stone-800/60" />

      {/* STAGE 0: Wilderness Camp */}
      {level === 0 && (
        <svg viewBox="0 0 300 200" className="w-72 h-48 drop-shadow-xl z-10">
          {/* Ground patch */}
          <ellipse cx="150" cy="165" rx="100" ry="25" fill="#292524" />
          {/* Tent */}
          <polygon points="60,160 120,80 180,160" fill="#78350f" />
          <polygon points="120,80 180,160 160,160 120,95" fill="#92400e" />
          {/* Wooden tent pegs */}
          <line x1="50" y1="165" x2="65" y2="155" stroke="#451a03" strokeWidth="3" />
          <line x1="190" y1="165" x2="175" y2="155" stroke="#451a03" strokeWidth="3" />
          {/* Campfire stone ring */}
          <circle cx="210" cy="160" r="18" fill="#57534e" />
          <circle cx="210" cy="160" r="14" fill="#292524" />
          {/* Fire logs */}
          <line x1="202" y1="156" x2="218" y2="164" stroke="#451a03" strokeWidth="4" />
          <line x1="218" y1="156" x2="202" y2="164" stroke="#451a03" strokeWidth="4" />
          {/* Animated campfire flame */}
          <path d="M 206 160 Q 210 135 214 160 Z" fill="#f97316" className="animate-pulse" />
          <path d="M 208 160 Q 210 142 212 160 Z" fill="#facc15" />
          {/* Log seat bench */}
          <rect x="235" y="152" width="35" height="12" rx="4" fill="#78350f" />
        </svg>
      )}

      {/* STAGE 1: Rustic Log Cabin */}
      {level === 1 && (
        <svg viewBox="0 0 300 200" className="w-72 h-48 drop-shadow-xl z-10">
          {/* Chimney */}
          <rect x="80" y="55" width="22" height="60" fill="#57534e" />
          {/* Chimney smoke */}
          <circle cx="91" cy="45" r="5" fill="#a8a29e" opacity="0.6" className="animate-bounce" />
          <circle cx="95" cy="30" r="7" fill="#a8a29e" opacity="0.4" className="animate-pulse" />
          {/* Main Cabin Walls with horizontal log details */}
          <rect x="70" y="90" width="160" height="75" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <line x1="70" y1="105" x2="230" y2="105" stroke="#451a03" strokeWidth="2" />
          <line x1="70" y1="120" x2="230" y2="120" stroke="#451a03" strokeWidth="2" />
          <line x1="70" y1="135" x2="230" y2="135" stroke="#451a03" strokeWidth="2" />
          <line x1="70" y1="150" x2="230" y2="150" stroke="#451a03" strokeWidth="2" />
          {/* Shingled Roof */}
          <polygon points="50,92 150,35 250,92" fill="#92400e" stroke="#451a03" strokeWidth="3" />
          {/* Wooden Door */}
          <rect x="135" y="115" width="30" height="50" rx="2" fill="#451a03" />
          <circle cx="160" cy="140" r="2" fill="#facc15" />
          {/* Warm glowing window */}
          <rect x="85" y="110" width="28" height="28" rx="2" fill="#fef08a" stroke="#451a03" strokeWidth="2" />
          <line x1="99" y1="110" x2="99" y2="138" stroke="#451a03" strokeWidth="1.5" />
          <line x1="85" y1="124" x2="113" y2="124" stroke="#451a03" strokeWidth="1.5" />
          {/* Porch Lantern */}
          <rect x="175" y="120" width="8" height="12" fill="#fef08a" stroke="#292524" strokeWidth="1" />
        </svg>
      )}

      {/* STAGE 2: Two-Story Oak Homestead */}
      {level === 2 && (
        <svg viewBox="0 0 300 200" className="w-80 h-52 drop-shadow-xl z-10">
          {/* Stone Foundation */}
          <rect x="60" y="150" width="180" height="20" rx="2" fill="#78716c" stroke="#44403c" strokeWidth="2" />
          {/* Lower Story */}
          <rect x="65" y="100" width="170" height="52" fill="#854d0e" stroke="#451a03" strokeWidth="2" />
          {/* Upper Story */}
          <rect x="75" y="55" width="150" height="48" fill="#a16207" stroke="#451a03" strokeWidth="2" />
          {/* High Gabled Roof */}
          <polygon points="55,58 150,15 245,58" fill="#713f12" stroke="#451a03" strokeWidth="3" />
          {/* Dormer Window on roof */}
          <polygon points="135,38 150,22 165,38" fill="#854d0e" />
          <rect x="140" y="38" width="20" height="18" fill="#fef08a" stroke="#451a03" strokeWidth="1.5" />
          {/* Ground Floor Windows */}
          <rect x="80" y="112" width="26" height="26" fill="#fef08a" stroke="#451a03" strokeWidth="2" />
          <rect x="194" y="112" width="26" height="26" fill="#fef08a" stroke="#451a03" strokeWidth="2" />
          {/* Heavy Oak Double Door */}
          <rect x="135" y="110" width="30" height="42" fill="#451a03" />
          <line x1="150" y1="110" x2="150" y2="152" stroke="#292524" strokeWidth="1.5" />
          {/* Balcony Railing */}
          <rect x="120" y="86" width="60" height="14" fill="none" stroke="#ca8a04" strokeWidth="2" />
          <line x1="130" y1="86" x2="130" y2="100" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="145" y1="86" x2="145" y2="100" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="160" y1="86" x2="160" y2="100" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="170" y1="86" x2="170" y2="100" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Smoke from stone chimney */}
          <rect x="200" y="25" width="20" height="40" fill="#78716c" />
          <circle cx="210" cy="15" r="6" fill="#d6d3d1" opacity="0.6" className="animate-pulse" />
        </svg>
      )}

      {/* STAGE 3: Craftsman Woodland Manor */}
      {level === 3 && (
        <svg viewBox="0 0 320 200" className="w-84 h-56 drop-shadow-2xl z-10">
          {/* Stone Terraced Foundation */}
          <rect x="40" y="148" width="240" height="24" rx="2" fill="#57534e" stroke="#292524" strokeWidth="2" />
          {/* Main Hall */}
          <rect x="50" y="80" width="220" height="70" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          {/* White Birch Trim Corner Pillars */}
          <rect x="50" y="80" width="12" height="70" fill="#f8fafc" />
          <rect x="258" y="80" width="12" height="70" fill="#f8fafc" />
          {/* Multi-tier Steep Sloped Roofs */}
          <polygon points="35,84 160,25 285,84" fill="#b45309" stroke="#451a03" strokeWidth="3" />
          {/* Secondary Gable Tower */}
          <polygon points="50,60 90,20 130,60" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          {/* Wraparound Porch Deck */}
          <line x1="40" y1="130" x2="280" y2="130" stroke="#ca8a04" strokeWidth="3" />
          {/* Elegant Stained-Glass & Bay Windows */}
          <rect x="70" y="98" width="35" height="32" rx="2" fill="#fef08a" stroke="#451a03" strokeWidth="2" />
          <rect x="215" y="98" width="35" height="32" rx="2" fill="#fef08a" stroke="#451a03" strokeWidth="2" />
          {/* Grand Front Entryway */}
          <polygon points="140,88 160,70 180,88" fill="#f8fafc" />
          <rect x="145" y="96" width="30" height="54" fill="#451a03" />
          {/* Carriage Lanterns */}
          <circle cx="138" cy="115" r="4" fill="#fde047" className="animate-pulse" />
          <circle cx="182" cy="115" r="4" fill="#fde047" className="animate-pulse" />
        </svg>
      )}

      {/* STAGE 4: Redwood Timber Chateau */}
      {level === 4 && (
        <svg viewBox="0 0 340 210" className="w-92 h-60 drop-shadow-2xl z-10">
          {/* Cut Stone Bastion Foundation */}
          <rect x="30" y="145" width="280" height="30" fill="#44403c" stroke="#1c1917" strokeWidth="2" />
          {/* Left Watchtower */}
          <rect x="35" y="45" width="55" height="105" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
          <polygon points="25,48 62,10 100,48" fill="#450a0a" stroke="#1c1917" strokeWidth="2" />
          <line x1="62" y1="10" x2="62" y2="0" stroke="#ca8a04" strokeWidth="2" />
          <polygon points="62,0 76,4 62,8" fill="#ef4444" />
          {/* Right Watchtower */}
          <rect x="250" y="45" width="55" height="105" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
          <polygon points="240,48 277,10 315,48" fill="#450a0a" stroke="#1c1917" strokeWidth="2" />
          {/* Central Manor Hall */}
          <rect x="85" y="65" width="170" height="85" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
          <polygon points="80,68 170,18 260,68" fill="#7f1d1d" stroke="#450a0a" strokeWidth="3" />
          {/* Massive Arched Redwood Gateway */}
          <path d="M 150 148 L 150 108 Q 170 92 190 108 L 190 148 Z" fill="#1c1917" />
          <path d="M 152 148 L 152 110 Q 170 95 188 110 L 188 148 Z" fill="#450a0a" stroke="#ca8a04" strokeWidth="2" />
          {/* Glowing Windows */}
          <rect x="105" y="85" width="28" height="38" rx="3" fill="#fef08a" stroke="#450a0a" strokeWidth="2" />
          <rect x="205" y="85" width="28" height="38" rx="3" fill="#fef08a" stroke="#450a0a" strokeWidth="2" />
          <rect x="50" y="70" width="18" height="24" rx="2" fill="#fef08a" />
          <rect x="270" y="70" width="18" height="24" rx="2" fill="#fef08a" />
        </svg>
      )}

      {/* STAGE 5: Grand Forest Citadel */}
      {level >= 5 && (
        <svg viewBox="0 0 360 220" className="w-96 h-64 drop-shadow-2xl z-10">
          <defs>
            <linearGradient id="citadelGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
          </defs>
          {/* Monumental Granite Base */}
          <rect x="20" y="145" width="320" height="35" rx="3" fill="#292524" stroke="#1c1917" strokeWidth="3" />
          {/* Great Citadel Ironwood Fortress Wings */}
          <rect x="40" y="60" width="280" height="90" fill="#3b0764" stroke="#1e1b4b" strokeWidth="2" />
          {/* Center Spire Tower */}
          <rect x="135" y="30" width="90" height="120" fill="#4c1d95" stroke="#1e1b4b" strokeWidth="2" />
          <polygon points="120,35 180, -5 240,35" fill="url(#citadelGlow)" stroke="#c084fc" strokeWidth="2" />
          {/* Left Wing Tower */}
          <polygon points="30,65 65,15 100,65" fill="#581c87" stroke="#c084fc" strokeWidth="1.5" />
          {/* Right Wing Tower */}
          <polygon points="260,65 295,15 330,65" fill="#581c87" stroke="#c084fc" strokeWidth="1.5" />
          {/* Glowing Enchanted Stained Crystal Arches */}
          <path d="M 160 148 L 160 90 Q 180 75 200 90 L 200 148 Z" fill="#e9d5ff" stroke="#a855f7" strokeWidth="3" />
          {/* Crest Banners */}
          <polygon points="150,55 165,55 165,85 157,75 150,85" fill="#f59e0b" />
          <polygon points="195,55 210,55 210,85 202,75 195,85" fill="#f59e0b" />
          {/* Floating Mystic Amber Orbs */}
          <circle cx="180" cy="5" r="5" fill="#fbbf24" className="animate-ping" />
          <circle cx="180" cy="5" r="4" fill="#fef08a" />
        </svg>
      )}
    </div>
  );
};

interface HouseSettlementViewProps {
  onOpenModal?: (type: 'wood' | 'planks' | 'sawmill' | 'gold' | 'weapon' | 'forge') => void;
  onNavigate?: (tab: 'map' | 'homestead' | 'sawmill' | 'forge' | 'workers') => void;
}

export const HouseSettlementView: React.FC<HouseSettlementViewProps> = ({
  onOpenModal,
  onNavigate,
}) => {
  const {
    houseLevel,
    upgradeHouse,
    canUpgradeHouse,
    resources,
    buildings,
    upgradeBuilding,
  } = useGame();

  const currentStage = HOUSE_STAGES[houseLevel] || HOUSE_STAGES[0];
  const nextStage = HOUSE_STAGES[houseLevel + 1];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Current House Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-500 font-mono">
              Level {currentStage.level} Homestead
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-400">{currentStage.title}</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-100">
            {currentStage.name}
          </h2>
          <p className="text-sm text-stone-400 mt-2 max-w-xl leading-relaxed">
            {currentStage.description}
          </p>

          {/* Current House Active Perks */}
          <div className="mt-4 flex flex-wrap gap-2">
            {currentStage.perks.map((perk, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-md"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{perk}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Visual Illustration of current stage */}
        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <HouseGraphic level={houseLevel} />
        </div>
      </div>

      {/* Blueprint / Next House Upgrade Section */}
      {nextStage ? (
        <div className="bg-stone-900/80 p-5 sm:p-6 rounded-2xl border border-amber-900/40 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 tracking-wider">
                <Hammer className="w-3.5 h-3.5" />
                <span>Next Architectural Blueprint: Stage {nextStage.level}</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-amber-100 mt-1">
                {nextStage.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed max-w-xl">
                {nextStage.tagline}. {nextStage.description}
              </p>

              {/* Perks Unlocked in Next Stage */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-300">
                <span className="font-semibold text-amber-300">Unlocks:</span>
                {nextStage.perks.map((p, idx) => (
                  <span key={idx} className="bg-stone-800 px-2 py-0.5 rounded text-stone-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Upgrade Cost Requirements Checklist */}
            <div className="w-full lg:w-auto bg-stone-950/70 p-4 rounded-xl border border-stone-800/80 shrink-0 min-w-[280px]">
              <div className="text-xs font-semibold uppercase text-stone-400 mb-2.5">
                Required Construction Materials:
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                {/* Gold coins */}
                {nextStage.cost.coins > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" /> Gold Coins:
                    </span>
                    <span
                      className={`font-mono tabular-nums font-semibold ${
                        resources.coins >= nextStage.cost.coins ? 'text-emerald-400' : 'text-stone-500'
                      }`}
                    >
                      {resources.coins} / {nextStage.cost.coins}
                    </span>
                  </div>
                )}

                {/* Planks */}
                {nextStage.cost.planks > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Milled Planks:</span>
                    <span
                      className={`font-mono tabular-nums font-semibold ${
                        resources.planks >= nextStage.cost.planks ? 'text-emerald-400' : 'text-stone-500'
                      }`}
                    >
                      {resources.planks} / {nextStage.cost.planks}
                    </span>
                  </div>
                )}

                {/* Wood logs per type */}
                {Object.entries(nextStage.cost.wood).map(([wt, reqAmt]) => {
                  const def = WOOD_DEFINITIONS[wt as WoodType];
                  const currentAmt = resources.wood[wt as WoodType] || 0;
                  const hasEnough = currentAmt >= (reqAmt || 0);

                  return (
                    <div key={wt} className="flex items-center justify-between">
                      <span className="text-stone-300 flex items-center gap-1.5 capitalize">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: def.accentColor }} />
                        {def.name}:
                      </span>
                      <span
                        className={`font-mono tabular-nums font-semibold ${
                          hasEnough ? 'text-emerald-400' : 'text-stone-500'
                        }`}
                      >
                        {currentAmt} / {reqAmt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Big Upgrade Button */}
              <button
                disabled={!canUpgradeHouse}
                onClick={upgradeHouse}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  canUpgradeHouse
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/50'
                }`}
              >
                <Hammer className="w-4 h-4" />
                <span>Raise House to Stage {nextStage.level}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/40 p-6 rounded-2xl border border-emerald-700/40 text-center">
          <h3 className="font-display font-bold text-xl text-emerald-300">
            Legendary Forest Citadel Achieved
          </h3>
          <p className="text-sm text-stone-400 mt-1">
            You have constructed the greatest architectural marvel in the frontier. The Great Woods bow before your settlement!
          </p>
        </div>
      )}

      {/* Base Settlement Expansion Buildings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-xl text-stone-100">
              Settlement Outposts & Base Buildings
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Construct and upgrade supporting infrastructure to power automated refinement, storage, and tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buildings.map((b) => {
            const isUnlocked = houseLevel >= b.unlockedAtHouseLevel;
            const isMax = b.level >= b.maxLevel;
            const costMultiplier = Math.pow(1.6, b.level);
            const coinCost = Math.round(b.cost.coins * costMultiplier);
            const plankCost = Math.round(b.cost.planks * costMultiplier);

            // Check if player can afford upgrade
            let canAfford = !isMax && isUnlocked && resources.coins >= coinCost && resources.planks >= plankCost;
            if (canAfford) {
              for (const [wt, amt] of Object.entries(b.cost.wood)) {
                if ((resources.wood[wt as WoodType] || 0) < Math.round((amt || 0) * costMultiplier)) {
                  canAfford = false;
                  break;
                }
              }
            }

            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  !isUnlocked
                    ? 'bg-stone-950/40 border-stone-900 opacity-50'
                    : 'bg-stone-900/90 border-stone-800 shadow-md hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400 text-sm">
                        {b.id === 'sawmill' ? '⚙️' : b.id === 'forge' ? '⚒️' : b.id === 'storage_shed' ? '📦' : '🛒'}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-stone-100 text-sm">{b.name}</h4>
                        <span className="text-[11px] text-amber-500 font-mono">
                          {isUnlocked ? `Level ${b.level} / ${b.maxLevel}` : `Locked (Requires House Lv.${b.unlockedAtHouseLevel})`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 mt-2.5 leading-relaxed">{b.description}</p>

                  {/* Quick Action Button for Sawmill & Forge */}
                  {b.id === 'sawmill' && (
                    <div className="mt-2.5">
                      <button
                        onClick={() => {
                          if (onOpenModal) onOpenModal('sawmill');
                          else if (onNavigate) onNavigate('sawmill');
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-600/50 text-amber-300 hover:text-amber-100 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
                      >
                        <span>⚙️</span>
                        <span>Open Sawmill (Mill Wood ➔ Planks & Sell for Gold)</span>
                      </button>
                    </div>
                  )}

                  {b.id === 'forge' && (
                    <div className="mt-2.5">
                      <button
                        onClick={() => {
                          if (onOpenModal) onOpenModal('forge');
                          else if (onNavigate) onNavigate('forge');
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-600/50 text-rose-300 hover:text-rose-100 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
                      >
                        <span>⚒️</span>
                        <span>Open Forge (Upgrade Damage +2 DMG for 10 Gold)</span>
                      </button>
                    </div>
                  )}

                  <div className="mt-2.5 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1.5 rounded border border-emerald-900/40">
                    <span className="font-semibold">Effect:</span> {b.benefit}
                  </div>
                </div>

                {/* Upgrade Control */}
                {isUnlocked && (
                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
                    {!isMax ? (
                      <>
                        <div className="text-xs text-stone-400">
                          <span className="text-[11px] text-stone-500 uppercase font-semibold">Cost: </span>
                          <span className="font-mono text-amber-300 font-medium">{coinCost} Gold</span>
                          {plankCost > 0 && <span className="font-mono text-stone-300 ml-1.5">{plankCost} Planks</span>}
                        </div>

                        <button
                          disabled={!canAfford}
                          onClick={() => upgradeBuilding(b.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            canAfford
                              ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 active:scale-95 cursor-pointer shadow'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Upgrade</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-stone-500 font-mono">Maximum Level Reached</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
