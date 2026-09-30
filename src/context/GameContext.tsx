import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  WoodType,
  WOOD_DEFINITIONS,
  HOUSE_STAGES,
  TOOLS,
  WORKER_ROLES,
  BASE_BUILDINGS,
  ToolDefinition,
  HiredWorker,
  SettlementBuilding,
  TreeInstance,
  FloatingParticle,
  GameStats,
  AnimalMonsterType,
  ANIMAL_DEFINITIONS,
  ForestObstacle,
  DEFAULT_OBSTACLES,
} from '../types/game';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'timbercraft_save_v2';

interface GameContextType {
  resources: {
    wood: Record<WoodType, number>;
    planks: number;
    coins: number;
    amber: number;
  };
  houseLevel: number;
  currentTool: ToolDefinition;
  ownedToolIds: string[];
  weaponUpgradeLevel: number;
  weaponBonusDamage: number;
  unlockedWoodTypes: WoodType[];
  hiredWorkers: HiredWorker[];
  buildings: SettlementBuilding[];
  selectedGrove: WoodType;
  setSelectedGrove: (grove: WoodType) => void;
  trees: TreeInstance[];
  particles: FloatingParticle[];
  stats: GameStats;
  storageCap: number;
  offlineEarnings: { wood: Partial<Record<WoodType, number>>; planks: number; seconds: number } | null;
  clearOfflineEarnings: () => void;
  // Player Health & Monster Combat
  playerHp: number;
  maxPlayerHp: number;
  isPlayerHit: boolean;
  deathNotification: { message: string; lostGold: number } | null;
  clearDeathNotification: () => void;
  damagePlayer: (amount: number, monsterName?: string) => boolean;
  healPlayer: (amount: number) => void;
  defeatMonster: (monsterType: AnimalMonsterType, monsterX: number, monsterY: number) => number;
  obstacles: ForestObstacle[];
  // Core Actions
  chopTree: (treeId: string, event?: React.MouseEvent | { clientX: number; clientY: number }, isWorker?: boolean, workerChopPower?: number) => void;
  craftPlanks: (woodType: WoodType, planksCount: number) => boolean;
  craftAllPlanks: (woodType?: WoodType) => boolean;
  sellPlanksForGold: (batchesOfTen: number) => boolean;
  sellAllPlanksForGold: () => boolean;
  upgradeWeaponWithGold: () => boolean;
  unlockTreeTypeWithGold: (woodType: WoodType) => boolean;
  // Progression
  upgradeHouse: () => boolean;
  canUpgradeHouse: boolean;
  upgradeBuilding: (buildingId: string) => boolean;
  buyTool: (toolId: string) => boolean;
  equipTool: (toolId: string) => void;
  hireWorker: (roleId: string) => boolean;
  fireWorker: (workerId: string) => void;
  assignWorker: (workerId: string, woodType: WoodType | 'auto') => void;
  levelUpWorker: (workerId: string) => boolean;
  sellWood: (woodType: WoodType, amount: number) => void;
  sellAllWood: (woodType: WoodType) => void;
  resetGame: () => void;
  activeWorkersCount: number;
  maxWorkerSlots: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_WOOD: Record<WoodType, number> = {
  pine: 0,
  oak: 0,
  birch: 0,
  redwood: 0,
  ironwood: 0,
};

function generateAllWorldTrees(): TreeInstance[] {
  const trees: TreeInstance[] = [];

  const groveConfigs: { type: WoodType; center: { x: number; y: number }; spread: number; count: number }[] = [
    { type: 'pine', center: { x: 1100, y: 1000 }, spread: 550, count: 18 },
    { type: 'oak', center: { x: 2600, y: 880 }, spread: 550, count: 18 },
    { type: 'birch', center: { x: 4200, y: 1050 }, spread: 550, count: 18 },
    { type: 'ironwood', center: { x: 1200, y: 2700 }, spread: 550, count: 16 },
    { type: 'redwood', center: { x: 4100, y: 2700 }, spread: 580, count: 16 },
  ];

  let idCounter = 1;
  groveConfigs.forEach((grove) => {
    const def = WOOD_DEFINITIONS[grove.type];
    for (let i = 0; i < grove.count; i++) {
      const angle = (i / grove.count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const dist = 60 + Math.random() * grove.spread;
      const x = Math.round(grove.center.x + Math.cos(angle) * dist);
      const y = Math.round(grove.center.y + Math.sin(angle) * dist);

      trees.push({
        id: `${grove.type}_tree_${idCounter++}`,
        woodType: grove.type,
        maxHp: def.maxHp,
        currentHp: def.maxHp,
        state: 'standing',
        regrowProgress: 100,
        x,
        y,
        sizeVariant: 0.9 + Math.random() * 0.25,
        shake: false,
      });
    }
  });

  return trees;
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<{
    wood: Record<WoodType, number>;
    planks: number;
    coins: number;
    amber: number;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.resources) return parsed.resources;
      }
    } catch {}
    return {
      wood: { ...INITIAL_WOOD, pine: 30 },
      planks: 0,
      coins: 0,
      amber: 0,
    };
  });

  const [houseLevel, setHouseLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.houseLevel === 'number') return parsed.houseLevel;
      }
    } catch {}
    return 0;
  });

  const [currentToolId, setCurrentToolId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentToolId) return parsed.currentToolId;
      }
    } catch {}
    return 'flint_hatchet';
  });

  const [ownedToolIds, setOwnedToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.ownedToolIds)) return parsed.ownedToolIds;
      }
    } catch {}
    return ['flint_hatchet'];
  });

  const [weaponUpgradeLevel, setWeaponUpgradeLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.weaponUpgradeLevel === 'number') return parsed.weaponUpgradeLevel;
      }
    } catch {}
    return 0;
  });

  const [unlockedWoodTypes, setUnlockedWoodTypes] = useState<WoodType[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.unlockedWoodTypes)) return parsed.unlockedWoodTypes;
      }
    } catch {}
    return ['pine'];
  });

  const [hiredWorkers, setHiredWorkers] = useState<HiredWorker[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.hiredWorkers)) return parsed.hiredWorkers;
      }
    } catch {}
    return [];
  });

  const [buildings, setBuildings] = useState<SettlementBuilding[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.buildings)) return parsed.buildings;
      }
    } catch {}
    return BASE_BUILDINGS;
  });

  const [selectedGrove, setSelectedGrove] = useState<WoodType>('pine');
  const [trees, setTrees] = useState<TreeInstance[]>(() => generateAllWorldTrees());
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  // Player Health & Combat State
  const [playerHp, setPlayerHp] = useState<number>(100);
  const maxPlayerHp = 100;
  const playerHpRef = useRef<number>(100);
  const [isPlayerHit, setIsPlayerHit] = useState<boolean>(false);
  const [deathNotification, setDeathNotification] = useState<{ message: string; lostGold: number } | null>(null);
  const [obstacles] = useState<ForestObstacle[]>(() => DEFAULT_OBSTACLES);
  const [offlineEarnings, setOfflineEarnings] = useState<{
    wood: Partial<Record<WoodType, number>>;
    planks: number;
    seconds: number;
  } | null>(null);

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stats) return parsed.stats;
      }
    } catch {}
    return {
      totalTreesCut: 0,
      totalWoodGathered: 0,
      totalCoinsEarned: 0,
      totalAmberFound: 0,
      manualChops: 0,
      workerChops: 0,
      startTime: Date.now(),
    };
  });

  const currentTool = TOOLS.find((t) => t.id === currentToolId) || TOOLS[0];
  const currentHouse = HOUSE_STAGES[houseLevel] || HOUSE_STAGES[0];

  // Each weapon upgrade purchased with 10 gold adds +2 damage permanently
  const weaponBonusDamage = weaponUpgradeLevel * 2;

  // Storage calculation: base cap (at least 1,500) + 50% extra per storage shed level
  const storageBuilding = buildings.find((b) => b.id === 'storage_shed');
  const storageMultiplier = 1 + (storageBuilding ? storageBuilding.level * 0.5 : 0);
  const baseStorage = Math.max(1500, currentHouse.storageCap * 5);
  const storageCap = Math.round(baseStorage * storageMultiplier);
  const maxWorkerSlots = currentHouse.maxWorkerSlots;

  // Forge bonuses: +10% damage, +5% crit per level
  const forgeBuilding = buildings.find((b) => b.id === 'forge');
  const forgeLevel = forgeBuilding ? forgeBuilding.level : 0;
  const forgeDamageBonus = forgeLevel * 0.1;
  const forgeCritBonus = forgeLevel * 0.05;

  // Merchant Outpost bonus
  const tradingBuilding = buildings.find((b) => b.id === 'trading_cart');
  const tradingLevel = tradingBuilding ? tradingBuilding.level : 0;
  const sellMultiplier = 1 + tradingLevel * 0.15;

  // Offline earnings calculation on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastSaved && parsed.hiredWorkers && parsed.hiredWorkers.length > 0) {
          const now = Date.now();
          const elapsedSeconds = Math.min(Math.floor((now - parsed.lastSaved) / 1000), 28800);
          if (elapsedSeconds > 15) {
            const earnedWood: Partial<Record<WoodType, number>> = {};
            let totalPlanksEarned = 0;

            parsed.hiredWorkers.forEach((worker: HiredWorker) => {
              const role = WORKER_ROLES.find((r) => r.id === worker.roleId) || WORKER_ROLES[0];
              const chopsDone = Math.floor(elapsedSeconds / (role.chopIntervalSeconds * 1.5));
              const effectiveWoodType: WoodType = worker.assignedWood === 'auto' ? role.allowedWoods[0] : (worker.assignedWood as WoodType);

              const yieldAmount = Math.max(1, Math.round(chopsDone * 3.5 * (1 + worker.level * 0.2)));
              earnedWood[effectiveWoodType] = (earnedWood[effectiveWoodType] || 0) + yieldAmount;
            });

            // Auto-convert some wood to planks if sawmill is present
            if (parsed.buildings) {
              const sm = parsed.buildings.find((b: SettlementBuilding) => b.id === 'sawmill');
              if (sm && sm.level > 0 && earnedWood.pine && earnedWood.pine >= 20) {
                const woodUsed = Math.min(earnedWood.pine, sm.level * 80);
                const planksCreated = Math.floor(woodUsed / 10);
                earnedWood.pine -= planksCreated * 10;
                totalPlanksEarned = planksCreated;
              }
            }

            setResources((prev) => {
              const newWood = { ...prev.wood };
              Object.keys(earnedWood).forEach((k) => {
                const wt = k as WoodType;
                newWood[wt] = Math.min(storageCap, (newWood[wt] || 0) + (earnedWood[wt] || 0));
              });
              return {
                ...prev,
                wood: newWood,
                planks: Math.min(storageCap, prev.planks + totalPlanksEarned),
              };
            });

            setOfflineEarnings({
              wood: earnedWood,
              planks: totalPlanksEarned,
              seconds: elapsedSeconds,
            });
          }
        }
      }
    } catch {}
  }, [storageCap]);

  // Auto-save every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const payload = {
          resources,
          houseLevel,
          currentToolId,
          ownedToolIds,
          weaponUpgradeLevel,
          unlockedWoodTypes,
          hiredWorkers,
          buildings,
          stats,
          lastSaved: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {}
    }, 4000);
    return () => clearInterval(timer);
  }, [resources, houseLevel, currentToolId, ownedToolIds, weaponUpgradeLevel, unlockedWoodTypes, hiredWorkers, buildings, stats]);

  // Tree regrowth simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTrees((prevTrees) => {
        let changed = false;
        const nextTrees = prevTrees.map((t) => {
          if (t.state === 'stump') {
            const def = WOOD_DEFINITIONS[t.woodType];
            const increment = (100 / (def.regrowTime * 2));
            const newProgress = Math.min(100, t.regrowProgress + increment);

            changed = true;
            if (newProgress >= 100) {
              return {
                ...t,
                state: 'standing' as const,
                currentHp: def.maxHp,
                maxHp: def.maxHp,
                regrowProgress: 100,
              };
            }
            return {
              ...t,
              regrowProgress: newProgress,
            };
          }
          return t;
        });
        return changed ? nextTrees : prevTrees;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Add floating particle helper
  const addParticle = useCallback((x: number, y: number, text: string, color: string, isCrit = false) => {
    const id = `p_${Date.now()}_${Math.random()}`;
    setParticles((prev) => [...prev.slice(-15), { id, x, y, text, color, isCrit }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 850);
  }, []);

  // Core Chop Function
  const chopTree = useCallback(
    (treeId: string, event?: React.MouseEvent | { clientX: number; clientY: number }, isWorker = false, workerChopPower?: number) => {
      setTrees((prevTrees) => {
        const treeIdx = prevTrees.findIndex((t) => t.id === treeId);
        if (treeIdx === -1) return prevTrees;

        const target = prevTrees[treeIdx];
        if (target.state !== 'standing') return prevTrees;

        const def = WOOD_DEFINITIONS[target.woodType];

        // Determine damage: base tool + weapon upgrades bought with 10 gold + forge bonus
        let damage = 1;
        let isCrit = false;

        if (isWorker) {
          damage = workerChopPower || 1;
        } else {
          const basePower = currentTool.chopPower + weaponBonusDamage;
          const totalPower = Math.round(basePower * (1 + forgeDamageBonus));

          const totalCritChance = currentTool.critChance + forgeCritBonus;
          isCrit = Math.random() < totalCritChance;
          damage = isCrit ? Math.round(totalPower * currentTool.critMultiplier) : totalPower;
        }

        const newHp = Math.max(0, target.currentHp - damage);

        // Visual coordinates for particle
        let px = 50;
        let py = 50;
        if (event && 'clientX' in event && event.clientX) {
          px = event.clientX;
          py = event.clientY;
        }

        // Hit Yield: player immediately gets wood on every hit!
        const hitWood = def.hitYield;
        setResources((prev) => ({
          ...prev,
          wood: {
            ...prev.wood,
            [target.woodType]: Math.min(storageCap, (prev.wood[target.woodType] || 0) + hitWood),
          },
        }));

        // Sound & Particle Feedback
        if (!isWorker) {
          if (isCrit) {
            sound.playCrit();
            addParticle(px, py, `CRIT! -${damage} HP (+${hitWood} ${def.name})`, '#f59e0b', true);
          } else {
            sound.playChop();
            addParticle(px, py, `-${damage} HP (+${hitWood} Wood)`, '#ffffff', false);
          }
        }

        // Tree fell down! Award large baseYield bonus
        if (newHp === 0) {
          if (!isWorker) sound.playTreeFall();

          const [minY, maxY] = def.baseYield;
          let yieldAmount = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

          if (isCrit) yieldAmount = Math.round(yieldAmount * 1.5);

          // Rare amber drop
          let amberGained = 0;
          if (Math.random() < (isCrit ? 0.25 : 0.08) + (target.woodType === 'ironwood' ? 0.15 : 0)) {
            amberGained = 1;
            sound.playCoin();
          }

          // Update player resources with large fell yield
          setResources((prev) => {
            const currentAmount = prev.wood[target.woodType] || 0;
            const actualAdded = Math.min(storageCap - currentAmount, yieldAmount);
            return {
              ...prev,
              wood: {
                ...prev.wood,
                [target.woodType]: currentAmount + actualAdded,
              },
              amber: prev.amber + amberGained,
            };
          });

          // Float wood fell bonus
          if (!isWorker) {
            setTimeout(() => {
              addParticle(px, py - 24, `TIMBER! +${yieldAmount} ${def.name}`, def.color, true);
              if (amberGained > 0) {
                addParticle(px + 15, py - 48, `+${amberGained} Amber Drop!`, '#fbbf24', true);
              }
            }, 80);
          }

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalTreesCut: prev.totalTreesCut + 1,
            totalWoodGathered: prev.totalWoodGathered + yieldAmount + hitWood,
            totalAmberFound: prev.totalAmberFound + amberGained,
            manualChops: prev.manualChops + (isWorker ? 0 : 1),
            workerChops: prev.workerChops + (isWorker ? 1 : 0),
          }));

          // Trigger falling animation
          const nextTrees = [...prevTrees];
          nextTrees[treeIdx] = {
            ...target,
            currentHp: 0,
            state: 'falling',
            shake: true,
          };

          setTimeout(() => {
            setTrees((current) => {
              const idx = current.findIndex((t) => t.id === target.id);
              if (idx === -1) return current;
              const copy = [...current];
              copy[idx] = {
                ...copy[idx],
                state: 'stump',
                regrowProgress: 0,
                shake: false,
              };
              return copy;
            });
          }, 650);

          return nextTrees;
        }

        // Regular hit
        const nextTrees = [...prevTrees];
        nextTrees[treeIdx] = {
          ...target,
          currentHp: newHp,
          shake: true,
        };

        setTimeout(() => {
          setTrees((current) => {
            const idx = current.findIndex((t) => t.id === target.id);
            if (idx === -1) return current;
            const copy = [...current];
            copy[idx] = { ...copy[idx], shake: false };
            return copy;
          });
        }, 300);

        return nextTrees;
      });
    },
    [currentTool, weaponBonusDamage, forgeDamageBonus, forgeCritBonus, storageCap, addParticle]
  );

  // 10 wood = 1 plank
  const craftPlanks = useCallback(
    (woodType: WoodType, planksCount: number) => {
      const woodNeeded = planksCount * 10;
      const currentWood = resources.wood[woodType] || 0;
      if (currentWood < woodNeeded || planksCount <= 0) return false;

      setResources((prev) => ({
        ...prev,
        wood: {
          ...prev.wood,
          [woodType]: prev.wood[woodType] - woodNeeded,
        },
        planks: Math.min(storageCap, prev.planks + planksCount),
      }));

      sound.playSaw();
      return true;
    },
    [resources.wood, storageCap]
  );

  // Craft all available wood into planks (10 wood = 1 plank)
  const craftAllPlanks = useCallback(
    (targetWood?: WoodType) => {
      const woodToProcess = targetWood ? [targetWood] : (['pine', 'oak', 'birch', 'redwood', 'ironwood'] as WoodType[]);
      let totalPlanksMade = 0;

      setResources((prev) => {
        const newWood = { ...prev.wood };
        woodToProcess.forEach((wt) => {
          const available = newWood[wt] || 0;
          const makePlanks = Math.floor(available / 10);
          if (makePlanks > 0) {
            newWood[wt] -= makePlanks * 10;
            totalPlanksMade += makePlanks;
          }
        });

        if (totalPlanksMade === 0) return prev;

        return {
          ...prev,
          wood: newWood,
          planks: Math.min(storageCap, prev.planks + totalPlanksMade),
        };
      });

      if (totalPlanksMade > 0) {
        sound.playSaw();
        return true;
      }
      return false;
    },
    [storageCap]
  );

  // 10 planks = 1 Gold
  const sellPlanksForGold = useCallback(
    (batchesOfTen: number) => {
      const planksToSell = batchesOfTen * 10;
      if (resources.planks < planksToSell || batchesOfTen <= 0) return false;

      setResources((prev) => ({
        ...prev,
        planks: prev.planks - planksToSell,
        coins: prev.coins + batchesOfTen,
      }));

      setStats((prev) => ({
        ...prev,
        totalCoinsEarned: prev.totalCoinsEarned + batchesOfTen,
      }));

      sound.playCoin();
      return true;
    },
    [resources.planks]
  );

  // Sell all planks for Gold (in multiples of 10)
  const sellAllPlanksForGold = useCallback(() => {
    const batches = Math.floor(resources.planks / 10);
    if (batches <= 0) return false;
    return sellPlanksForGold(batches);
  }, [resources.planks, sellPlanksForGold]);

  // Upgrade Weapon with 10 Gold -> increases damage!
  const upgradeWeaponWithGold = useCallback(() => {
    if (resources.coins < 10) return false;

    setResources((prev) => ({
      ...prev,
      coins: prev.coins - 10,
    }));

    setWeaponUpgradeLevel((prev) => prev + 1);
    sound.playAnvil();

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff'],
      });
    } catch {}

    return true;
  }, [resources.coins]);

  // Unlock new tree types with Gold!
  const unlockTreeTypeWithGold = useCallback(
    (woodType: WoodType) => {
      const def = WOOD_DEFINITIONS[woodType];
      if (unlockedWoodTypes.includes(woodType)) return true;
      if (resources.coins < def.unlockGoldCost) return false;

      setResources((prev) => ({
        ...prev,
        coins: prev.coins - def.unlockGoldCost,
      }));

      setUnlockedWoodTypes((prev) => [...prev, woodType]);
      setSelectedGrove(woodType);
      sound.playHouseUpgrade();

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
          colors: [def.color, '#facc15', '#22c55e'],
        });
      } catch {}

      return true;
    },
    [unlockedWoodTypes, resources.coins]
  );

  // Clear death popup / banner
  const clearDeathNotification = useCallback(() => {
    setDeathNotification(null);
  }, []);

  // Player combat damage & death
  const damagePlayer = useCallback(
    (amount: number, monsterName: string = 'Forest Beast') => {
      sound.playPlayerHurt();
      setIsPlayerHit(true);
      setTimeout(() => setIsPlayerHit(false), 240);

      const currentHp = playerHpRef.current;
      const willDie = currentHp - amount <= 0;

      if (willDie) {
        playerHpRef.current = maxPlayerHp;
        setPlayerHp(maxPlayerHp);
        sound.playPlayerDeath();

        // User requirement: "You die you loose 10 gold"
        setResources((prevRes) => ({
          ...prevRes,
          coins: Math.max(0, prevRes.coins - 10),
        }));

        setStats((prevStats) => ({
          ...prevStats,
          playerDeaths: (prevStats.playerDeaths || 0) + 1,
        }));

        setDeathNotification({
          message: `You were defeated by a ${monsterName}! You lost 10 Gold and woke up safely at camp.`,
          lostGold: 10,
        });

        return true;
      } else {
        const nextHp = currentHp - amount;
        playerHpRef.current = nextHp;
        setPlayerHp(nextHp);
        return false;
      }
    },
    [maxPlayerHp]
  );

  // Heal player
  const healPlayer = useCallback(
    (amount: number) => {
      const nextHp = Math.min(maxPlayerHp, playerHpRef.current + amount);
      playerHpRef.current = nextHp;
      setPlayerHp(nextHp);
    },
    [maxPlayerHp]
  );

  // Defeat wild animal / monster
  const defeatMonster = useCallback(
    (monsterType: AnimalMonsterType, monsterX: number, monsterY: number) => {
      const def = ANIMAL_DEFINITIONS[monsterType];
      const reward = def ? def.goldReward : 10;

      sound.playMonsterDefeated();

      // User requirement: "You kill them you earn 10 gold . The gold will varry based on the strength of the monster"
      setResources((prev) => ({
        ...prev,
        coins: prev.coins + reward,
      }));

      // Floating gold particle
      addParticle(monsterX, monsterY - 24, `+${reward} Gold! 🪙 Defeated ${def.name}`, '#fbbf24', true);

      setStats((prev) => ({
        ...prev,
        totalCoinsEarned: prev.totalCoinsEarned + reward,
        monstersKilled: (prev.monstersKilled || 0) + 1,
      }));

      return reward;
    },
    [addParticle]
  );

  // Natural passive regeneration: heal 5 HP every 2.5s when injured
  useEffect(() => {
    const timer = setInterval(() => {
      if (playerHpRef.current < maxPlayerHp) {
        const nextHp = Math.min(maxPlayerHp, playerHpRef.current + 5);
        playerHpRef.current = nextHp;
        setPlayerHp(nextHp);
      }
    }, 2500);
    return () => clearInterval(timer);
  }, [maxPlayerHp]);

  // House Upgrade check
  const nextHouseStage = HOUSE_STAGES[houseLevel + 1];
  const canUpgradeHouse = Boolean(
    nextHouseStage &&
      resources.coins >= nextHouseStage.cost.coins &&
      resources.planks >= nextHouseStage.cost.planks &&
      Object.entries(nextHouseStage.cost.wood).every(
        ([wt, needed]) => (resources.wood[wt as WoodType] || 0) >= (needed || 0)
      )
  );

  const upgradeHouse = useCallback(() => {
    if (!nextHouseStage || !canUpgradeHouse) return false;

    setResources((prev) => {
      const newWood = { ...prev.wood };
      Object.entries(nextHouseStage.cost.wood).forEach(([wt, amt]) => {
        newWood[wt as WoodType] -= amt || 0;
      });
      return {
        ...prev,
        coins: prev.coins - nextHouseStage.cost.coins,
        planks: prev.planks - nextHouseStage.cost.planks,
        wood: newWood,
      };
    });

    const newLevel = houseLevel + 1;
    setHouseLevel(newLevel);
    sound.playHouseUpgrade();

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#eab308', '#38bdf8', '#f97316'],
      });
    } catch {}

    return true;
  }, [nextHouseStage, canUpgradeHouse, houseLevel]);

  // Upgrade Base Building
  const upgradeBuilding = useCallback(
    (buildingId: string) => {
      const bIdx = buildings.findIndex((b) => b.id === buildingId);
      if (bIdx === -1) return false;
      const b = buildings[bIdx];
      if (b.level >= b.maxLevel) return false;

      const costMultiplier = Math.pow(1.6, b.level);
      const coinCost = Math.round(b.cost.coins * costMultiplier);
      const plankCost = Math.round(b.cost.planks * costMultiplier);

      if (resources.coins < coinCost || resources.planks < plankCost) return false;
      for (const [wt, amt] of Object.entries(b.cost.wood)) {
        const required = Math.round((amt || 0) * costMultiplier);
        if ((resources.wood[wt as WoodType] || 0) < required) return false;
      }

      setResources((prev) => {
        const newWood = { ...prev.wood };
        for (const [wt, amt] of Object.entries(b.cost.wood)) {
          const required = Math.round((amt || 0) * costMultiplier);
          newWood[wt as WoodType] -= required;
        }
        return {
          ...prev,
          coins: prev.coins - coinCost,
          planks: prev.planks - plankCost,
          wood: newWood,
        };
      });

      setBuildings((prev) => {
        const copy = [...prev];
        copy[bIdx] = { ...copy[bIdx], level: copy[bIdx].level + 1 };
        return copy;
      });

      sound.playAnvil();
      return true;
    },
    [buildings, resources]
  );

  // Buy Tool
  const buyTool = useCallback(
    (toolId: string) => {
      const tool = TOOLS.find((t) => t.id === toolId);
      if (!tool || ownedToolIds.includes(toolId)) return false;

      if (resources.coins < tool.cost.coins) return false;
      if (tool.cost.planks && resources.planks < tool.cost.planks) return false;
      if (tool.cost.woodType && tool.cost.woodAmount) {
        if ((resources.wood[tool.cost.woodType] || 0) < tool.cost.woodAmount) return false;
      }

      setResources((prev) => {
        const newWood = { ...prev.wood };
        if (tool.cost.woodType && tool.cost.woodAmount) {
          newWood[tool.cost.woodType] -= tool.cost.woodAmount;
        }
        return {
          ...prev,
          coins: prev.coins - tool.cost.coins,
          planks: prev.planks - (tool.cost.planks || 0),
          wood: newWood,
        };
      });

      setOwnedToolIds((prev) => [...prev, toolId]);
      setCurrentToolId(toolId);
      sound.playAnvil();
      return true;
    },
    [ownedToolIds, resources]
  );

  const equipTool = useCallback((toolId: string) => {
    if (ownedToolIds.includes(toolId)) {
      setCurrentToolId(toolId);
      sound.playAnvil();
    }
  }, [ownedToolIds]);

  // Hire Worker
  const hireWorker = useCallback(
    (roleId: string) => {
      if (hiredWorkers.length >= maxWorkerSlots) return false;
      const role = WORKER_ROLES.find((r) => r.id === roleId);
      if (!role || resources.coins < role.hireCost) return false;

      const newWorker: HiredWorker = {
        id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        roleId,
        name: `${role.title} ${hiredWorkers.length + 1}`,
        level: 1,
        assignedWood: 'auto',
        totalGathered: 0,
      };

      setResources((prev) => ({
        ...prev,
        coins: prev.coins - role.hireCost,
      }));

      setHiredWorkers((prev) => [...prev, newWorker]);
      sound.playCoin();
      return true;
    },
    [hiredWorkers.length, maxWorkerSlots, resources.coins]
  );

  const fireWorker = useCallback((workerId: string) => {
    setHiredWorkers((prev) => prev.filter((w) => w.id !== workerId));
  }, []);

  const assignWorker = useCallback((workerId: string, woodType: WoodType | 'auto') => {
    setHiredWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, assignedWood: woodType } : w))
    );
  }, []);

  const levelUpWorker = useCallback(
    (workerId: string) => {
      const worker = hiredWorkers.find((w) => w.id === workerId);
      if (!worker) return false;
      const role = WORKER_ROLES.find((r) => r.id === worker.roleId);
      if (!role) return false;

      const upgradeCost = Math.round(role.hireCost * Math.pow(role.levelCostMultiplier, worker.level));
      if (resources.coins < upgradeCost) return false;

      setResources((prev) => ({
        ...prev,
        coins: prev.coins - upgradeCost,
      }));

      setHiredWorkers((prev) =>
        prev.map((w) => (w.id === workerId ? { ...w, level: w.level + 1 } : w))
      );

      sound.playCoin();
      return true;
    },
    [hiredWorkers, resources.coins]
  );

  const sellWood = useCallback(
    (woodType: WoodType, amount: number) => {
      const available = resources.wood[woodType] || 0;
      if (available <= 0 || amount <= 0) return;

      const countToSell = Math.min(available, amount);
      const def = WOOD_DEFINITIONS[woodType];
      const goldEarned = Math.max(1, Math.round(countToSell * def.sellPrice * sellMultiplier * 0.1));

      setResources((prev) => ({
        ...prev,
        wood: {
          ...prev.wood,
          [woodType]: prev.wood[woodType] - countToSell,
        },
        coins: prev.coins + goldEarned,
      }));

      setStats((prev) => ({
        ...prev,
        totalCoinsEarned: prev.totalCoinsEarned + goldEarned,
      }));

      sound.playCoin();
    },
    [resources.wood, sellMultiplier]
  );

  const sellAllWood = useCallback(
    (woodType: WoodType) => {
      sellWood(woodType, resources.wood[woodType] || 0);
    },
    [sellWood, resources.wood]
  );

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setResources({
      wood: { ...INITIAL_WOOD, pine: 30 },
      planks: 0,
      coins: 0,
      amber: 0,
    });
    setHouseLevel(0);
    setCurrentToolId('flint_hatchet');
    setOwnedToolIds(['flint_hatchet']);
    setWeaponUpgradeLevel(0);
    setUnlockedWoodTypes(['pine']);
    setHiredWorkers([]);
    setBuildings(BASE_BUILDINGS);
    setSelectedGrove('pine');
    setTrees(generateAllWorldTrees());
    setStats({
      totalTreesCut: 0,
      totalWoodGathered: 0,
      totalCoinsEarned: 0,
      totalAmberFound: 0,
      manualChops: 0,
      workerChops: 0,
      startTime: Date.now(),
    });
  }, []);

  const clearOfflineEarnings = useCallback(() => {
    setOfflineEarnings(null);
  }, []);

  // Worker automated chopping loop
  useEffect(() => {
    if (hiredWorkers.length === 0) return;

    const interval = setInterval(() => {
      setHiredWorkers((currentWorkers) => {
        if (currentWorkers.length === 0) return currentWorkers;

        currentWorkers.forEach((worker) => {
          const role = WORKER_ROLES.find((r) => r.id === worker.roleId);
          if (!role) return;

          const allowedUnlocked = role.allowedWoods.filter((w) => unlockedWoodTypes.includes(w));
          if (allowedUnlocked.length === 0) return;

          const targetWood: WoodType =
            worker.assignedWood === 'auto' || !unlockedWoodTypes.includes(worker.assignedWood as WoodType)
              ? allowedUnlocked[Math.floor(Math.random() * allowedUnlocked.length)]
              : worker.assignedWood;

          setTrees((currentTrees) => {
            const validTrees = currentTrees.filter((t) => t.state === 'standing' && t.woodType === targetWood);
            if (validTrees.length === 0) return currentTrees;

            const chosenTree = validTrees[Math.floor(Math.random() * validTrees.length)];
            const power = role.baseChopPower + Math.floor(worker.level * 1.5);

            setTimeout(() => {
              chopTree(chosenTree.id, undefined, true, power);
            }, 0);

            return currentTrees;
          });
        });

        return currentWorkers;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [hiredWorkers, chopTree, unlockedWoodTypes]);

  return (
    <GameContext.Provider
      value={{
        resources,
        houseLevel,
        currentTool,
        ownedToolIds,
        weaponUpgradeLevel,
        weaponBonusDamage,
        unlockedWoodTypes,
        hiredWorkers,
        buildings,
        selectedGrove,
        setSelectedGrove,
        trees,
        particles,
        stats,
        storageCap,
        offlineEarnings,
        clearOfflineEarnings,
        playerHp,
        maxPlayerHp,
        isPlayerHit,
        deathNotification,
        clearDeathNotification,
        damagePlayer,
        healPlayer,
        defeatMonster,
        obstacles,
        chopTree,
        craftPlanks,
        craftAllPlanks,
        sellPlanksForGold,
        sellAllPlanksForGold,
        upgradeWeaponWithGold,
        unlockTreeTypeWithGold,
        upgradeHouse,
        canUpgradeHouse,
        upgradeBuilding,
        buyTool,
        equipTool,
        hireWorker,
        fireWorker,
        assignWorker,
        levelUpWorker,
        sellWood,
        sellAllWood,
        resetGame,
        activeWorkersCount: hiredWorkers.length,
        maxWorkerSlots,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
