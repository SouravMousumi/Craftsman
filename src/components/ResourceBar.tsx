import React from 'react';
import { Coins, Sparkles, Layers, Box } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { WOOD_DEFINITIONS, WoodType } from '../types/game';

export const ResourceBar: React.FC = () => {
  const { resources, storageCap, houseLevel, unlockedWoodTypes } = useGame();

  const woodKeys: WoodType[] = ['pine', 'oak', 'birch', 'redwood', 'ironwood'];

  return (
    <section className="bg-stone-900 border-b border-stone-800 text-stone-200 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-xs sm:text-sm">
        {/* Currencies & Refined Goods */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5" title="Gold Coins (sell 10 planks for 1 Gold; use to upgrade weapon or unlock trees)">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-stone-400 text-xs">Gold</span>
            <span className="font-semibold font-mono tabular-nums text-amber-300">
              {resources.coins.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Milled Planks (10 wood = 1 plank; 10 planks = 1 Gold)">
            <Layers className="w-4 h-4 text-amber-200 shrink-0" />
            <span className="text-stone-400 text-xs">Planks</span>
            <span className="font-semibold font-mono tabular-nums text-stone-100">
              {resources.planks.toLocaleString()}
            </span>
            <span className="text-stone-500 text-xs">/ {storageCap.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5" title="Rare Forest Amber (found occasionally when felling trees)">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-stone-400 text-xs">Amber</span>
            <span className="font-semibold font-mono tabular-nums text-amber-400">
              {resources.amber.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Raw Timber Stocks */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-0.5">
          {woodKeys.map((type) => {
            const def = WOOD_DEFINITIONS[type];
            const isUnlocked = unlockedWoodTypes.includes(type) || houseLevel >= def.unlockHouseLevel;
            const amount = resources.wood[type] || 0;
            const isAtCap = amount >= storageCap;

            if (!isUnlocked) {
              return (
                <div
                  key={type}
                  className="flex items-center gap-1 opacity-40 text-stone-500 text-xs select-none"
                  title={`Locked: Unlock for ${def.unlockGoldCost} Gold in the Forest Grove`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-700 inline-block" />
                  <span className="capitalize">{type}</span>
                  <span className="text-[10px]">🔒 {def.unlockGoldCost}g</span>
                </div>
              );
            }

            return (
              <div
                key={type}
                className="flex items-center gap-1.5 shrink-0"
                title={`${def.name}: ${amount} / ${storageCap} logs`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: def.accentColor }}
                />
                <span className="text-stone-300 text-xs font-medium capitalize">{type}</span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isAtCap ? 'text-rose-400 font-bold' : 'text-stone-100'
                  }`}
                >
                  {amount.toLocaleString()}
                </span>
              </div>
            );
          })}

          {/* Storage Capacity indicator */}
          <div
            className="flex items-center gap-1 text-stone-400 text-xs pl-2 border-l border-stone-800"
            title="Max Timber Yard Storage capacity per material"
          >
            <Box className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-[11px] text-stone-400">Cap:</span>
            <span className="font-mono tabular-nums text-stone-300 font-medium">
              {storageCap.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
