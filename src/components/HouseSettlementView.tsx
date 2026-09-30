import React from 'react';
import { Hammer, Check, ArrowUpRight, ShieldCheck, Warehouse, Flame, Coins, X, ArrowLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { HOUSE_STAGES, WOOD_DEFINITIONS, WoodType, SettlementBuilding } from '../types/game';
import { HouseBuildingVisual } from './HouseBuildingVisual';

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

      {/* Progressive Architectural Building Graphic */}
      <div className="relative z-10 w-80 h-56 flex items-center justify-center">
        <HouseBuildingVisual level={level} className="w-full h-full" />
      </div>
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
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Navigation Bar with Back & Close (X) button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate && onNavigate('map')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border border-stone-800 transition-all cursor-pointer text-xs font-semibold shadow-sm active:scale-95 group"
          title="Return to World Map"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Forest Map</span>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('map')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-400 hover:text-rose-400 border border-stone-800 transition-all cursor-pointer shadow-sm active:scale-95 text-xs font-semibold"
          aria-label="Close and return to map"
          title="Close and return to map (X)"
        >
          <span>Close</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current House Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-xl relative">
        <button
          onClick={() => onNavigate && onNavigate('map')}
          className="absolute top-4 right-4 md:hidden w-7 h-7 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700/60 flex items-center justify-center cursor-pointer transition-colors"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

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
