import React, { useState } from 'react';
import {
  X,
  Layers,
  Coins,
  Sword,
  Hammer,
  ArrowRight,
  Lock,
  Check,
  UserPlus,
  TreePine,
  Sparkles,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import {
  WOOD_DEFINITIONS,
  WoodType,
  TOOLS,
  WORKER_ROLES,
  getTotalWood,
} from '../types/game';

export type ModalType =
  | 'wood'
  | 'planks'
  | 'sawmill'
  | 'gold'
  | 'weapon'
  | 'forge'
  | null;

interface ConversionModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  onOpenModal: (type: ModalType) => void;
}

export const ConversionModals: React.FC<ConversionModalsProps> = ({
  activeModal,
  onClose,
  onOpenModal,
}) => {
  const {
    resources,
    storageCap,
    craftPlanks,
    craftAllPlanks,
    sellPlanksForGold,
    sellAllPlanksForGold,
    weaponUpgradeLevel,
    weaponBonusDamage,
    upgradeWeaponWithGold,
    unlockedWoodTypes,
    unlockTreeTypeWithGold,
    currentTool,
    ownedToolIds,
    buyTool,
    equipTool,
    hireWorker,
    hiredWorkers,
    maxWorkerSlots,
  } = useGame();

  const [selectedWoodForPlanks, setSelectedWoodForPlanks] = useState<WoodType>('pine');

  if (!activeModal) return null;

  const totalWood = getTotalWood(resources.wood);
  const woodTypes: WoodType[] = ['pine', 'oak', 'birch', 'redwood', 'ironwood'];
  const canAffordWeaponUpgrade = resources.coins >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Menu"
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. WOOD CONVERSION MENU */}
        {activeModal === 'wood' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-600/40 flex items-center justify-center text-amber-300 text-xl">
                🪵
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-stone-100">
                  Timber Stocks & Plank Milling
                </h3>
                <span className="text-xs text-stone-400">
                  Total Wood: <span className="font-mono text-amber-300 font-bold">{totalWood.toLocaleString()}</span> / {storageCap.toLocaleString()} Cap
                </span>
              </div>
            </div>

            {/* Inventory by Wood Type */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
              {woodTypes.map((type) => {
                const def = WOOD_DEFINITIONS[type];
                const isUnlocked = unlockedWoodTypes.includes(type);
                const count = resources.wood[type] || 0;

                return (
                  <div
                    key={type}
                    onClick={() => isUnlocked && setSelectedWoodForPlanks(type)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      selectedWoodForPlanks === type
                        ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500/40'
                        : isUnlocked
                        ? 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                        : 'border-stone-900 bg-stone-950/20 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-200 capitalize flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: def.accentColor }} />
                        {type}
                      </span>
                      {!isUnlocked && <Lock className="w-3 h-3 text-stone-500" />}
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold text-stone-100">
                      {isUnlocked ? count.toLocaleString() : 'Locked'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Conversion: 10 Wood -> 1 Plank */}
            <div className="bg-stone-950/70 p-4 rounded-xl border border-amber-800/40">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>Milling Conversion</span>
                </span>
                <span className="font-mono text-stone-300 font-semibold bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                  10 Wood = 1 Plank
                </span>
              </div>

              <p className="text-xs text-stone-400 mb-3">
                Selected wood: <span className="text-amber-200 font-semibold capitalize">{selectedWoodForPlanks}</span> ({resources.wood[selectedWoodForPlanks] || 0} logs available)
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={(resources.wood[selectedWoodForPlanks] || 0) < 10}
                  onClick={() => craftPlanks(selectedWoodForPlanks, 1)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    (resources.wood[selectedWoodForPlanks] || 0) >= 10
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-100 cursor-pointer shadow'
                      : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  +1 Plank (10w)
                </button>
                <button
                  disabled={(resources.wood[selectedWoodForPlanks] || 0) < 100}
                  onClick={() => craftPlanks(selectedWoodForPlanks, 10)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    (resources.wood[selectedWoodForPlanks] || 0) >= 100
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-100 cursor-pointer shadow'
                      : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  +10 Planks (100w)
                </button>
                <button
                  disabled={(resources.wood[selectedWoodForPlanks] || 0) < 10}
                  onClick={() => craftAllPlanks(selectedWoodForPlanks)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    (resources.wood[selectedWoodForPlanks] || 0) >= 10
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer shadow active:scale-95'
                      : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  Craft Max
                </button>
              </div>
            </div>

            {/* Quick Link to Planks */}
            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Looking to trade planks for Gold?</span>
              <button
                onClick={() => onOpenModal('planks')}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Open Planks & Gold Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. SAWMILL & PLANKS CONVERSION MENU */}
        {(activeModal === 'planks' || activeModal === 'sawmill') && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-800/30 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xl">
                ⚙️
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-stone-100">
                  Hydraulic Sawmill & Planks
                </h3>
                <span className="text-xs text-stone-400">
                  Milled Planks: <span className="font-mono text-amber-300 font-bold">{resources.planks} Planks</span> · 10 Wood ➔ 1 Plank
                </span>
              </div>
            </div>

            {/* Conversion: 10 Planks -> 1 Gold */}
            <div className="bg-stone-950/70 p-4 rounded-xl border border-amber-800/40 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Sell Planks for Gold</span>
                </span>
                <span className="font-mono text-amber-300 font-semibold bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                  10 Planks = 1 Gold
                </span>
              </div>

              <p className="text-xs text-stone-400 mb-3">
                Exchange batches of 10 planks for 1 Gold coin. Gold can then be spent on weapon damage upgrades or unlocking new trees.
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={resources.planks < 10}
                  onClick={() => sellPlanksForGold(1)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    resources.planks >= 10
                      ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 cursor-pointer shadow'
                      : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  Sell 10 (+1g)
                </button>
                <button
                  disabled={resources.planks < 50}
                  onClick={() => sellPlanksForGold(5)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    resources.planks >= 50
                      ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 cursor-pointer shadow'
                      : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  Sell 50 (+5g)
                </button>
                <button
                  disabled={resources.planks < 10}
                  onClick={sellAllPlanksForGold}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    resources.planks >= 10
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer shadow active:scale-95'
                      : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  Sell All (+{Math.floor(resources.planks / 10)}g)
                </button>
              </div>
            </div>

            {/* Quick Craft Planks directly in this modal */}
            <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-stone-300 font-semibold">Need more Planks?</span>
                <span className="font-mono text-stone-400 text-[11px]">10 Wood = 1 Plank</span>
              </div>
              <button
                disabled={totalWood < 10}
                onClick={() => craftAllPlanks()}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  totalWood >= 10
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-100 cursor-pointer shadow'
                    : 'bg-stone-950 text-stone-600 cursor-not-allowed'
                }`}
              >
                Mill All Available Wood into Planks
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Ready to spend Gold?</span>
              <button
                onClick={() => onOpenModal('gold')}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Open Gold & Upgrades Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3. GOLD CONVERSION MENU */}
        {activeModal === 'gold' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl">
                🪙
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-stone-100">
                  Gold Treasury & Upgrades
                </h3>
                <span className="text-xs text-stone-400">
                  Current Treasury: <span className="font-mono text-amber-300 font-bold text-sm">{resources.coins} Gold</span>
                </span>
              </div>
            </div>

            {/* Option A: 10 Gold = Weapon Damage Upgrade */}
            <div className="bg-stone-950/70 p-4 rounded-xl border border-amber-800/40 mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sword className="w-4 h-4 text-rose-400" />
                  <span>Weapon Damage Sharpening</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  +{weaponBonusDamage} Bonus DMG (Lv.{weaponUpgradeLevel})
                </span>
              </div>
              <p className="text-xs text-stone-400 mb-3">
                Spend 10 Gold to permanently increase axe damage by +2 per strike.
              </p>
              <button
                disabled={!canAffordWeaponUpgrade}
                onClick={upgradeWeaponWithGold}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  canAffordWeaponUpgrade
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer shadow active:scale-98 animate-pulse'
                    : 'bg-stone-900 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Upgrade Weapon (+2 DMG) — 10 Gold</span>
              </button>
            </div>

            {/* Option B: Unlock New Tree Types with Gold */}
            <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TreePine className="w-4 h-4 text-emerald-400" />
                <span>Unlock New Tree Groves with Gold</span>
              </div>

              <div className="flex flex-col gap-2">
                {woodTypes.map((type) => {
                  const def = WOOD_DEFINITIONS[type];
                  const isUnlocked = unlockedWoodTypes.includes(type);
                  const canUnlock = !isUnlocked && resources.coins >= def.unlockGoldCost;

                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between p-2 rounded-lg bg-stone-900 border border-stone-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: def.accentColor }} />
                        <span className="font-semibold text-stone-200 capitalize">{def.name}</span>
                        <span className="text-[11px] text-stone-500">
                          (Yields {def.baseYield[0]}-{def.baseYield[1]} wood)
                        </span>
                      </div>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <button
                          disabled={!canUnlock}
                          onClick={() => unlockTreeTypeWithGold(type)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                            canUnlock
                              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer shadow active:scale-95'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          Unlock for {def.unlockGoldCost} Gold
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Need more Gold?</span>
              <button
                onClick={() => onOpenModal('planks')}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Sell Planks for Gold (10 Planks = 1g)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 4. WEAPON & FORGE MENU */}
        {(activeModal === 'weapon' || activeModal === 'forge') && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-center text-rose-400 text-xl">
                ⚔️
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-stone-100">
                  Weapon Armory & Damage
                </h3>
                <span className="text-xs text-stone-400">
                  Equipped: <span className="font-semibold text-stone-200">{currentTool.name}</span> ·{' '}
                  <span className="font-mono text-amber-300 font-bold">
                    {currentTool.chopPower + weaponBonusDamage} Total DMG
                  </span>
                </span>
              </div>
            </div>

            {/* Upgrade with 10 Gold button */}
            <div className="bg-gradient-to-r from-stone-950 to-stone-900 p-4 rounded-xl border border-amber-600/50 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-amber-300 uppercase">
                  Axe Sharpening (+2 DMG)
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Permanent damage boost across all axes. Costs 10 Gold.
                </p>
              </div>

              <button
                disabled={!canAffordWeaponUpgrade}
                onClick={upgradeWeaponWithGold}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  canAffordWeaponUpgrade
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer shadow active:scale-95 animate-pulse'
                    : 'bg-stone-900 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>Upgrade (+2 DMG) — 10 Gold</span>
              </button>
            </div>

            {/* Weapon Arsenal */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {TOOLS.map((tool) => {
                const isOwned = ownedToolIds.includes(tool.id);
                const isEquipped = currentTool.id === tool.id;

                const hasCoins = resources.coins >= tool.cost.coins;
                const hasPlanks = !tool.cost.planks || resources.planks >= tool.cost.planks;
                const hasWood =
                  !tool.cost.woodType ||
                  !tool.cost.woodAmount ||
                  (resources.wood[tool.cost.woodType] || 0) >= tool.cost.woodAmount;
                const canAfford = !isOwned && hasCoins && hasPlanks && hasWood;

                return (
                  <div
                    key={tool.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      isEquipped
                        ? 'border-amber-500 bg-amber-950/20'
                        : isOwned
                        ? 'border-stone-800 bg-stone-950/60'
                        : 'border-stone-900 bg-stone-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-100 flex items-center gap-1.5">
                          <span>{tool.name}</span>
                          {isEquipped && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                              Equipped
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono">
                          Base {tool.chopPower} DMG + {weaponBonusDamage} Bonus ={' '}
                          <span className="text-amber-300 font-bold">
                            {tool.chopPower + weaponBonusDamage} DMG
                          </span>
                        </div>
                      </div>
                    </div>

                    {isOwned ? (
                      <button
                        disabled={isEquipped}
                        onClick={() => equipTool(tool.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          isEquipped
                            ? 'bg-stone-800 text-stone-500 cursor-default'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer shadow'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => buyTool(tool.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer shadow'
                            : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        Forge ({tool.cost.coins}g)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
