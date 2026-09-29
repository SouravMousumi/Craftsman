import React from 'react';
import { Axe, Layers, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { WOOD_DEFINITIONS, WoodType } from '../types/game';

export const OfflineModal: React.FC = () => {
  const { offlineEarnings, clearOfflineEarnings } = useGame();

  if (!offlineEarnings) return null;

  const minutesAway = Math.max(1, Math.round(offlineEarnings.seconds / 60));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-600/50 rounded-2xl shadow-2xl p-6 text-stone-100 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl mb-4">
          🪵
        </div>

        <h3 className="font-display font-extrabold text-2xl text-amber-100">
          Welcome Back, Settler!
        </h3>
        <p className="text-xs sm:text-sm text-stone-400 mt-1.5 leading-relaxed">
          While you were away from the camp for <span className="text-amber-300 font-semibold">{minutesAway} minutes</span>, your hired lumberjacks kept their axes swinging.
        </p>

        {/* Harvest Summary */}
        <div className="my-5 bg-stone-950/70 p-4 rounded-xl border border-stone-800 text-left flex flex-col gap-2">
          <div className="text-xs uppercase font-semibold text-stone-400 mb-1">
            Timber Brought to Base:
          </div>

          {Object.entries(offlineEarnings.wood).map(([wt, amt]) => {
            const def = WOOD_DEFINITIONS[wt as WoodType];
            return (
              <div key={wt} className="flex items-center justify-between text-xs">
                <span className="text-stone-300 flex items-center gap-1.5 capitalize">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: def.accentColor }} />
                  {def.name}
                </span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  +{amt} Logs
                </span>
              </div>
            );
          })}

          {offlineEarnings.planks > 0 && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Milled Planks (Sawmill)
              </span>
              <span className="font-mono text-amber-300 font-bold tabular-nums">
                +{offlineEarnings.planks} Planks
              </span>
            </div>
          )}
        </div>

        <button
          onClick={clearOfflineEarnings}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-display font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Collect Timber & Continue</span>
        </button>
      </div>
    </div>
  );
};
