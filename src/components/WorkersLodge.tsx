import React from 'react';
import { Users, UserPlus, ArrowUpCircle, Trash2, ShieldCheck, Axe, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { WORKER_ROLES, WOOD_DEFINITIONS, WoodType, HiredWorker } from '../types/game';

export const WorkersLodge: React.FC = () => {
  const {
    hiredWorkers,
    maxWorkerSlots,
    hireWorker,
    fireWorker,
    assignWorker,
    levelUpWorker,
    resources,
    houseLevel,
  } = useGame();

  const isFull = hiredWorkers.length >= maxWorkerSlots;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Forester Bunkhouse & Guild</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-stone-100 mt-1">
            Lumberjack Workforce
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            Hire skilled woodsmen to fell timber automatically while you build. Assign them to specific groves or let them auto-harvest.
          </p>
        </div>

        {/* Worker Slot Capacity Meter */}
        <div className="bg-stone-950/80 px-4 py-3 rounded-xl border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-700/40 flex items-center justify-center text-emerald-400 text-lg">
            🪓
          </div>
          <div>
            <div className="text-xs text-stone-400">Homestead Bunkhouse</div>
            <div className="text-sm font-mono font-bold text-stone-100 mt-0.5">
              <span className={isFull ? 'text-amber-400' : 'text-emerald-400'}>
                {hiredWorkers.length}
              </span>{' '}
              / {maxWorkerSlots} Workers Hired
            </div>
            {isFull && (
              <span className="text-[10px] text-stone-500 block">
                Upgrade house to unlock more worker slots
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Available Roles for Hire */}
      <div>
        <h3 className="font-display font-bold text-lg text-stone-100 mb-3 flex items-center gap-2">
          <span>Available Recruits</span>
          <span className="text-xs font-mono font-normal text-stone-500">· Guild Hall</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKER_ROLES.map((role) => {
            const isUnlocked = houseLevel >= role.unlockedAtHouseLevel;
            const canAfford = resources.coins >= role.hireCost && !isFull && isUnlocked;

            return (
              <div
                key={role.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  !isUnlocked
                    ? 'bg-stone-950/40 border-stone-900 opacity-50'
                    : 'bg-stone-900/90 border-stone-800 shadow-md hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold text-stone-100 text-sm">{role.name}</h4>
                    <span className="text-[11px] text-amber-500 font-mono">
                      {isUnlocked ? `${role.hireCost} Gold` : `Locked (Lv.${role.unlockedAtHouseLevel})`}
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 mt-2 leading-relaxed min-h-[32px]">
                    {role.description}
                  </p>

                  <div className="mt-3 text-xs bg-stone-950/60 p-2 rounded border border-stone-800/80 font-mono flex flex-col gap-1">
                    <div className="flex justify-between text-stone-400">
                      <span>Base Power:</span>
                      <span className="text-amber-300 font-bold">{role.baseChopPower} DMG</span>
                    </div>
                    <div className="flex justify-between text-stone-400">
                      <span>Rate:</span>
                      <span className="text-stone-300">Every {role.chopIntervalSeconds}s</span>
                    </div>
                    <div className="flex justify-between text-stone-400">
                      <span>Woods:</span>
                      <span className="text-emerald-400 capitalize">{role.allowedWoods.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => hireWorker(role.id)}
                  className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    canAfford
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow cursor-pointer active:scale-98'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>
                    {!isUnlocked ? 'Requires House Upgrade' : isFull ? 'Bunkhouse Full' : 'Hire Worker'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Hired Workers Roster */}
      <div>
        <h3 className="font-display font-bold text-lg text-stone-100 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Active Lumberjacks</span>
            <span className="text-xs font-mono font-normal text-stone-500">
              ({hiredWorkers.length} Active)
            </span>
          </div>
        </h3>

        {hiredWorkers.length === 0 ? (
          <div className="bg-stone-900/60 p-8 rounded-2xl border border-stone-800 text-center">
            <div className="text-3xl mb-2">🪓</div>
            <h4 className="font-display font-semibold text-stone-200">No Workers Hired Yet</h4>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Recruit an apprentice or forester above using gold to start automating your wood harvesting!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hiredWorkers.map((worker) => {
              const role = WORKER_ROLES.find((r) => r.id === worker.roleId) || WORKER_ROLES[0];
              const upgradeCost = Math.round(
                role.hireCost * Math.pow(role.levelCostMultiplier, worker.level)
              );
              const canAffordUpgrade = resources.coins >= upgradeCost;

              return (
                <div
                  key={worker.id}
                  className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-sm">
                          🧔
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-stone-100 text-sm">
                            {worker.name}
                          </h4>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {role.name} · Level {worker.level}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => fireWorker(worker.id)}
                        title="Dismiss Worker"
                        aria-label={`Dismiss ${worker.name}`}
                        className="p-1.5 text-stone-500 hover:text-rose-400 rounded hover:bg-stone-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Stats & Assignment */}
                    <div className="mt-3 text-xs flex flex-col gap-2">
                      <div className="flex items-center justify-between text-stone-300">
                        <span>Chop Power:</span>
                        <span className="font-mono font-semibold text-amber-300">
                          {role.baseChopPower + Math.floor(worker.level * 1.5)} DMG
                        </span>
                      </div>

                      {/* Target Assignment Selector */}
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Target Wood:</span>
                        <select
                          value={worker.assignedWood}
                          onChange={(e) =>
                            assignWorker(worker.id, e.target.value as WoodType | 'auto')
                          }
                          className="bg-stone-950 text-stone-200 border border-stone-800 rounded px-2 py-1 text-xs cursor-pointer focus:outline-none focus:border-amber-500 capitalize"
                        >
                          <option value="auto">Auto-Balance</option>
                          {role.allowedWoods.map((w) => (
                            <option key={w} value={w}>
                              {WOOD_DEFINITIONS[w].name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Level Up Button */}
                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-400 font-mono">
                      Cost: <span className="text-amber-300">{upgradeCost} Gold</span>
                    </span>

                    <button
                      disabled={!canAffordUpgrade}
                      onClick={() => levelUpWorker(worker.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                        canAffordUpgrade
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 active:scale-95 shadow cursor-pointer'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      <span>Train (+1 Lv)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
