import React, { useState } from 'react';
import { Layers, Coins, ArrowRight, Sparkles, TrendingUp, Info, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { WOOD_DEFINITIONS, WoodType } from '../types/game';

export const SawmillTrade: React.FC = () => {
  const {
    resources,
    craftPlanks,
    craftAllPlanks,
    sellPlanksForGold,
    sellAllPlanksForGold,
    unlockedWoodTypes,
    buildings,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'sawmill' | 'market'>('sawmill');

  const sawmill = buildings.find((b) => b.id === 'sawmill');
  const sawmillLevel = sawmill ? sawmill.level : 0;

  const tradingCart = buildings.find((b) => b.id === 'trading_cart');
  const tradingLevel = tradingCart ? tradingCart.level : 0;

  const woodTypes: WoodType[] = ['pine', 'oak', 'birch', 'redwood', 'ironwood'];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Refinement & Trade Economy</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-stone-100 mt-1">
            Milling Sawmill & Merchant Treasury
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            Convert 10 Wood into 1 Plank at the Sawmill. Sell 10 Planks for 1 Gold to invest in weapon damage upgrades and unlock new tree groves.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-950/80 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('sawmill')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'sawmill'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sawmill (10 Wood ➔ 1 Plank)
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'market'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Market (10 Planks ➔ 1 Gold)
          </button>
        </div>
      </div>

      {/* SAWMILL TAB */}
      {activeTab === 'sawmill' && (
        <div className="flex flex-col gap-4">
          <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <h3 className="font-display font-semibold text-stone-100 text-sm">
                  Hydraulic Timber Sawmill (Lv. {sawmillLevel})
                </h3>
                <p className="text-xs text-stone-400">
                  Milling Rate: <span className="text-amber-300 font-mono font-bold">10 Wood = 1 Milled Plank</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400 font-mono">
                Current Planks: <span className="text-amber-300 font-bold">{resources.planks}</span>
              </span>
              <button
                onClick={() => craftAllPlanks()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-stone-950 shadow cursor-pointer active:scale-95"
              >
                Mill All Available Wood
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {woodTypes.map((type) => {
              const def = WOOD_DEFINITIONS[type];
              const isUnlocked = unlockedWoodTypes.includes(type);
              const count = resources.wood[type] || 0;
              const maxPlanksCanMake = Math.floor(count / 10);

              return (
                <div
                  key={type}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    !isUnlocked
                      ? 'bg-stone-950/40 border-stone-900 opacity-50'
                      : 'bg-stone-900/90 border-stone-800 shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: def.accentColor }} />
                        <h4 className="font-display font-semibold text-stone-100 text-sm">{def.name}</h4>
                      </div>
                      <span className="text-xs font-mono text-stone-400">
                        {count.toLocaleString()} logs
                      </span>
                    </div>

                    <div className="mt-3 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80 text-xs flex items-center justify-between">
                      <span className="text-stone-400">Milling Ratio:</span>
                      <span className="font-mono text-amber-300 font-semibold">
                        10 Wood <ArrowRight className="w-3 h-3 inline mx-0.5 text-stone-500" /> 1 Plank
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center gap-2">
                    <button
                      disabled={!isUnlocked || count < 10}
                      onClick={() => craftPlanks(type, 1)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                        isUnlocked && count >= 10
                          ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer shadow'
                          : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                      }`}
                    >
                      +1 Plank (10w)
                    </button>
                    <button
                      disabled={!isUnlocked || count < 100}
                      onClick={() => craftPlanks(type, 10)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                        isUnlocked && count >= 100
                          ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer shadow'
                          : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                      }`}
                    >
                      +10 Planks (100w)
                    </button>
                    <button
                      disabled={!isUnlocked || maxPlanksCanMake <= 0}
                      onClick={() => craftPlanks(type, maxPlanksCanMake)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        isUnlocked && maxPlanksCanMake > 0
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer shadow active:scale-95'
                          : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                      }`}
                    >
                      Max ({maxPlanksCanMake})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MARKET TAB */}
      {activeTab === 'market' && (
        <div className="flex flex-col gap-4">
          <div className="bg-stone-950/70 p-5 rounded-xl border border-stone-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛒</span>
              <div>
                <h3 className="font-display font-semibold text-stone-100 text-base">
                  Merchant Trading Post (10 Planks = 1 Gold)
                </h3>
                <p className="text-xs text-stone-400">
                  Sell building planks to merchants in exchange for Gold. Gold powers permanent weapon damage upgrades and new tree grove unlocks!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-stone-400 block">Available Planks</span>
                <span className="font-mono text-stone-200 font-bold text-sm">{resources.planks} Planks</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-400 block">Treasury</span>
                <span className="font-mono text-amber-300 font-bold text-sm">{resources.coins} Gold</span>
              </div>
            </div>
          </div>

          {/* Direct Plank-to-Gold Trading Station */}
          <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-semibold mb-1">
                <Coins className="w-4 h-4" />
                <span>Bulk Plank Merchant Exchange</span>
              </div>
              <h4 className="font-display font-bold text-xl text-stone-100">
                Sell Planks for Gold Coins
              </h4>
              <p className="text-xs text-stone-400 mt-1 max-w-lg leading-relaxed">
                Exchange 10 Planks for 1 Gold coin. Use your Gold to upgrade weapon damage (10 Gold = +2 DMG) and unlock new types of trees.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
              <button
                disabled={resources.planks < 10}
                onClick={() => sellPlanksForGold(1)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  resources.planks >= 10
                    ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 cursor-pointer shadow'
                    : 'bg-stone-950 text-stone-600 cursor-not-allowed'
                }`}
              >
                Sell 10 Planks ➔ +1 Gold
              </button>

              <button
                disabled={resources.planks < 50}
                onClick={() => sellPlanksForGold(5)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  resources.planks >= 50
                    ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 cursor-pointer shadow'
                    : 'bg-stone-950 text-stone-600 cursor-not-allowed'
                }`}
              >
                Sell 50 Planks ➔ +5 Gold
              </button>

              <button
                disabled={resources.planks < 10}
                onClick={sellAllPlanksForGold}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  resources.planks >= 10
                    ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer shadow active:scale-95'
                    : 'bg-stone-950 text-stone-600 cursor-not-allowed'
                }`}
              >
                Sell All Planks (+{Math.floor(resources.planks / 10)} Gold)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
