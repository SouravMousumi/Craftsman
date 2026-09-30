import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Compass,
  Lock,
  TreePine,
  Sparkles,
  ArrowRight,
  Layers,
  Coins,
  Sword,
  Home,
  Heart,
  Skull,
  ShieldAlert,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import {
  WOOD_DEFINITIONS,
  WoodType,
  TreeInstance,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  HOUSE_STAGES,
  AnimalMonster,
  AnimalMonsterType,
  ANIMAL_DEFINITIONS,
  ForestObstacle,
} from '../types/game';
import { VirtualJoystick, JoystickVector } from './VirtualJoystick';
import { PlayerCharacter } from './PlayerCharacter';
import { MovingWorkers } from './MovingWorkers';
import { HouseBuildingVisual } from './HouseBuildingVisual';
import { SawmillBuildingVisual } from './SawmillBuildingVisual';
import { ForgeBuildingVisual } from './ForgeBuildingVisual';
import { ForestObstacles } from './ForestObstacles';
import { AnimalMonsterGraphic } from './AnimalMonsterGraphic';
import { sound } from '../utils/audio';

// Custom SVG Tree component
const TreeGraphic: React.FC<{
  tree: TreeInstance;
  isUnlocked: boolean;
  isHovered: boolean;
}> = ({ tree, isUnlocked, isHovered }) => {
  const def = WOOD_DEFINITIONS[tree.woodType];
  const hpPercent = Math.max(0, Math.min(100, (tree.currentHp / tree.maxHp) * 100));

  if (tree.state === 'stump') {
    return (
      <div
        className="absolute pointer-events-none flex flex-col items-center select-none"
        style={{
          left: `${tree.x}px`,
          top: `${tree.y}px`,
          transform: `translate(-50%, -50%) scale(${tree.sizeVariant})`,
          zIndex: Math.round(tree.y),
        }}
      >
        <div className="relative w-16 h-12 flex items-center justify-center">
          <svg viewBox="0 0 64 48" className="w-full h-full drop-shadow-md">
            <path
              d="M 12 28 C 12 22 20 20 32 20 C 44 20 52 22 52 28 L 54 44 C 54 46 44 48 32 48 C 20 48 10 46 10 44 Z"
              fill={def.barkColor}
            />
            <ellipse cx="32" cy="22" rx="20" ry="8" fill="#d97706" />
            <ellipse cx="32" cy="22" rx="15" ry="5.5" fill="#f59e0b" opacity="0.8" />
            <ellipse cx="32" cy="22" rx="10" ry="3.5" fill="none" stroke="#78350f" strokeWidth="1" />
            <ellipse cx="32" cy="22" rx="5" ry="2" fill="none" stroke="#78350f" strokeWidth="1" />
            <circle cx="32" cy="22" r="1.5" fill="#78350f" />
          </svg>

          {/* Regrowth progress */}
          <div className="absolute -top-5 flex flex-col items-center">
            <div className="w-10 h-1.5 bg-stone-900/90 rounded-full overflow-hidden border border-stone-600">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${tree.regrowProgress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-semibold drop-shadow">
              {Math.round(tree.regrowProgress)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute pointer-events-none flex flex-col items-center select-none"
      style={{
        left: `${tree.x}px`,
        top: `${tree.y}px`,
        transform: 'translate(-50%, -75%)',
        zIndex: Math.round(tree.y),
      }}
    >
      {/* Locked badge or HP bar */}
      {!isUnlocked ? (
        <div className="mb-1 flex items-center gap-1 bg-stone-950/85 px-2 py-0.5 rounded-full border border-amber-500/50 text-[10px] text-amber-300 font-semibold shadow pointer-events-none z-20">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>{def.unlockGoldCost} Gold</span>
        </div>
      ) : (
        (isHovered || tree.currentHp < tree.maxHp) &&
        tree.state === 'standing' && (
          <div className="mb-1 flex flex-col items-center pointer-events-none transition-opacity z-20">
            <div className="w-16 h-2 bg-stone-900/90 rounded-full overflow-hidden border border-stone-700/80 p-0.5 shadow-sm">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  hpPercent > 50
                    ? 'bg-emerald-500'
                    : hpPercent > 25
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-stone-200 drop-shadow font-semibold">
              {tree.currentHp} / {tree.maxHp} HP
            </span>
          </div>
        )
      )}

      {/* Tree Physical Model (Separated so animations pivot from roots) */}
      <div
        className={`relative flex flex-col items-center transition-all ${
          tree.shake ? 'animate-tree-impact' : ''
        } ${
          tree.state === 'falling' ? 'animate-tree-topple' : ''
        } ${!isUnlocked ? 'opacity-80' : ''}`}
        style={{
          transformOrigin: '50% 95%',
          transform: `scale(${tree.sizeVariant * (isHovered ? 1.08 : 1)})`,
        }}
      >
        {/* Flying Wood Chip Particles Burst on Axe Strike */}
        {tree.shake && tree.state === 'standing' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-30">
            <div className="animate-chip-1 absolute w-2.5 h-1.5 rounded-sm bg-amber-300 shadow-sm" />
            <div className="animate-chip-2 absolute w-2.5 h-2 rounded-sm bg-amber-600 shadow-sm" />
            <div className="animate-chip-3 absolute w-2 h-1.5 rounded-sm bg-amber-400 shadow-sm" />
            <div className="animate-chip-4 absolute w-3 h-2 rounded-sm bg-amber-700 shadow-sm" />
            <div className="animate-slash-flash absolute -inset-6 bg-amber-200/50 rounded-full blur-sm" />
          </div>
        )}

        {/* Stylized Tree SVG */}
        <div className="relative w-24 h-32 sm:w-28 sm:h-36">
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/25 rounded-full blur-[2px]" />

          {tree.woodType === 'pine' && (
            <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md">
              <path d="M 46 80 L 44 124 C 44 126 56 126 56 124 L 54 80 Z" fill="#78350f" />
              <path d="M 48 80 L 46 124 L 50 124 L 52 80 Z" fill="#451a03" opacity="0.3" />
              <path d="M 50 45 L 82 85 C 80 88 20 88 18 85 Z" fill="#15803d" />
              <path d="M 50 45 L 50 87 C 40 87 22 86 18 85 Z" fill="#166534" />
              <path d="M 50 25 L 75 60 C 73 63 27 63 25 60 Z" fill="#16a34a" />
              <path d="M 50 25 L 50 62 C 40 62 28 61 25 60 Z" fill="#15803d" />
              <path d="M 50 6 L 68 38 C 66 41 34 41 32 38 Z" fill="#22c55e" />
              <path d="M 50 6 L 50 40 C 42 40 35 39 32 38 Z" fill="#16a34a" />
            </svg>
          )}

          {tree.woodType === 'oak' && (
            <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md">
              <path d="M 42 65 Q 40 95 34 124 C 34 126 66 126 66 124 Q 60 95 58 65 Z" fill="#451a03" />
              <circle cx="50" cy="50" r="32" fill="#14532d" />
              <circle cx="34" cy="46" r="22" fill="#166534" />
              <circle cx="66" cy="46" r="22" fill="#15803d" />
              <circle cx="48" cy="30" r="24" fill="#22c55e" />
              <circle cx="36" cy="34" r="16" fill="#4ade80" opacity="0.6" />
              <circle cx="62" cy="55" r="3" fill="#ca8a04" />
              <circle cx="38" cy="58" r="3" fill="#ca8a04" />
            </svg>
          )}

          {tree.woodType === 'birch' && (
            <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md">
              <path d="M 47 50 L 45 124 C 45 126 55 126 55 124 L 53 50 Z" fill="#f8fafc" />
              <line x1="46" y1="65" x2="51" y2="65" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="49" y1="80" x2="54" y2="80" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="45" y1="95" x2="50" y2="95" stroke="#1e293b" strokeWidth="2" />
              <line x1="48" y1="110" x2="54" y2="110" stroke="#1e293b" strokeWidth="1.5" />
              <ellipse cx="50" cy="42" rx="28" ry="34" fill="#65a30d" />
              <ellipse cx="44" cy="38" rx="20" ry="24" fill="#84cc16" />
              <ellipse cx="56" cy="45" rx="18" ry="22" fill="#4d7c0f" />
              <ellipse cx="50" cy="24" rx="14" ry="16" fill="#a3e635" />
            </svg>
          )}

          {tree.woodType === 'redwood' && (
            <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-lg">
              <path d="M 38 40 L 32 125 C 32 127 68 127 68 125 L 62 40 Z" fill="#7f1d1d" />
              <path d="M 50 35 L 85 70 C 80 73 20 73 15 70 Z" fill="#064e3b" />
              <path d="M 50 20 L 78 50 C 74 53 26 53 22 50 Z" fill="#047857" />
              <path d="M 50 6 L 68 32 C 65 34 35 34 32 32 Z" fill="#059669" />
            </svg>
          )}

          {tree.woodType === 'ironwood' && (
            <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-lg">
              <defs>
                <radialGradient id={`ironGlow_${tree.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="42" fill={`url(#ironGlow_${tree.id})`} />
              <path d="M 43 55 L 39 124 C 39 126 61 126 61 124 L 57 55 Z" fill="#1e1b4b" />
              <path d="M 50 15 Q 85 40 65 75 Q 50 90 35 75 Q 15 40 50 15 Z" fill="#4c1d95" />
              <circle cx="50" cy="45" r="26" fill="#6b21a8" />
              <circle cx="44" cy="38" r="16" fill="#9333ea" opacity="0.7" />
              <circle cx="56" cy="42" r="12" fill="#c084fc" opacity="0.8" />
              <circle cx="34" cy="30" r="2" fill="#f3e8ff" className="animate-pulse" />
              <circle cx="66" cy="36" r="2.5" fill="#f3e8ff" className="animate-pulse" />
            </svg>
          )}

          {isHovered && tree.state === 'standing' && (
            <div className="absolute inset-0 rounded-full border-2 border-amber-300/60 pointer-events-none animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

const generateInitialMonsters = (): AnimalMonster[] => [
  {
    id: 'boar_1',
    type: 'wild_boar',
    x: 960,
    y: 1040,
    spawnX: 960,
    spawnY: 1040,
    currentHp: ANIMAL_DEFINITIONS.wild_boar.maxHp,
    maxHp: ANIMAL_DEFINITIONS.wild_boar.maxHp,
    facing: 'left',
    state: 'patrolling',
    isAggro: false,
    lastAttackTime: 0,
    isHit: false,
    patrolTargetX: 1000,
    patrolTargetY: 1100,
  },
  {
    id: 'boar_2',
    type: 'wild_boar',
    x: 1640,
    y: 760,
    spawnX: 1640,
    spawnY: 760,
    currentHp: ANIMAL_DEFINITIONS.wild_boar.maxHp,
    maxHp: ANIMAL_DEFINITIONS.wild_boar.maxHp,
    facing: 'right',
    state: 'patrolling',
    isAggro: false,
    lastAttackTime: 0,
    isHit: false,
    patrolTargetX: 1700,
    patrolTargetY: 820,
  },
  {
    id: 'wolf_1',
    type: 'dire_wolf',
    x: 3040,
    y: 880,
    spawnX: 3040,
    spawnY: 880,
    currentHp: ANIMAL_DEFINITIONS.dire_wolf.maxHp,
    maxHp: ANIMAL_DEFINITIONS.dire_wolf.maxHp,
    facing: 'left',
    state: 'patrolling',
    isAggro: false,
    lastAttackTime: 0,
    isHit: false,
    patrolTargetX: 3120,
    patrolTargetY: 920,
  },
  {
    id: 'wolf_2',
    type: 'dire_wolf',
    x: 4040,
    y: 980,
    spawnX: 4040,
    spawnY: 980,
    currentHp: ANIMAL_DEFINITIONS.dire_wolf.maxHp,
    maxHp: ANIMAL_DEFINITIONS.dire_wolf.maxHp,
    facing: 'right',
    state: 'patrolling',
    isAggro: false,
    lastAttackTime: 0,
    isHit: false,
    patrolTargetX: 4120,
    patrolTargetY: 1040,
  },
  {
    id: 'bear_1',
    type: 'grizzly_bear',
    x: 4240,
    y: 2720,
    spawnX: 4240,
    spawnY: 2720,
    currentHp: ANIMAL_DEFINITIONS.grizzly_bear.maxHp,
    maxHp: ANIMAL_DEFINITIONS.grizzly_bear.maxHp,
    facing: 'left',
    state: 'patrolling',
    isAggro: false,
    lastAttackTime: 0,
    isHit: false,
    patrolTargetX: 4320,
    patrolTargetY: 2800,
  },
  {
    id: 'bear_2',
    type: 'grizzly_bear',
    x: 3750,
    y: 2950,
    spawnX: 3750,
    spawnY: 2950,
    currentHp: ANIMAL_DEFINITIONS.grizzly_bear.maxHp,
    maxHp: ANIMAL_DEFINITIONS.grizzly_bear.maxHp,
    facing: 'right',
    state: 'patrolling',
    isAggro: false,
    lastAttackTime: 0,
    isHit: false,
    patrolTargetX: 3820,
    patrolTargetY: 3000,
  },
  {
    id: 'drake_1',
    type: 'shadow_drake',
    x: 1160,
    y: 2720,
    spawnX: 1160,
    spawnY: 2720,
    currentHp: ANIMAL_DEFINITIONS.shadow_drake.maxHp,
    maxHp: ANIMAL_DEFINITIONS.shadow_drake.maxHp,
    facing: 'right',
    state: 'patrolling',
    isAggro: false,
    lastAttackTime: 0,
    isHit: false,
    patrolTargetX: 1240,
    patrolTargetY: 2800,
  },
  {
    id: 'drake_2',
    type: 'shadow_drake',
    x: 1550,
    y: 2900,
    spawnX: 1550,
    spawnY: 2900,
    currentHp: ANIMAL_DEFINITIONS.shadow_drake.maxHp,
    maxHp: ANIMAL_DEFINITIONS.shadow_drake.maxHp,
    facing: 'left',
    state: 'patrolling',
    isAggro: false,
    lastAttackTime: 0,
    isHit: false,
    patrolTargetX: 1600,
    patrolTargetY: 2980,
  },
];

export const InteractiveForest: React.FC<{
  onOpenModal?: (type: 'wood' | 'planks' | 'sawmill' | 'gold' | 'weapon' | 'forge') => void;
  onOpenHomestead?: () => void;
}> = ({ onOpenModal, onOpenHomestead }) => {
  const {
    trees,
    chopTree,
    unlockedWoodTypes,
    unlockTreeTypeWithGold,
    resources,
    particles,
    hiredWorkers,
    houseLevel,
    currentTool,
    weaponUpgradeLevel,
    weaponBonusDamage,
    playerHp,
    maxPlayerHp,
    isPlayerHit,
    deathNotification,
    clearDeathNotification,
    damagePlayer,
    defeatMonster,
    obstacles,
  } = useGame();

  const containerRef = useRef<HTMLDivElement>(null);

  // Wild Animal Monsters state
  const [monsters, setMonsters] = useState<AnimalMonster[]>(() => generateInitialMonsters());
  const monstersRef = useRef<AnimalMonster[]>(monsters);

  useEffect(() => {
    monstersRef.current = monsters;
  }, [monsters]);

  // Zoom & Pan state (default slightly zoomed so the expanded world is easy to navigate)
  const [scale, setScale] = useState<number>(0.75);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: -1600, y: -1050 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [isSmoothAnimating, setIsSmoothAnimating] = useState<boolean>(false);

  // Player Character state (Centered in settlement clearing at x: 2600, y: 1980)
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 2600, y: 1980 });
  const [playerFacing, setPlayerFacing] = useState<'left' | 'right'>('right');
  const [isPlayerMoving, setIsPlayerMoving] = useState<boolean>(false);
  const [isPlayerChopping, setIsPlayerChopping] = useState<boolean>(false);
  const joystickVectorRef = useRef<JoystickVector>({ x: 0, y: 0, angle: 0, distance: 0, active: false });
  const playerPosRef = useRef<{ x: number; y: number }>({ x: 2600, y: 1980 });

  // Drag physics & touch tracking (mobile phone grade)
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStartRef = useRef<{ clientX: number; clientY: number; offsetX: number; offsetY: number; time: number }>({
    clientX: 0,
    clientY: 0,
    offsetX: 0,
    offsetY: 0,
    time: 0,
  });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const animFrameRef = useRef<number | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(0.85);

  const [hoveredTreeId, setHoveredTreeId] = useState<string | null>(null);
  const [treeToUnlock, setTreeToUnlock] = useState<WoodType | null>(null);

  // Centers camera strictly on player position so character stays in the center of the screen
  const centerCameraOnPlayer = useCallback(
    (targetPos = playerPosRef.current, currentScale = scale) => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setOffset({
        x: clientWidth / 2 - targetPos.x * currentScale,
        y: clientHeight / 2 - targetPos.y * currentScale,
      });
    },
    [scale]
  );

  // Continuous 60fps loop for Joystick movement & Camera following
  useEffect(() => {
    let reqId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      const vec = joystickVectorRef.current;
      if (vec.active && vec.distance > 0.05) {
        setIsPlayerMoving(true);
        let speed = 280; // pixels per second

        const cur = playerPosRef.current;

        // Check if player is in thorny bramble thickets (slows movement)
        for (const obs of obstacles) {
          if (obs.type === 'bramble') {
            if (Math.hypot(cur.x - obs.x, cur.y - obs.y) < obs.radius + 12) {
              speed *= 0.55; // 45% speed penalty in thorny bushes!
              break;
            }
          }
        }

        const moveDist = speed * vec.distance * dt;
        let moveX = vec.x * moveDist;
        let moveY = vec.y * moveDist;

        // Solid obstacle collision check (boulder, fallen log, monolith)
        for (const obs of obstacles) {
          if (obs.type !== 'bramble') {
            const collR = (obs.radius || 35) + 16;
            if (Math.hypot(cur.x + moveX - obs.x, cur.y - obs.y) < collR) {
              moveX = 0;
            }
            if (Math.hypot(cur.x - obs.x, cur.y + moveY - obs.y) < collR) {
              moveY = 0;
            }
          }
        }

        if (Math.abs(vec.x) > 0.05) {
          setPlayerFacing(vec.x < 0 ? 'left' : 'right');
        }

        const nextX = Math.max(90, Math.min(WORLD_WIDTH - 90, cur.x + moveX));
        const nextY = Math.max(90, Math.min(WORLD_HEIGHT - 90, cur.y + moveY));
        playerPosRef.current = { x: nextX, y: nextY };
        setPlayerPos({ x: nextX, y: nextY });

        // Update camera: Character stays strictly in the center of the screen, map moves!
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          setOffset({
            x: clientWidth / 2 - nextX * scale,
            y: clientHeight / 2 - nextY * scale,
          });
        }
      } else {
        setIsPlayerMoving(false);
      }

      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqId);
  }, [scale]);

  // Center camera on player on mount and on resize
  useEffect(() => {
    centerCameraOnPlayer();
    const handleResize = () => centerCameraOnPlayer();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [centerCameraOnPlayer]);

  // Clamp offset to keep map in view during manual pan
  const clampOffset = useCallback(
    (nextOffset: { x: number; y: number }, currentScale = scale) => {
      if (!containerRef.current) return nextOffset;
      const { clientWidth, clientHeight } = containerRef.current;
      const minX = clientWidth - WORLD_WIDTH * currentScale - 100;
      const maxX = 100;
      const minY = clientHeight - WORLD_HEIGHT * currentScale - 100;
      const maxY = 100;

      return {
        x: Math.min(maxX, Math.max(minX, nextOffset.x)),
        y: Math.min(maxY, Math.max(minY, nextOffset.y)),
      };
    },
    [scale]
  );

  // Zoom In / Out handlers keeping player centered
  const handleZoom = useCallback(
    (delta: number) => {
      setScale((prevScale) => {
        const nextScale = Math.min(1.8, Math.max(0.42, prevScale + delta));
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          setOffset({
            x: clientWidth / 2 - playerPosRef.current.x * nextScale,
            y: clientHeight / 2 - playerPosRef.current.y * nextScale,
          });
        }
        return nextScale;
      });
    },
    []
  );

  // Wheel Zoom listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.09 : -0.09;
      handleZoom(delta);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleZoom]);

  // Clean up momentum animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // POINTER DOWN: Captures touch or mouse like a phone
  const handlePointerDown = (e: React.PointerEvent) => {
    // If user clicked directly on an interactive button or building, let native click proceed!
    const targetEl = e.target as HTMLElement | null;
    if (targetEl?.closest('button, [data-interactive="true"]')) {
      return;
    }

    // Stop any ongoing inertia scroll
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsSmoothAnimating(false);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1) {
      setIsPanning(true);
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        offsetX: offset.x,
        offsetY: offset.y,
        time: performance.now(),
      };
      velocityRef.current = { vx: 0, vy: 0 };
    } else if (pointersRef.current.size === 2) {
      // Two-finger pinch to zoom on phones!
      const pts = Array.from(pointersRef.current.values());
      pinchStartDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartScaleRef.current = scale;
    }
  };

  // POINTER MOVE: 1:1 Instant Tracking like iOS / Android touch
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Handle 2-finger pinch zoom
    if (pointersRef.current.size === 2 && pinchStartDistRef.current && containerRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const factor = currentDist / pinchStartDistRef.current;
      const nextScale = Math.min(1.8, Math.max(0.42, pinchStartScaleRef.current * factor));

      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const rect = containerRef.current.getBoundingClientRect();
      const originX = midX - rect.left;
      const originY = midY - rect.top;

      setScale(nextScale);
      setOffset((prev) => {
        const scaleRatio = nextScale / scale;
        const newOffset = {
          x: originX - (originX - prev.x) * scaleRatio,
          y: originY - (originY - prev.y) * scaleRatio,
        };
        return clampOffset(newOffset, nextScale);
      });
      return;
    }

    // Handle 1-finger / mouse pan
    if (isPanning && pointersRef.current.size === 1) {
      const now = performance.now();
      const dt = Math.max(1, now - dragStartRef.current.time);
      const dx = e.clientX - dragStartRef.current.clientX;
      const dy = e.clientY - dragStartRef.current.clientY;

      const nextX = dragStartRef.current.offsetX + dx;
      const nextY = dragStartRef.current.offsetY + dy;

      setOffset(clampOffset({ x: nextX, y: nextY }));

      // Track velocity for phone-like flick/momentum
      velocityRef.current = {
        vx: (dx / dt) * 14,
        vy: (dy / dt) * 14,
      };
    }
  };

  // POINTER UP: Decides whether to chop or coast with inertia
  const handlePointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (pointersRef.current.size === 0) {
      setIsPanning(false);

      const dx = e.clientX - dragStartRef.current.clientX;
      const dy = e.clientY - dragStartRef.current.clientY;
      const distance = Math.hypot(dx, dy);

      // TAP DETECTION: If movement < 18px (accommodates mobile touch slop and quick taps)
      if (distance < 18) {
        // Convert screen coordinates to world coordinates
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const screenX = e.clientX - rect.left;
          const screenY = e.clientY - rect.top;

          const worldX = (screenX - offset.x) / scale;
          const worldY = (screenY - offset.y) / scale;

          // Check if tap hit the central settlement house (x: 2600, y: 1640)
          const distToHouse = Math.hypot(worldX - 2600, worldY - 1640);
          if (distToHouse < 130) {
            if (onOpenHomestead) onOpenHomestead();
            return;
          }

          // Check if tap hit Sawmill (x: 2310, y: 1890)
          const distToSawmill = Math.hypot(worldX - 2310, worldY - 1890);
          if (distToSawmill < 120) {
            if (onOpenModal) onOpenModal('sawmill');
            return;
          }

          // Check if tap hit Forge (x: 2890, y: 1890)
          const distToForge = Math.hypot(worldX - 2890, worldY - 1890);
          if (distToForge < 120) {
            if (onOpenModal) onOpenModal('forge');
            return;
          }

          // Check if tap hit any tree (radius 55px)
          let closestTree: TreeInstance | null = null;
          let minDist = 65;

          trees.forEach((t) => {
            const d = Math.hypot(worldX - t.x, worldY - t.y);
            if (d < minDist) {
              minDist = d;
              closestTree = t;
            }
          });

          if (closestTree) {
            const tree = closestTree as TreeInstance;
            if (!unlockedWoodTypes.includes(tree.woodType)) {
              setTreeToUnlock(tree.woodType);
            } else if (tree.state === 'standing') {
              chopTree(tree.id, { clientX: e.clientX, clientY: e.clientY });
            }
            return;
          }
        }
      }

      // MOMENTUM PHYSICS (FLICK INERTIA LIKE ON A PHONE)
      const speed = Math.hypot(velocityRef.current.vx, velocityRef.current.vy);
      if (speed > 1.0) {
        setIsSmoothAnimating(false);
        const friction = 0.93;

        const coast = () => {
          velocityRef.current.vx *= friction;
          velocityRef.current.vy *= friction;

          if (Math.hypot(velocityRef.current.vx, velocityRef.current.vy) > 0.15) {
            setOffset((prev) =>
              clampOffset({
                x: prev.x + velocityRef.current.vx,
                y: prev.y + velocityRef.current.vy,
              })
            );
            animFrameRef.current = requestAnimationFrame(coast);
          } else {
            animFrameRef.current = null;
          }
        };

        animFrameRef.current = requestAnimationFrame(coast);
      }
    } else if (pointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }
  };

  // Center camera on settlement camp smoothly
  const centerCamp = () => {
    if (containerRef.current) {
      setIsSmoothAnimating(true);
      const { clientWidth, clientHeight } = containerRef.current;
      const target = clampOffset({
        x: clientWidth / 2 - 2600 * scale,
        y: clientHeight / 2 - 1800 * scale,
      });
      setOffset(target);
      setTimeout(() => setIsSmoothAnimating(false), 350);
    }
  };

  // Minimap click to jump camera
  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    const targetWorldX = clickX * WORLD_WIDTH;
    const targetWorldY = clickY * WORLD_HEIGHT;

    if (containerRef.current) {
      setIsSmoothAnimating(true);
      const { clientWidth, clientHeight } = containerRef.current;
      const target = clampOffset({
        x: clientWidth / 2 - targetWorldX * scale,
        y: clientHeight / 2 - targetWorldY * scale,
      });
      setOffset(target);
      setTimeout(() => setIsSmoothAnimating(false), 350);
    }
  };

  // Continuous AI tick for Wild Monsters & Animal Attacks
  useEffect(() => {
    const aiInterval = setInterval(() => {
      const now = performance.now();
      const p = playerPosRef.current;

      // Safe camp boundary (Sanctuary where monsters cannot attack and will retreat)
      const inSafeCamp = p.x >= 2000 && p.x <= 3200 && p.y >= 1420 && p.y <= 2380;

      let monsterAttackToApply: { amount: number; name: string } | null = null;
      let changed = false;

      const currentList = monstersRef.current;
      const nextMonsters = currentList
        .map((m) => {
          if (m.state === 'dead') {
            const timer = (m.deathTimer || 0) + 1;
            if (timer > 20) {
              changed = true;
              return null; // Despawn dead monster
            }
            return { ...m, deathTimer: timer };
          }

          const def = ANIMAL_DEFINITIONS[m.type];
          const distToPlayer = Math.hypot(p.x - m.x, p.y - m.y);

          // 1. Aggro & Attack Logic
          if (!inSafeCamp && distToPlayer <= def.aggroRadius) {
            changed = true;
            if (!m.isAggro) {
              sound.playMonsterGrowl();
            }

            // In Attack Range: Strike Player
            if (distToPlayer <= def.attackRadius) {
              if (now - m.lastAttackTime > def.attackCooldownMs) {
                // Record the attack to apply outside the state updater
                monsterAttackToApply = { amount: def.attackPower, name: def.name };
                return {
                  ...m,
                  isAggro: true,
                  state: 'attacking' as const,
                  lastAttackTime: now,
                };
              }
              return { ...m, isAggro: true, state: 'attacking' as const };
            }

            // Move towards player
            const dx = p.x - m.x;
            const dy = p.y - m.y;
            const dist = Math.hypot(dx, dy) || 1;
            const step = def.speed * 0.06;

            return {
              ...m,
              isAggro: true,
              state: 'chasing' as const,
              facing: dx < 0 ? ('left' as const) : ('right' as const),
              x: m.x + (dx / dist) * step,
              y: m.y + (dy / dist) * step,
            };
          }

          // 2. Disengage & Return to territory if player escaped or is in safe camp
          if (m.isAggro && (distToPlayer > def.aggroRadius * 1.5 || inSafeCamp)) {
            changed = true;
            return {
              ...m,
              isAggro: false,
              state: 'patrolling' as const,
            };
          }

          // 3. Ambient patrol wandering near territory
          const distToPatrol = Math.hypot(m.patrolTargetX - m.x, m.patrolTargetY - m.y);
          if (distToPatrol < 10 || Math.random() < 0.02) {
            changed = true;
            const angle = Math.random() * Math.PI * 2;
            const wanderDist = 30 + Math.random() * 80;
            const newTargetX = Math.max(120, Math.min(WORLD_WIDTH - 120, m.spawnX + Math.cos(angle) * wanderDist));
            const newTargetY = Math.max(120, Math.min(WORLD_HEIGHT - 120, m.spawnY + Math.sin(angle) * wanderDist));
            return {
              ...m,
              state: 'patrolling' as const,
              patrolTargetX: newTargetX,
              patrolTargetY: newTargetY,
              facing: newTargetX < m.x ? ('left' as const) : ('right' as const),
            };
          } else if (m.state === 'patrolling') {
            changed = true;
            const dx = m.patrolTargetX - m.x;
            const dy = m.patrolTargetY - m.y;
            const d = Math.hypot(dx, dy) || 1;
            const step = def.speed * 0.32 * 0.06;
            return {
              ...m,
              x: m.x + (dx / d) * step,
              y: m.y + (dy / d) * step,
              facing: dx < 0 ? ('left' as const) : ('right' as const),
            };
          }

          return m;
        })
        .filter(Boolean) as AnimalMonster[];

      if (changed) {
        monstersRef.current = nextMonsters;
        setMonsters(nextMonsters);
      }

      // Execute damagePlayer OUTSIDE of setMonsters state updater!
      if (monsterAttackToApply) {
        const attack = monsterAttackToApply as { amount: number; name: string };
        const died = damagePlayer(attack.amount, attack.name);
        if (died) {
          playerPosRef.current = { x: 2600, y: 1980 };
          setPlayerPos({ x: 2600, y: 1980 });
          centerCameraOnPlayer({ x: 2600, y: 1980 });
          const cleared = monstersRef.current.map((m) => ({
            ...m,
            isAggro: false,
            state: 'patrolling' as const,
          }));
          monstersRef.current = cleared;
          setMonsters(cleared);
        }
      }
    }, 60);

    return () => clearInterval(aiInterval);
  }, [damagePlayer, centerCameraOnPlayer]);

  // Periodic Monster Spawning (Maintains 8-10 wild beasts across vast forest)
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      setMonsters((prev) => {
        const liveCount = prev.filter((m) => m.state !== 'dead').length;
        if (liveCount >= 10) return prev;

        const monsterTypes: AnimalMonsterType[] = ['wild_boar', 'dire_wolf', 'grizzly_bear', 'shadow_drake'];
        const chosenType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
        const def = ANIMAL_DEFINITIONS[chosenType];

        let spawnX = 1000;
        let spawnY = 1000;
        if (chosenType === 'wild_boar') {
          spawnX = 700 + Math.random() * 900;
          spawnY = 640 + Math.random() * 700;
        } else if (chosenType === 'dire_wolf') {
          spawnX = 2800 + Math.random() * 1200;
          spawnY = 600 + Math.random() * 650;
        } else if (chosenType === 'grizzly_bear') {
          spawnX = 3600 + Math.random() * 1000;
          spawnY = 2400 + Math.random() * 700;
        } else {
          spawnX = 800 + Math.random() * 1000;
          spawnY = 2500 + Math.random() * 700;
        }

        const newMonster: AnimalMonster = {
          id: `${chosenType}_${Date.now()}`,
          type: chosenType,
          x: spawnX,
          y: spawnY,
          spawnX,
          spawnY,
          currentHp: def.maxHp,
          maxHp: def.maxHp,
          facing: Math.random() > 0.5 ? 'left' : 'right',
          state: 'patrolling',
          isAggro: false,
          lastAttackTime: 0,
          isHit: false,
          patrolTargetX: spawnX + (Math.random() - 0.5) * 80,
          patrolTargetY: spawnY + (Math.random() - 0.5) * 80,
        };

        return [...prev, newMonster];
      });
    }, 10000);

    return () => clearInterval(spawnTimer);
  }, []);

  // Nearest wild monster within melee reach (85px)
  const nearestMonster = React.useMemo(() => {
    let closest: AnimalMonster | null = null;
    let minDist = 85;
    for (const m of monsters) {
      if (m.state !== 'dead') {
        const d = Math.hypot(m.x - playerPos.x, m.y - playerPos.y);
        if (d < minDist) {
          minDist = d;
          closest = m;
        }
      }
    }
    return closest;
  }, [monsters, playerPos]);

  // Attack Monster Handler
  const handleAttackMonster = useCallback(
    (monsterId: string) => {
      const target = monsters.find((m) => m.id === monsterId);
      if (!target || target.state === 'dead') return;

      setIsPlayerChopping(true);
      setTimeout(() => setIsPlayerChopping(false), 180);

      // Face monster
      if (Math.abs(target.x - playerPos.x) > 4) {
        setPlayerFacing(target.x < playerPos.x ? 'left' : 'right');
      }

      // Damage calculation (weapon + forge bonus + crit chance)
      const basePower = Math.max(8, currentTool.chopPower + weaponBonusDamage);
      const isCrit = Math.random() < currentTool.critChance;
      const damageDealt = isCrit ? Math.round(basePower * currentTool.critMultiplier) : basePower;

      sound.playMonsterHit();

      const newHp = Math.max(0, target.currentHp - damageDealt);
      const isDefeated = newHp === 0;

      // Defeated! User earns gold based on monster strength (invoked OUTSIDE setMonsters)
      if (isDefeated) {
        defeatMonster(target.type, target.x, target.y);
      }

      const dx = target.x - playerPos.x;
      const dy = target.y - playerPos.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pushDist = 28;

      setMonsters((prev) =>
        prev.map((m) => {
          if (m.id !== monsterId) return m;

          if (isDefeated) {
            return {
              ...m,
              currentHp: 0,
              state: 'dead' as const,
              isAggro: false,
              deathTimer: 0,
            };
          }

          return {
            ...m,
            currentHp: newHp,
            x: Math.max(90, Math.min(WORLD_WIDTH - 90, m.x + (dx / dist) * pushDist)),
            y: Math.max(90, Math.min(WORLD_HEIGHT - 90, m.y + (dy / dist) * pushDist)),
            isAggro: true,
            isHit: true,
          };
        })
      );

      setTimeout(() => {
        setMonsters((prev) => prev.map((m) => (m.id === monsterId ? { ...m, isHit: false } : m)));
      }, 200);
    },
    [monsters, playerPos, currentTool, weaponBonusDamage, defeatMonster]
  );

  // AUTOMATIC COMBAT: When standing near a wild beast, auto-strike with axe!
  const lastAutoAttackRef = useRef<number>(0);
  useEffect(() => {
    if (!nearestMonster || nearestMonster.state === 'dead') return;

    if (Math.abs(nearestMonster.x - playerPos.x) > 4) {
      setPlayerFacing(nearestMonster.x < playerPos.x ? 'left' : 'right');
    }

    const attackCadenceMs = Math.max(260, 460 - currentTool.tier * 30);
    const now = performance.now();
    if (now - lastAutoAttackRef.current > attackCadenceMs * 0.6) {
      lastAutoAttackRef.current = now;
      handleAttackMonster(nearestMonster.id);
    }

    const interval = setInterval(() => {
      lastAutoAttackRef.current = performance.now();
      handleAttackMonster(nearestMonster.id);
    }, attackCadenceMs);

    return () => clearInterval(interval);
  }, [nearestMonster, currentTool.tier, handleAttackMonster, playerPos.x]);

  // Proximity to trees (within 88px of player)
  const nearestTree = React.useMemo(() => {
    let closest: TreeInstance | null = null;
    let minDist = 88;
    for (const t of trees) {
      if (t.state === 'standing') {
        const d = Math.hypot(t.x - playerPos.x, t.y - playerPos.y);
        if (d < minDist) {
          minDist = d;
          closest = t;
        }
      }
    }
    return closest;
  }, [trees, playerPos]);

  // AUTOMATIC CHOPPING: Whenever player is standing near an unlocked standing tree, chop it automatically!
  const lastAutoChopRef = useRef<number>(0);

  useEffect(() => {
    // If fighting a monster nearby, prioritize fighting!
    if (nearestMonster) return;
    if (!nearestTree || nearestTree.state !== 'standing') return;
    if (!unlockedWoodTypes.includes(nearestTree.woodType)) return;

    // Face the tree being chopped
    if (Math.abs(nearestTree.x - playerPos.x) > 4) {
      setPlayerFacing(nearestTree.x < playerPos.x ? 'left' : 'right');
    }

    // Dynamic cadence based on tool tier (400ms down to 240ms)
    const chopCadenceMs = Math.max(240, 420 - currentTool.tier * 35);

    // Initial immediate chop upon walking in range
    const now = performance.now();
    if (now - lastAutoChopRef.current > chopCadenceMs * 0.6) {
      lastAutoChopRef.current = now;
      setIsPlayerChopping(true);
      setTimeout(() => setIsPlayerChopping(false), 160);
      chopTree(nearestTree.id);
    }

    // Continuous rhythmic auto-chopping loop while in range
    const interval = setInterval(() => {
      lastAutoChopRef.current = performance.now();
      setIsPlayerChopping(true);
      setTimeout(() => setIsPlayerChopping(false), 160);
      chopTree(nearestTree.id);
    }, chopCadenceMs);

    return () => clearInterval(interval);
  }, [nearestTree, nearestMonster, unlockedWoodTypes, currentTool.tier, chopTree, playerPos.x]);

  // Proximity to buildings (settlement clearing centered at x: 2600, y: 1800)
  const isNearHouse = Math.hypot(playerPos.x - 2600, playerPos.y - 1640) < 130;
  const isNearSawmill = Math.hypot(playerPos.x - 2310, playerPos.y - 1890) < 130;
  const isNearForge = Math.hypot(playerPos.x - 2890, playerPos.y - 1890) < 130;

  // Execute manual/turbo action (attack monster, chop tree, or interact with building)
  const handlePlayerAction = useCallback(() => {
    if (nearestMonster) {
      handleAttackMonster(nearestMonster.id);
    } else if (nearestTree) {
      setIsPlayerChopping(true);
      setTimeout(() => setIsPlayerChopping(false), 200);

      if (!unlockedWoodTypes.includes(nearestTree.woodType)) {
        setTreeToUnlock(nearestTree.woodType);
      } else {
        // Manual burst hit
        chopTree(nearestTree.id);
      }
    } else if (isNearHouse) {
      if (onOpenHomestead) onOpenHomestead();
    } else if (isNearSawmill) {
      if (onOpenModal) onOpenModal('sawmill');
    } else if (isNearForge) {
      if (onOpenModal) onOpenModal('forge');
    }
  }, [
    nearestMonster,
    handleAttackMonster,
    nearestTree,
    isNearHouse,
    isNearSawmill,
    isNearForge,
    unlockedWoodTypes,
    chopTree,
    onOpenHomestead,
    onOpenModal,
  ]);

  // Keyboard Space key triggers chop / action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
        e.preventDefault();
        handlePlayerAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayerAction]);

  const currentHouse = HOUSE_STAGES[houseLevel] || HOUSE_STAGES[0];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-stone-950 touch-none"
    >
      {/* WORLD CANVAS LAYER */}
      <div
        style={{
          width: `${WORLD_WIDTH}px`,
          height: `${WORLD_HEIGHT}px`,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
        className={`absolute top-0 left-0 ${
          isSmoothAnimating ? 'transition-transform duration-300 ease-out' : 'transition-none'
        }`}
      >
        {/* Terrain Background with Biome Zones */}
        <div className="absolute inset-0 bg-[#0c1a12]">
          {/* Subtle textured grid / field patterns */}
          <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="forestGrid" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="1.5" fill="#4ade80" />
                <path d="M 0 60 Q 60 40 120 60" fill="none" stroke="#22c55e" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#forestGrid)" />
          </svg>

          {/* Biome Zone 1: Whispering Pines (NW) */}
          <div
            className="absolute rounded-full blur-3xl opacity-35"
            style={{
              left: '200px',
              top: '200px',
              width: '800px',
              height: '700px',
              background: '#15803d',
            }}
          />

          {/* Biome Zone 2: Sturdy Oak Copse (North Center) */}
          <div
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              left: '950px',
              top: '150px',
              width: '850px',
              height: '650px',
              background: '#ca8a04',
            }}
          />

          {/* Biome Zone 3: Silver Birch Glade (NE) */}
          <div
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              left: '3400px',
              top: '400px',
              width: '1600px',
              height: '1400px',
              background: '#0284c7',
            }}
          />

          {/* Biome Zone 4: Mystic Ironwood Sanctum (SW) */}
          <div
            className="absolute rounded-full blur-3xl opacity-35"
            style={{
              left: '500px',
              top: '2100px',
              width: '1700px',
              height: '1400px',
              background: '#7e22ce',
            }}
          />

          {/* Biome Zone 5: Ancient Redwoods (SE) */}
          <div
            className="absolute rounded-full blur-3xl opacity-35"
            style={{
              left: '3300px',
              top: '2100px',
              width: '1700px',
              height: '1400px',
              background: '#b91c1c',
            }}
          />

          {/* Natural River curving from North to South across 5200x3600 map */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 3600 0 Q 3100 1000 3240 1800 T 2700 3600"
              fill="none"
              stroke="#0284c7"
              strokeWidth="90"
              strokeLinecap="round"
            />
            <path
              d="M 3600 0 Q 3100 1000 3240 1800 T 2700 3600"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="40"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>

          {/* Biome Territory Signposts */}
          <div className="absolute left-[1040px] top-[520px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-emerald-400 bg-stone-950/80 px-3 py-1 rounded-full border border-emerald-700/50 shadow">
              🌲 Whispering Pines (Tier 1)
            </span>
          </div>

          <div className="absolute left-[2500px] top-[360px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-amber-300 bg-stone-950/80 px-3 py-1 rounded-full border border-amber-600/50 shadow">
              🌳 Sturdy Oak Copse (Tier 2)
            </span>
          </div>

          <div className="absolute left-[4000px] top-[500px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-sky-300 bg-stone-950/80 px-3 py-1 rounded-full border border-sky-600/50 shadow">
              🍃 Silver Birch Glade (Tier 3)
            </span>
          </div>

          <div className="absolute left-[3900px] top-[2120px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-rose-400 bg-stone-950/80 px-3 py-1 rounded-full border border-rose-700/50 shadow">
              🪵 Ancient Redwood Valley (Tier 4)
            </span>
          </div>

          <div className="absolute left-[960px] top-[2120px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-purple-400 bg-stone-950/80 px-3 py-1 rounded-full border border-purple-700/50 shadow">
              🔮 Mystic Ironwood Sanctum (Tier 5)
            </span>
          </div>

          {/* Central Settlement Clearing (Centered at x: 2600, y: 1800, compact 960x700 circle) */}
          <div
            className="absolute rounded-full border-4 border-amber-800/40 shadow-[0_0_80px_rgba(0,0,0,0.6)_inset]"
            style={{
              left: '2120px',
              top: '1450px',
              width: '960px',
              height: '700px',
              background: 'radial-gradient(ellipse at center, #2e2824 0%, #1e1b18 70%, transparent 100%)',
            }}
          >
            {/* Settlement Cobblestone Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 960 700">
              {/* Main paths linking House, Sawmill, Forge, and Gates */}
              <path d="M 480 200 L 220 440 M 480 200 L 740 440 M 220 440 L 740 440" stroke="#78716c" strokeWidth="22" strokeLinecap="round" strokeDasharray="14,7" fill="none" />
              <path d="M 480 200 L 480 640" stroke="#78716c" strokeWidth="18" strokeLinecap="round" strokeDasharray="12,6" fill="none" />
              {/* Stepping stones to Well and Cart */}
              <path d="M 480 340 L 330 270 M 480 500 L 480 610" stroke="#a8a29e" strokeWidth="12" strokeLinecap="round" strokeDasharray="6,8" fill="none" />
            </svg>

            {/* 1. Stone Well & Wooden Bucket (North-West) */}
            <div
              className="absolute left-[34%] top-[38%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group"
              title="Settlement Spring Well: Pure freshwater for the village"
            >
              <div className="w-14 h-16 relative flex items-center justify-center filter drop-shadow-md group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 48 56" className="w-full h-full">
                  {/* Well Stone Rim base */}
                  <ellipse cx="24" cy="44" rx="18" ry="8" fill="#44403c" stroke="#292524" strokeWidth="2" />
                  <rect x="8" y="36" width="32" height="9" fill="#57534e" stroke="#292524" strokeWidth="1.5" />
                  {/* Shimmering well water */}
                  <ellipse cx="24" cy="38" rx="14" ry="5" fill="#0284c7" />
                  <ellipse cx="24" cy="38" rx="10" ry="3" fill="#38bdf8" opacity="0.6" />
                  {/* Wooden Support Posts */}
                  <rect x="10" y="16" width="3" height="24" fill="#78350f" />
                  <rect x="35" y="16" width="3" height="24" fill="#78350f" />
                  {/* Winch Axle & Rope */}
                  <line x1="12" y1="22" x2="36" y2="22" stroke="#451a03" strokeWidth="3" />
                  <rect x="22" y="21" width="4" height="12" fill="#ca8a04" />
                  {/* Hanging Bucket */}
                  <polygon points="21,31 27,31 26,37 22,37" fill="#854d0e" stroke="#451a03" strokeWidth="1" />
                  {/* Well Thatched/Tiled Roof */}
                  <polygon points="24,4 5,18 43,18" fill="#a16207" stroke="#451a03" strokeWidth="1.5" />
                  <polygon points="24,6 9,17 39,17" fill="#ca8a04" />
                </svg>
              </div>
              <span className="text-[8px] font-semibold text-amber-200/90 bg-stone-950/80 px-1.5 py-0.5 rounded border border-stone-700/60 shadow pointer-events-none">
                Fresh Well
              </span>
            </div>

            {/* 2. Lumberjack Log Stack / Wood Yard (West perimeter) */}
            <div
              className="absolute left-[10%] top-[38%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none select-none"
              title="Timber Log Stacks"
            >
              <div className="w-16 h-12 relative flex items-center justify-center filter drop-shadow">
                <svg viewBox="0 0 56 42" className="w-full h-full">
                  {/* Sawdust shavings ground pile */}
                  <ellipse cx="28" cy="36" rx="26" ry="6" fill="#ca8a04" opacity="0.4" />
                  {/* Bottom Log Tier */}
                  <rect x="4" y="26" width="48" height="8" rx="3" fill="#854d0e" stroke="#451a03" strokeWidth="1.2" />
                  <ellipse cx="50" cy="30" rx="3" ry="4" fill="#d97706" />
                  <ellipse cx="50" cy="30" rx="1.5" ry="2" fill="#92400e" />
                  {/* Middle Log Tier */}
                  <rect x="10" y="19" width="38" height="8" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />
                  <ellipse cx="46" cy="23" rx="3" ry="4" fill="#f59e0b" />
                  <ellipse cx="46" cy="23" rx="1.5" ry="2" fill="#92400e" />
                  {/* Top Log Tier */}
                  <rect x="16" y="12" width="26" height="8" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
                  <ellipse cx="40" cy="16" rx="3" ry="4" fill="#d97706" />
                  {/* Binding Rope Strap */}
                  <line x1="22" y1="11" x2="22" y2="35" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3,1" />
                  <line x1="32" y1="11" x2="32" y2="35" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3,1" />
                </svg>
              </div>
              <span className="text-[8px] font-semibold text-stone-300 bg-stone-950/70 px-1.5 py-0.5 rounded border border-stone-800">
                Log Stacks
              </span>
            </div>

            {/* 3. Blacksmith Weapon Stand & Heavy Anvil (East perimeter) */}
            <div
              className="absolute left-[90%] top-[38%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none select-none"
              title="Blacksmith Anvil & Armory Stand"
            >
              <div className="w-16 h-14 relative flex items-center justify-center filter drop-shadow">
                <svg viewBox="0 0 54 46" className="w-full h-full">
                  {/* Heavy Iron Anvil on Tree Stump */}
                  <ellipse cx="18" cy="38" rx="12" ry="5" fill="#451a03" />
                  <rect x="10" y="28" width="16" height="11" fill="#78350f" stroke="#292524" strokeWidth="1" />
                  {/* Anvil Horn & Base */}
                  <path d="M 6 22 L 28 22 L 26 27 L 8 27 Z" fill="#64748b" stroke="#0f172a" strokeWidth="1.2" />
                  <polygon points="6,22 2,23 6,25" fill="#94a3b8" />
                  <rect x="12" y="27" width="10" height="4" fill="#334155" />
                  {/* Timber Weapon Rack */}
                  <rect x="36" y="10" width="3" height="30" fill="#78350f" stroke="#292524" strokeWidth="1" />
                  <rect x="48" y="10" width="3" height="30" fill="#78350f" stroke="#292524" strokeWidth="1" />
                  <line x1="34" y1="16" x2="50" y2="16" stroke="#451a03" strokeWidth="2" />
                  <line x1="34" y1="28" x2="50" y2="28" stroke="#451a03" strokeWidth="2" />
                  {/* Mounted Steel Axe on Rack */}
                  <line x1="37" y1="8" x2="47" y2="34" stroke="#ca8a04" strokeWidth="2" />
                  <polygon points="44,12 49,9 47,16" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />
                  {/* Round Bronze Shield on Rack */}
                  <circle cx="43" cy="24" r="6" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
                  <circle cx="43" cy="24" r="2" fill="#fef08a" />
                </svg>
              </div>
              <span className="text-[8px] font-semibold text-rose-300 bg-stone-950/70 px-1.5 py-0.5 rounded border border-rose-900/60">
                Armory Stand
              </span>
            </div>

            {/* 4. Wood Chopping Stump with Hatchet (West-Center) */}
            <div className="absolute left-[33%] top-[68%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full filter drop-shadow">
                  {/* Ground woodchips */}
                  <circle cx="8" cy="28" r="1.5" fill="#facc15" />
                  <circle cx="27" cy="29" r="1.2" fill="#ca8a04" />
                  <circle cx="12" cy="31" r="1" fill="#facc15" />
                  {/* Tree Stump */}
                  <ellipse cx="18" cy="24" rx="11" ry="6" fill="#573a08" stroke="#2e1d05" strokeWidth="1.2" />
                  <rect x="7" y="18" width="22" height="8" fill="#784b12" />
                  <ellipse cx="18" cy="18" rx="11" ry="5" fill="#b4782b" stroke="#452a06" strokeWidth="1" />
                  {/* Growth rings on stump */}
                  <ellipse cx="18" cy="18" rx="7" ry="3" fill="none" stroke="#784b12" strokeWidth="0.8" />
                  <ellipse cx="18" cy="18" rx="3" ry="1.5" fill="#452a06" />
                  {/* Embedded Iron Hatchet */}
                  <line x1="14" y1="4" x2="20" y2="16" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
                  <polygon points="18,14 24,12 21,18" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />
                </svg>
              </div>
            </div>

            {/* 5. Directional Wooden Signpost (South-East) */}
            <div className="absolute left-[67%] top-[72%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-12 h-14 relative">
                <svg viewBox="0 0 44 52" className="w-full h-full filter drop-shadow">
                  {/* Post */}
                  <rect x="20" y="10" width="4" height="40" fill="#78350f" stroke="#292524" strokeWidth="1" />
                  {/* Sign 1: Pine Forest (Left Arrow) */}
                  <polygon points="21,12 8,12 3,16 8,20 21,20" fill="#ca8a04" stroke="#451a03" strokeWidth="1" />
                  <line x1="7" y1="16" x2="17" y2="16" stroke="#451a03" strokeWidth="1" />
                  {/* Sign 2: Redwood Valley (Right Arrow) */}
                  <polygon points="23,22 36,22 41,26 36,30 23,30" fill="#b91c1c" stroke="#450a0a" strokeWidth="1" />
                  <line x1="27" y1="26" x2="37" y2="26" stroke="#fef2f2" strokeWidth="1" />
                  {/* Sign 3: Sanctum */}
                  <polygon points="21,32 9,32 4,36 9,40 21,40" fill="#7e22ce" stroke="#3b0764" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-[8px] font-bold text-amber-200 bg-stone-950/80 px-1 py-0.5 rounded border border-stone-800">
                Guidepost
              </span>
            </div>

            {/* 6. Merchant Supply Wagon / Cart (South entrance) */}
            <div
              className="absolute left-[50%] top-[88%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none select-none"
              title="Supply Wagon: Cargo crates and barrels"
            >
              <div className="w-20 h-14 relative filter drop-shadow-md">
                <svg viewBox="0 0 68 46" className="w-full h-full">
                  {/* Wagon Bed */}
                  <polygon points="8,18 60,18 56,30 12,30" fill="#854d0e" stroke="#451a03" strokeWidth="1.5" />
                  {/* Wooden Planks details on cart */}
                  <line x1="10" y1="22" x2="58" y2="22" stroke="#451a03" strokeWidth="1" />
                  <line x1="11" y1="26" x2="57" y2="26" stroke="#451a03" strokeWidth="1" />
                  {/* Cargo: Wooden Barrels */}
                  <ellipse cx="20" cy="14" rx="6" ry="7" fill="#a16207" stroke="#451a03" strokeWidth="1" />
                  <line x1="14" y1="14" x2="26" y2="14" stroke="#292524" strokeWidth="1" />
                  <ellipse cx="32" cy="13" rx="6" ry="8" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                  <line x1="26" y1="13" x2="38" y2="13" stroke="#292524" strokeWidth="1" />
                  {/* Cargo: Cloth Sack */}
                  <circle cx="44" cy="14" r="6" fill="#d6d3d1" stroke="#57534e" strokeWidth="1" />
                  {/* Two Wagon Wheels */}
                  <circle cx="18" cy="32" r="9" fill="none" stroke="#ca8a04" strokeWidth="2.5" />
                  <circle cx="18" cy="32" r="3" fill="#451a03" />
                  <line x1="9" y1="32" x2="27" y2="32" stroke="#78350f" strokeWidth="1.5" />
                  <line x1="18" y1="23" x2="18" y2="41" stroke="#78350f" strokeWidth="1.5" />
                  <circle cx="50" cy="32" r="9" fill="none" stroke="#ca8a04" strokeWidth="2.5" />
                  <circle cx="50" cy="32" r="3" fill="#451a03" />
                  <line x1="41" y1="32" x2="59" y2="32" stroke="#78350f" strokeWidth="1.5" />
                  <line x1="50" y1="23" x2="50" y2="41" stroke="#78350f" strokeWidth="1.5" />
                  {/* Front Cart Hitch Shaft */}
                  <line x1="60" y1="24" x2="67" y2="28" stroke="#78350f" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[8px] font-semibold text-stone-300 bg-stone-950/80 px-1.5 py-0.5 rounded border border-stone-800">
                Supply Cart
              </span>
            </div>

            {/* 7. Warm Glowing Lantern Posts at Gates (North, South, East, West) */}
            {[
              { x: '48%', y: '8%', name: 'North Post' },
              { x: '94%', y: '60%', name: 'East Post' },
              { x: '6%', y: '60%', name: 'West Post' },
              { x: '35%', y: '90%', name: 'South Post' },
            ].map((lp, idx) => (
              <div key={idx} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: lp.x, top: lp.y }}>
                <svg viewBox="0 0 24 38" className="w-6 h-9 filter drop-shadow">
                  {/* Timber post */}
                  <rect x="10" y="10" width="4" height="28" fill="#451a03" stroke="#1c1917" strokeWidth="1" />
                  <line x1="6" y1="12" x2="14" y2="8" stroke="#78350f" strokeWidth="2" />
                  {/* Hanging Lantern with glowing halo */}
                  <circle cx="6" cy="18" r="8" fill="#f59e0b" opacity="0.25" className="animate-pulse" />
                  <polygon points="4,14 8,14 9,20 3,20" fill="#fef08a" stroke="#292524" strokeWidth="1" />
                  <rect x="3" y="12" width="6" height="2" fill="#1c1917" />
                  <circle cx="6" cy="17" r="2.5" fill="#f97316" className="animate-ping" />
                </svg>
              </div>
            ))}

            {/* 8. Central Campfire & Gathering Hearth (Valid SVG, no invalid HTML tags) */}
            <div className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              {/* Curved Log Benches for workers to rest */}
              <div className="absolute -left-12 top-2 w-7 h-3 rounded-full bg-amber-900 border border-amber-950 -rotate-12 opacity-80" />
              <div className="absolute -right-12 top-2 w-7 h-3 rounded-full bg-amber-900 border border-amber-950 rotate-12 opacity-80" />

              <div className="relative w-16 h-12 flex items-center justify-center">
                <svg viewBox="0 0 64 48" className="w-full h-full overflow-visible">
                  {/* Soft Ground Ash Shadow */}
                  <ellipse cx="32" cy="34" rx="26" ry="10" fill="#1c1917" opacity="0.7" />
                  {/* Stone Hearth Ring */}
                  <ellipse cx="32" cy="32" rx="22" ry="9" fill="#44403c" stroke="#292524" strokeWidth="1.5" />
                  {/* Stone individual rocks in a ring */}
                  <circle cx="13" cy="32" r="3.5" fill="#78716c" />
                  <circle cx="19" cy="37" r="3.5" fill="#57534e" />
                  <circle cx="28" cy="39" r="4" fill="#78716c" />
                  <circle cx="38" cy="38" r="3.5" fill="#57534e" />
                  <circle cx="47" cy="35" r="3.5" fill="#78716c" />
                  <circle cx="50" cy="30" r="3.2" fill="#57534e" />
                  <circle cx="42" cy="26" r="3.5" fill="#78716c" />
                  <circle cx="32" cy="25" r="3" fill="#57534e" />
                  <circle cx="22" cy="26" r="3.5" fill="#78716c" />
                  {/* Glowing Coal Embers Bed */}
                  <ellipse cx="32" cy="32" rx="14" ry="5" fill="#7f1d1d" />
                  {/* Firewood Crossed Logs */}
                  <line x1="20" y1="36" x2="44" y2="28" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="20" y1="28" x2="44" y2="36" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Campfire Light Glow Ring */}
                  <circle cx="32" cy="24" r="18" fill="#f59e0b" opacity="0.25" className="animate-pulse" />
                  {/* Blazing Flame Tongue 1 (Red outer) */}
                  <polygon points="32,8 24,28 40,28" fill="#dc2626" />
                  {/* Blazing Flame Tongue 2 (Orange mid) */}
                  <polygon points="32,12 26,29 38,29" fill="#ea580c" className="animate-pulse" />
                  {/* Core Yellow/White Flame */}
                  <polygon points="32,18 28,30 36,30" fill="#fef08a" />
                  {/* Rising Smoke Particles */}
                  <circle cx="33" cy="11" r="3.5" fill="#a8a29e" opacity="0.45" />
                  <circle cx="35" cy="4" r="4.5" fill="#a8a29e" opacity="0.3" />
                </svg>
              </div>
              <span className="text-[9px] font-bold text-amber-300 bg-stone-950/85 px-2 py-0.5 rounded-full border border-amber-700/50 mt-0.5 shadow">
                Camp Hearth
              </span>
            </div>

            {/* 9. Settlement House Building (Center-North of clearing, top: 27%) */}
            <div
              data-interactive="true"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                if (onOpenHomestead) onOpenHomestead();
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenHomestead) onOpenHomestead();
              }}
              className="absolute left-1/2 top-[27%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group hover:scale-105 active:scale-95 transition-all z-20 pointer-events-auto"
            >
              {/* Progressive House Architectural Model */}
              <div className="relative w-48 h-40 sm:w-56 sm:h-44 flex items-center justify-center filter drop-shadow-2xl">
                <HouseBuildingVisual level={houseLevel} className="w-full h-full" isWorldMap />
                {/* Glow ring on hover */}
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/0 group-hover:border-amber-400/50 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all pointer-events-none" />
              </div>

              <div className="mt-0.5 bg-stone-950/95 px-3 py-1 rounded-lg border border-amber-600/60 shadow text-center backdrop-blur group-hover:border-amber-400">
                <span className="font-display font-bold text-xs text-amber-200 block whitespace-nowrap">
                  {currentHouse.name} (Lv.{houseLevel})
                </span>
                <span className="text-[10px] text-amber-400 font-semibold block whitespace-nowrap">
                  Tap to Upgrade House
                </span>
              </div>
            </div>

            {/* 10. Architectural Timber Sawmill Building (West Side, left: 20%, top: 63%) */}
            <div
              data-interactive="true"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                if (onOpenModal) onOpenModal('sawmill');
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenModal) onOpenModal('sawmill');
              }}
              className="absolute left-[20%] top-[63%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group hover:scale-105 active:scale-95 transition-all z-20 pointer-events-auto"
              title="Sawmill: Convert 10 Wood -> 1 Plank, Sell 10 Planks -> 1 Gold"
            >
              <div className="relative w-48 h-40 sm:w-56 sm:h-44 flex items-center justify-center filter drop-shadow-2xl">
                <SawmillBuildingVisual level={1} className="w-full h-full" isWorldMap />
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/0 group-hover:border-amber-400/50 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all pointer-events-none" />
              </div>

              <div className="mt-0.5 bg-stone-950/95 px-3 py-1 rounded-lg border border-amber-700/60 shadow text-center backdrop-blur group-hover:border-amber-400">
                <span className="font-display font-bold text-xs text-amber-200 block whitespace-nowrap">
                  ⚙️ Timber Sawmill
                </span>
                <span className="text-[10px] text-amber-400 font-semibold block whitespace-nowrap">
                  Tap: 10 Wood ➔ 1 Plank ➔ Gold
                </span>
              </div>
            </div>

            {/* 11. Architectural Blacksmith Forge Building (East Side, left: 80%, top: 63%) */}
            <div
              data-interactive="true"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                if (onOpenModal) onOpenModal('forge');
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenModal) onOpenModal('forge');
              }}
              className="absolute left-[80%] top-[63%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group hover:scale-105 active:scale-95 transition-all z-20 pointer-events-auto"
              title="Blacksmith Forge: Upgrade Weapon Damage (+2 DMG) for 10 Gold"
            >
              <div className="relative w-48 h-40 sm:w-56 sm:h-44 flex items-center justify-center filter drop-shadow-2xl">
                <ForgeBuildingVisual level={1} className="w-full h-full" isWorldMap />
                <div className="absolute inset-0 rounded-full border-2 border-rose-400/0 group-hover:border-rose-400/50 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all pointer-events-none" />
              </div>

              <div className="mt-0.5 bg-stone-950/95 px-3 py-1 rounded-lg border border-rose-700/60 shadow text-center backdrop-blur group-hover:border-rose-400">
                <span className="font-display font-bold text-xs text-rose-200 block whitespace-nowrap">
                  ⚒️ Blacksmith Forge
                </span>
                <span className="text-[10px] text-rose-400 font-semibold block whitespace-nowrap">
                  Tap: Sharpen Axes (+2 DMG)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Forest Obstacles (Boulders, Fallen Logs, Brambles, Monoliths) */}
        <ForestObstacles obstacles={obstacles} />

        {/* Trees scattered across all biomes */}
        {trees.map((tree) => {
          const isUnlocked = unlockedWoodTypes.includes(tree.woodType);
          return (
            <TreeGraphic
              key={tree.id}
              tree={tree}
              isUnlocked={isUnlocked}
              isHovered={hoveredTreeId === tree.id}
            />
          );
        })}

        {/* Wild Animals and Monsters roaming the forest */}
        {monsters.map((monster) => (
          <AnimalMonsterGraphic
            key={monster.id}
            monster={monster}
            onAttack={handleAttackMonster}
          />
        ))}

        {/* Dynamic Autonomous Moving Workers */}
        <MovingWorkers
          workers={hiredWorkers}
          trees={trees}
          unlockedWoodTypes={unlockedWoodTypes}
          onWorkerChop={(treeId, power) => {
            chopTree(treeId, undefined, true, power);
          }}
        />

        {/* Proximity Ring around Nearest Monster */}
        {nearestMonster && nearestMonster.state !== 'dead' && (
          <div
            className="absolute rounded-full border-2 border-red-500 bg-red-500/20 pointer-events-none animate-pulse"
            style={{
              left: `${nearestMonster.x}px`,
              top: `${nearestMonster.y}px`,
              width: '90px',
              height: '45px',
              transform: 'translate(-50%, -50%)',
              zIndex: Math.round(nearestMonster.y) - 1,
            }}
          />
        )}

        {/* Proximity Ring around Nearest Tree within reach */}
        {nearestTree && !nearestMonster && (
          <div
            className="absolute rounded-full border-2 border-amber-400 bg-amber-400/20 pointer-events-none animate-pulse"
            style={{
              left: `${nearestTree.x}px`,
              top: `${nearestTree.y}px`,
              width: '80px',
              height: '40px',
              transform: 'translate(-50%, -50%)',
              zIndex: Math.round(nearestTree.y) - 1,
            }}
          />
        )}

        {/* Player Character (Moves with joystick, stays centered, animated axe swing) */}
        <PlayerCharacter
          x={playerPos.x}
          y={playerPos.y}
          facing={playerFacing}
          isMoving={isPlayerMoving}
          isChopping={isPlayerChopping}
          currentTool={currentTool}
          weaponUpgradeLevel={weaponUpgradeLevel}
          currentHp={playerHp}
          maxHp={maxPlayerHp}
          isHit={isPlayerHit}
          nearTreeName={nearestTree && !nearestMonster ? `${WOOD_DEFINITIONS[nearestTree.woodType].name}` : null}
          nearMonsterName={nearestMonster && nearestMonster.state !== 'dead' ? ANIMAL_DEFINITIONS[nearestMonster.type].name : null}
        />

        {/* Floating Numbers / Hit Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className={`fixed pointer-events-none z-50 font-bold font-mono text-sm sm:text-base animate-float-text drop-shadow-lg ${
              p.isCrit ? 'text-amber-300 text-lg scale-110' : ''
            }`}
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              color: p.color,
            }}
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* OVERLAY CONTROLS */}

      {/* 1. Zoom and Recenter Camera Controls (Top Left) */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-800 shadow-xl pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoom(0.18);
          }}
          aria-label="Zoom in"
          title="Zoom in (+)"
          className="p-1.5 text-stone-300 hover:text-amber-300 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoom(-0.18);
          }}
          aria-label="Zoom out"
          title="Zoom out (-)"
          className="p-1.5 text-stone-300 hover:text-amber-300 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setScale(1.0);
            centerCameraOnPlayer(playerPos, 1.0);
          }}
          aria-label="Reset zoom to 100%"
          title="Reset zoom to 100%"
          className="px-2 py-1 text-xs font-mono font-semibold text-stone-300 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          {Math.round(scale * 100)}%
        </button>

        <div className="h-4 w-[1px] bg-stone-700 mx-0.5" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            centerCameraOnPlayer(playerPos);
          }}
          aria-label="Center Camera on Character"
          title="Center Camera on Character"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 rounded-lg border border-amber-600/40 transition-colors cursor-pointer shadow-sm active:scale-95"
        >
          <span>🎯</span>
          <span className="hidden sm:inline">Center</span>
        </button>

        <div className="h-4 w-[1px] bg-stone-700 mx-0.5" />

        {/* Player Health HUD */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-950/80 rounded-lg border border-stone-800">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <div className="w-14 sm:w-20 h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-700 flex items-center">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                playerHp / maxPlayerHp > 0.5
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : playerHp / maxPlayerHp > 0.25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
              }`}
              style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-stone-200 whitespace-nowrap">
            {playerHp}/{maxPlayerHp}
          </span>
        </div>
      </div>

      {/* 2. Centered Virtual Joystick (Bottom Center) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center">
        <VirtualJoystick
          onMove={(vec) => {
            joystickVectorRef.current = vec;
          }}
        />
        <span className="text-[10px] font-semibold text-stone-300 mt-1 bg-stone-950/85 px-2.5 py-0.5 rounded-full border border-stone-800 backdrop-blur pointer-events-none shadow whitespace-nowrap">
          WASD / Joystick to Move
        </span>
      </div>

      {/* 3. Action / CHOP / ATTACK Button (Bottom Right) */}
      <div className="absolute bottom-5 right-3 sm:right-6 z-30 pointer-events-auto flex flex-col items-end gap-2">
        <button
          onClick={handlePlayerAction}
          className={`flex items-center gap-2 p-2.5 sm:px-5 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-2xl transition-all cursor-pointer select-none active:scale-90 ${
            nearestMonster
              ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-2 border-red-300 shadow-red-600/50 animate-pulse scale-105'
              : nearestTree
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 border-2 border-amber-300 shadow-amber-500/50 animate-pulse scale-105'
              : isNearHouse
              ? 'bg-amber-900/90 hover:bg-amber-800 text-amber-200 border-2 border-amber-500/80 shadow-amber-900/50'
              : isNearSawmill
              ? 'bg-amber-800/90 hover:bg-amber-700 text-amber-200 border-2 border-amber-500/80'
              : isNearForge
              ? 'bg-rose-900/90 hover:bg-rose-800 text-rose-200 border-2 border-rose-500/80'
              : 'bg-stone-900/85 text-stone-300 border border-stone-700 hover:border-stone-500'
          }`}
          title="Attack beasts, chop trees, or interact with buildings (or press Space key)"
        >
          <span className="text-xl sm:text-2xl">
            {nearestMonster ? '⚔️' : nearestTree ? '🪓' : isNearHouse ? '🏡' : isNearSawmill ? '⚙️' : isNearForge ? '⚒️' : '🪓'}
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-base leading-tight font-extrabold whitespace-nowrap">
              {nearestMonster
                ? `⚔️ Attack ${ANIMAL_DEFINITIONS[nearestMonster.type].name.split(' ')[0]}`
                : nearestTree
                ? !unlockedWoodTypes.includes(nearestTree.woodType)
                  ? `Unlock ${WOOD_DEFINITIONS[nearestTree.woodType].name.split(' ')[0]}`
                  : `⚡ Auto-Chopping ${WOOD_DEFINITIONS[nearestTree.woodType].name.split(' ')[0]}`
                : isNearHouse
                ? 'Upgrade House'
                : isNearSawmill
                ? 'Open Sawmill'
                : isNearForge
                ? 'Open Forge'
                : 'Ready'}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono opacity-80 whitespace-nowrap hidden xs:inline sm:inline">
              {nearestMonster
                ? `[Tap / Space] Strike! (+${ANIMAL_DEFINITIONS[nearestMonster.type].goldReward} Gold) · ${nearestMonster.currentHp}/${nearestMonster.maxHp} HP`
                : nearestTree
                ? !unlockedWoodTypes.includes(nearestTree.woodType)
                  ? `Tap to unlock (${WOOD_DEFINITIONS[nearestTree.woodType].unlockGoldCost} Gold)`
                  : `[Tap / Space] Turbo Hit · ${nearestTree.currentHp}/${nearestTree.maxHp} HP`
                : isNearHouse || isNearSawmill || isNearForge
                ? 'Tap to open'
                : 'Explore forest'}
            </span>
          </div>
        </button>
      </div>

      {/* 4. Minimap / Radar (Bottom Right, placed above Action Button) */}
      <div className="absolute bottom-24 right-5 z-20 hidden md:flex flex-col items-end pointer-events-auto">
        <div
          onClick={handleMinimapClick}
          className="relative w-44 h-28 bg-stone-950/90 backdrop-blur-md rounded-xl border border-stone-800 overflow-hidden shadow-2xl cursor-crosshair group"
          title="Tap anywhere on Minimap to inspect camera"
        >
          {/* Mini Biome Patches */}
          <div className="absolute left-[10%] top-[15%] w-8 h-8 rounded-full bg-emerald-700/30" />
          <div className="absolute left-[45%] top-[12%] w-8 h-8 rounded-full bg-amber-600/30" />
          <div className="absolute left-[75%] top-[15%] w-8 h-8 rounded-full bg-sky-600/30" />
          <div className="absolute left-[12%] top-[65%] w-8 h-8 rounded-full bg-purple-600/30" />
          <div className="absolute left-[72%] top-[65%] w-8 h-8 rounded-full bg-rose-600/30" />

          {/* Central Settlement Clearing & Buildings on Minimap */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-4 rounded-full bg-stone-800/80 border border-stone-600/60 pointer-events-none" />
          {/* House (Gold) */}
          <div className="absolute left-[50%] top-[47%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 border border-white" title="Settlement House" />
          {/* Sawmill (Amber) */}
          <div className="absolute left-[44%] top-[51%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-600 border border-amber-300" title="Sawmill" />
          {/* Forge (Rose) */}
          <div className="absolute left-[56%] top-[51%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-500 border border-rose-300" title="Forge" />

          {/* Tree dots */}
          {trees.map((t) => (
            <div
              key={t.id}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${(t.x / WORLD_WIDTH) * 100}%`,
                top: `${(t.y / WORLD_HEIGHT) * 100}%`,
                backgroundColor: WOOD_DEFINITIONS[t.woodType].accentColor,
                opacity: t.state === 'standing' ? 0.9 : 0.2,
              }}
            />
          ))}

          {/* Player Location Marker on Minimap */}
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-amber-300 border border-stone-950 transform -translate-x-1/2 -translate-y-1/2 z-10 shadow"
            style={{
              left: `${(playerPos.x / WORLD_WIDTH) * 100}%`,
              top: `${(playerPos.y / WORLD_HEIGHT) * 100}%`,
            }}
          />

          {/* Current Camera Viewport Rectangle */}
          {containerRef.current && (
            <div
              className="absolute border border-white/60 bg-white/10 pointer-events-none"
              style={{
                left: `${Math.max(0, (-offset.x / (WORLD_WIDTH * scale)) * 100)}%`,
                top: `${Math.max(0, (-offset.y / (WORLD_HEIGHT * scale)) * 100)}%`,
                width: `${Math.min(100, (containerRef.current.clientWidth / (WORLD_WIDTH * scale)) * 100)}%`,
                height: `${Math.min(100, (containerRef.current.clientHeight / (WORLD_HEIGHT * scale)) * 100)}%`,
              }}
            />
          )}

          <div className="absolute top-1 left-1.5 text-[8px] font-mono text-stone-400 uppercase pointer-events-none">
            Minimap
          </div>
        </div>
      </div>

      {/* 3. Drag Instruction (Top Center) */}
      <div className="absolute top-3 inset-x-0 flex justify-center pointer-events-none z-10">
        <span className="text-[11px] text-stone-300 bg-stone-950/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-stone-800 shadow font-medium">
          Drag / swipe anywhere to pan · Tap trees to chop them · Pinch to zoom
        </span>
      </div>

      {/* 4. Unlock Grove Modal Prompt when clicking on a locked tree */}
      {treeToUnlock && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto"
        >
          <div className="bg-stone-900 border border-amber-600/60 p-6 rounded-2xl max-w-sm w-full text-stone-100 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl mx-auto mb-3">
              🔒
            </div>

            <h4 className="font-display font-bold text-lg text-amber-200">
              Unlock {WOOD_DEFINITIONS[treeToUnlock].name}
            </h4>

            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              This grove is protected by forest wards. Unlock it for{' '}
              <span className="font-mono text-amber-300 font-bold">
                {WOOD_DEFINITIONS[treeToUnlock].unlockGoldCost} Gold
              </span>{' '}
              to begin harvesting its timber.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setTreeToUnlock(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-stone-300 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                disabled={resources.coins < WOOD_DEFINITIONS[treeToUnlock].unlockGoldCost}
                onClick={() => {
                  unlockTreeTypeWithGold(treeToUnlock);
                  setTreeToUnlock(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow ${
                  resources.coins >= WOOD_DEFINITIONS[treeToUnlock].unlockGoldCost
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer shadow-amber-500/20 active:scale-95'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                Unlock Grove ({WOOD_DEFINITIONS[treeToUnlock].unlockGoldCost}g)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Player Defeat & Death Modal */}
      {deathNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn pointer-events-auto">
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-rose-600 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg animate-bounce">
              💀
            </div>
            <h3 className="font-display font-black text-xl text-rose-300 mb-1 tracking-wide">
              DEFEATED BY WILD BEASTS!
            </h3>
            <p className="text-xs text-stone-300 mb-4 leading-relaxed">
              {deathNotification.message}
            </p>
            <div className="mb-4 bg-stone-950/90 p-3 rounded-xl border border-rose-900/60 flex items-center justify-center gap-2">
              <span className="text-rose-400 font-bold text-xs uppercase tracking-wider">Penalty:</span>
              <span className="text-amber-400 font-mono font-black text-base">
                -10 Gold 🪙
              </span>
            </div>
            <button
              onClick={clearDeathNotification}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer text-sm"
            >
              Awaken at Hearth (Restored 100 HP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
