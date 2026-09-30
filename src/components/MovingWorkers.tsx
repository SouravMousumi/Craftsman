import React, { useEffect, useState, useRef } from 'react';
import { HiredWorker, TreeInstance, WoodType, WORKER_ROLES } from '../types/game';

interface WorkerState {
  id: string;
  roleId: string;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  facing: 'left' | 'right';
  action: 'walking_to_tree' | 'chopping' | 'walking_to_camp' | 'idle';
  targetTreeId: string | null;
  targetWoodType: WoodType;
  carriedWood: number;
  animTimer: number;
}

interface MovingWorkersProps {
  workers: HiredWorker[];
  trees: TreeInstance[];
  unlockedWoodTypes: WoodType[];
  onWorkerChop: (treeId: string, power: number) => void;
}

// Settlement drop-off center (Updated for 2x map: 5200x3600, center is 2600, 1800)
const CAMP_X = 2600;
const CAMP_Y = 1800;

export const MovingWorkers: React.FC<MovingWorkersProps> = ({
  workers,
  trees,
  unlockedWoodTypes,
  onWorkerChop,
}) => {
  const [workerSim, setWorkerSim] = useState<Record<string, WorkerState>>({});
  const lastTickRef = useRef<number>(performance.now());
  const reqIdRef = useRef<number | null>(null);

  // Initialize or update worker simulation entries when hiredWorkers changes
  useEffect(() => {
    setWorkerSim((prev) => {
      const next: Record<string, WorkerState> = { ...prev };

      // Add newly hired workers
      workers.forEach((w, idx) => {
        if (!next[w.id]) {
          // Spread initial positions around the camp
          const angle = (idx / Math.max(1, workers.length)) * Math.PI * 2;
          const spawnX = CAMP_X + Math.cos(angle) * 60;
          const spawnY = CAMP_Y + Math.sin(angle) * 40;

          next[w.id] = {
            id: w.id,
            roleId: w.roleId,
            name: w.name,
            x: spawnX,
            y: spawnY,
            targetX: spawnX,
            targetY: spawnY,
            facing: 'right',
            action: 'idle',
            targetTreeId: null,
            targetWoodType: 'pine',
            carriedWood: 0,
            animTimer: 0,
          };
        }
      });

      // Remove fired workers
      const activeIds = new Set(workers.map((w) => w.id));
      Object.keys(next).forEach((id) => {
        if (!activeIds.has(id)) {
          delete next[id];
        }
      });

      return next;
    });
  }, [workers]);

  // Main high-performance simulation tick loop (30-60 fps)
  useEffect(() => {
    let isCancelled = false;

    const tick = (now: number) => {
      if (isCancelled) return;
      const dt = Math.min(0.1, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      const pendingChops: { treeId: string; power: number }[] = [];

      setWorkerSim((prevSim) => {
        const nextSim: Record<string, WorkerState> = {};
        let hasChanges = false;

        Object.values(prevSim).forEach((w) => {
          const workerData = workers.find((item) => item.id === w.id);
          if (!workerData) return;

          const role = WORKER_ROLES.find((r) => r.id === workerData.roleId);
          const speed = 75; // Walk speed in pixels/sec
          let state = { ...w };

          // 1. If IDLE: Pick a tree to chop
          if (state.action === 'idle' || !state.targetTreeId) {
            // Find allowed wood types
            const allowed = role
              ? role.allowedWoods.filter((type) => unlockedWoodTypes.includes(type))
              : ['pine'];

            const prefWood =
              workerData.assignedWood === 'auto' || !unlockedWoodTypes.includes(workerData.assignedWood as WoodType)
                ? allowed[Math.floor(Math.random() * allowed.length)] || 'pine'
                : workerData.assignedWood;

            // Pick closest standing tree of that type
            const standing = trees.filter(
              (t) => t.state === 'standing' && t.woodType === prefWood
            );

            if (standing.length > 0) {
              // Sort by proximity
              const chosen = standing.reduce((best, t) => {
                const distToBest = Math.hypot(best.x - state.x, best.y - state.y);
                const distToT = Math.hypot(t.x - state.x, t.y - state.y);
                return distToT < distToBest ? t : best;
              }, standing[0]);

              state.targetTreeId = chosen.id;
              state.targetWoodType = chosen.woodType;
              state.targetX = chosen.x + (Math.random() > 0.5 ? 24 : -24);
              state.targetY = chosen.y + 12;
              state.action = 'walking_to_tree';
              hasChanges = true;
            } else {
              // Wander a little near camp if no trees
              state.targetX = CAMP_X + (Math.random() - 0.5) * 140;
              state.targetY = CAMP_Y + (Math.random() - 0.5) * 100;
              state.action = 'idle';
            }
          }

          // 2. WALKING TO TREE
          if (state.action === 'walking_to_tree') {
            const dx = state.targetX - state.x;
            const dy = state.targetY - state.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 8) {
              const moveDist = Math.min(dist, speed * dt);
              state.x += (dx / dist) * moveDist;
              state.y += (dy / dist) * moveDist;
              state.facing = dx < 0 ? 'left' : 'right';
              state.animTimer += dt;
              hasChanges = true;
            } else {
              // Arrived at tree!
              state.action = 'chopping';
              state.animTimer = 0;
              hasChanges = true;
            }
          }

          // 3. CHOPPING TREE
          else if (state.action === 'chopping') {
            state.animTimer += dt;
            const tree = trees.find((t) => t.id === state.targetTreeId);

            // If tree was felled or regrowing, switch to walking back with wood!
            if (!tree || tree.state !== 'standing') {
              state.action = 'walking_to_camp';
              state.targetX = CAMP_X + (Math.random() - 0.5) * 80;
              state.targetY = CAMP_Y + (Math.random() - 0.5) * 60;
              state.carriedWood = 5;
              state.targetTreeId = null;
              hasChanges = true;
            } else {
              // Strike tree every ~1.2s
              const chopCadence = role ? role.chopIntervalSeconds : 1.5;
              if (state.animTimer >= chopCadence) {
                state.animTimer = 0;
                const power = (role ? role.baseChopPower : 1) + Math.floor(workerData.level * 1.5);
                pendingChops.push({ treeId: tree.id, power });
                hasChanges = true;
              }
            }
          }

          // 4. WALKING BACK TO CAMP (HAULING LOGS)
          else if (state.action === 'walking_to_camp') {
            const dx = state.targetX - state.x;
            const dy = state.targetY - state.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 12) {
              const moveDist = Math.min(dist, (speed * 0.85) * dt); // Carrying wood is slightly heavier
              state.x += (dx / dist) * moveDist;
              state.y += (dy / dist) * moveDist;
              state.facing = dx < 0 ? 'left' : 'right';
              state.animTimer += dt;
              hasChanges = true;
            } else {
              // Reached camp! Deposit logs and seek next tree
              state.action = 'idle';
              state.carriedWood = 0;
              state.targetTreeId = null;
              hasChanges = true;
            }
          }

          nextSim[w.id] = state;
        });

        return hasChanges ? nextSim : prevSim;
      });

      // Dispatch chop actions OUTSIDE the setWorkerSim state updater
      if (pendingChops.length > 0) {
        pendingChops.forEach((chop) => {
          onWorkerChop(chop.treeId, chop.power);
        });
      }

      reqIdRef.current = requestAnimationFrame(tick);
    };

    reqIdRef.current = requestAnimationFrame(tick);
    return () => {
      isCancelled = true;
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, [workers, trees, unlockedWoodTypes, onWorkerChop]);

  return (
    <>
      {Object.values(workerSim).map((worker) => {
        const isChopping = worker.action === 'chopping';
        const isMoving = worker.action === 'walking_to_tree' || worker.action === 'walking_to_camp';
        const isHauling = worker.action === 'walking_to_camp';

        return (
          <div
            key={worker.id}
            className="absolute pointer-events-none select-none transition-none flex flex-col items-center"
            style={{
              left: `${worker.x}px`,
              top: `${worker.y}px`,
              transform: 'translate(-50%, -85%)',
              zIndex: Math.round(worker.y) + 5,
            }}
          >
            {/* Action bubble */}
            <div className="mb-0.5 flex items-center gap-1 bg-stone-900/90 text-stone-200 border border-stone-700 px-1.5 py-0.2 rounded text-[9px] shadow whitespace-nowrap">
              <span>{isHauling ? '🪵 Hauling' : isChopping ? '🪓 Chopping' : '🚶 Gathering'}</span>
            </div>

            {/* Worker Avatar */}
            <div
              className={`relative flex items-center justify-center transition-transform ${
                isMoving ? 'animate-bounce' : ''
              } ${isChopping ? 'scale-105' : ''}`}
              style={{
                transform: worker.facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              {/* Soft Ground Shadow */}
              <div className="absolute -bottom-1 w-9 h-2.5 bg-black/40 rounded-full blur-[1px]" />

              <div className="relative w-11 h-12 flex items-center justify-center">
                <svg viewBox="0 0 48 56" className="w-full h-full drop-shadow">
                  {/* Cap */}
                  <path d="M 14 12 C 14 6 20 4 24 4 C 28 4 34 6 34 12 Z" fill="#2563eb" />
                  {/* Face */}
                  <circle cx="24" cy="15" r="7" fill="#fed7aa" />
                  {/* Eye */}
                  <circle cx="26" cy="14" r="1.2" fill="#1c1917" />
                  {/* Beard */}
                  <path d="M 21 16 C 21 21 27 21 27 16 Z" fill="#78350f" />

                  {/* Vest */}
                  <rect x="17" y="22" width="14" height="15" rx="3" fill="#047857" />
                  {/* Shirt collar */}
                  <polygon points="21,22 24,26 27,22" fill="#fef3c7" />

                  {/* Pants */}
                  <rect x="18" y="37" width="5" height="11" rx="1.5" fill="#334155" />
                  <rect x="25" y="37" width="5" height="11" rx="1.5" fill="#334155" />

                  {/* Boots */}
                  <rect x="16" y="47" width="7" height="4" rx="1.5" fill="#451a03" />
                  <rect x="25" y="47" width="7" height="4" rx="1.5" fill="#451a03" />

                  {/* Axe Arm or Carried Log */}
                  {isHauling ? (
                    <g transform="translate(10, 16) rotate(-20)">
                      <rect x="0" y="0" width="22" height="6" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="0.8" />
                      <circle cx="21" cy="3" r="2.5" fill="#d97706" />
                    </g>
                  ) : (
                    <g
                      className={`origin-[20px_28px] ${
                        isChopping ? 'animate-pulse -rotate-45' : 'rotate-0'
                      }`}
                    >
                      <rect x="29" y="24" width="4" height="9" rx="1" fill="#047857" />
                      <line x1="30" y1="36" x2="38" y2="16" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 37 15 L 43 12 L 44 20 L 38 21 Z" fill="#94a3b8" />
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Worker Name Label */}
            <span className="text-[9px] font-mono text-stone-300 bg-stone-950/80 px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap">
              {worker.name}
            </span>
          </div>
        );
      })}
    </>
  );
};
