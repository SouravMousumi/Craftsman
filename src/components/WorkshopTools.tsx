import React from 'react';
import { Hammer, Sparkles, Check, Flame, Sword, Wrench, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TOOLS, WOOD_DEFINITIONS, ToolDefinition } from '../types/game';

export const WorkshopTools: React.FC = () => {
  const {
    currentTool,
    ownedToolIds,
    buyTool,
    equipTool,
    weaponUpgradeLevel,
    weaponBonusDamage,
    upgradeWeaponWithGold,
    resources,
    buildings,
  } = useGame();

  const forge = buildings.find((b) => b.id === 'forge');
  const forgeLevel = forge ? forge.level : 0;
  const canUpgradeWithGold = resources.coins >= 10;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-semibold">
            <Wrench className="w-3.5 h-3.5" />
            <span>Blacksmith & Woodcutter Workshop</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-stone-100 mt-1">
            Felling Axes & Forestry Tools
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            Upgrade your cutting instruments to fell denser hardwoods, redwoods, and ironwood with fewer swings, higher critical cleaves, and bonus yields.
          </p>
        </div>

        {/* Forge Bonus Card */}
        <div className="bg-stone-950/80 p-3.5 rounded-xl border border-amber-900/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-700/40 flex items-center justify-center text-amber-400 text-lg">
            🔥
          </div>
          <div>
            <div className="text-xs text-stone-300 font-semibold">
              Blacksmith Forge (Lv. {forgeLevel})
            </div>
            <div className="text-xs text-amber-400 font-mono mt-0.5">
              +{forgeLevel * 10}% Power · +{forgeLevel * 5}% Crit Chance
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Weapon Sharpening Upgrade with 10 Gold */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-600/50 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shrink-0">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-stone-100">
                Axe Edge Sharpening (+2 DMG)
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                +{weaponBonusDamage} Total Bonus DMG (Lv.{weaponUpgradeLevel})
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Each upgrade adds +2 permanent chop damage to any equipped weapon. Costs exactly 10 Gold.
            </p>
          </div>
        </div>

        <button
          disabled={!canUpgradeWithGold}
          onClick={upgradeWeaponWithGold}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow ${
            canUpgradeWithGold
              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer shadow-amber-500/20 active:scale-95 animate-pulse'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/40'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>Upgrade Weapon (+2 DMG) — 10 Gold</span>
        </button>
      </div>

      {/* Tools Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => {
          const isOwned = ownedToolIds.includes(tool.id);
          const isEquipped = currentTool.id === tool.id;

          // Check if player can afford to purchase
          const hasCoins = resources.coins >= tool.cost.coins;
          const hasPlanks = !tool.cost.planks || resources.planks >= tool.cost.planks;
          const hasWood =
            !tool.cost.woodType ||
            !tool.cost.woodAmount ||
            (resources.wood[tool.cost.woodType] || 0) >= tool.cost.woodAmount;

          const canAfford = !isOwned && hasCoins && hasPlanks && hasWood;

          const woodDef = tool.cost.woodType ? WOOD_DEFINITIONS[tool.cost.woodType] : null;

          return (
            <div
              key={tool.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isEquipped
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/30'
                  : isOwned
                  ? 'bg-stone-900/90 border-stone-700/80 hover:border-stone-600'
                  : 'bg-stone-900/60 border-stone-800'
              }`}
            >
              <div>
                {/* Tool Icon & Tier */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{tool.icon}</span>
                    <div>
                      <h3 className="font-display font-bold text-base text-stone-100">{tool.name}</h3>
                      <span className="text-xs text-amber-500 font-mono">Tier {tool.tier} Implement</span>
                    </div>
                  </div>

                  {isEquipped && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Equipped
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-400 mt-3 leading-relaxed min-h-[36px]">
                  {tool.description}
                </p>

                {/* Tool Stats Breakdown */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80 font-mono">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Chop Power:</span>
                    <span className="text-amber-300 font-bold tabular-nums text-sm">
                      {tool.chopPower} DMG
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Crit Chance:</span>
                    <span className="text-emerald-400 font-bold tabular-nums text-sm">
                      {Math.round(tool.critChance * 100)}% ({tool.critMultiplier}x)
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Cleave Chance:</span>
                    <span className="text-sky-300 font-bold tabular-nums text-sm">
                      {Math.round(tool.cleaveChance * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Durability:</span>
                    <span className="text-stone-300 font-bold text-sm">Unbreakable</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Costs */}
              <div className="mt-5 pt-3 border-t border-stone-800/80">
                {isOwned ? (
                  <button
                    disabled={isEquipped}
                    onClick={() => equipTool(tool.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      isEquipped
                        ? 'bg-stone-800 text-stone-500 cursor-default'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer shadow'
                    }`}
                  >
                    {isEquipped ? 'Currently Equipped' : 'Equip This Tool'}
                  </button>
                ) : (
                  <div>
                    {/* Cost Breakdown */}
                    <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      {tool.cost.coins > 0 && (
                        <span
                          className={`font-mono tabular-nums ${
                            hasCoins ? 'text-amber-300' : 'text-stone-500'
                          }`}
                        >
                          {tool.cost.coins} Gold
                        </span>
                      )}
                      {tool.cost.planks && (
                        <span
                          className={`font-mono tabular-nums ${
                            hasPlanks ? 'text-stone-200' : 'text-stone-500'
                          }`}
                        >
                          {tool.cost.planks} Planks
                        </span>
                      )}
                      {woodDef && tool.cost.woodAmount && (
                        <span
                          className={`font-mono tabular-nums ${
                            hasWood ? 'text-emerald-300' : 'text-stone-500'
                          }`}
                        >
                          {tool.cost.woodAmount} {woodDef.name}
                        </span>
                      )}
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => buyTool(tool.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-md cursor-pointer active:scale-98'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Hammer className="w-3.5 h-3.5" />
                      <span>Forge & Equip</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
