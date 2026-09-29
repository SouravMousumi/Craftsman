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
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import {
  WOOD_DEFINITIONS,
  WoodType,
  TreeInstance,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  HOUSE_STAGES,
} from '../types/game';

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
      className={`absolute pointer-events-none flex flex-col items-center select-none transition-transform duration-150 ${
        tree.shake ? 'animate-chop' : ''
      } ${
        tree.state === 'falling'
          ? 'transition-all duration-300 -rotate-45 translate-y-6 opacity-60'
          : ''
      } ${!isUnlocked ? 'opacity-80' : ''}`}
      style={{
        left: `${tree.x}px`,
        top: `${tree.y}px`,
        transform: `translate(-50%, -50%) scale(${tree.sizeVariant * (isHovered ? 1.08 : 1)})`,
        zIndex: Math.round(tree.y),
      }}
    >
      {/* Locked badge or HP bar */}
      {!isUnlocked ? (
        <div className="mb-1 flex items-center gap-1 bg-stone-950/85 px-2 py-0.5 rounded-full border border-amber-500/50 text-[10px] text-amber-300 font-semibold shadow pointer-events-none">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>{def.unlockGoldCost} Gold</span>
        </div>
      ) : (
        (isHovered || tree.currentHp < tree.maxHp) &&
        tree.state === 'standing' && (
          <div className="mb-1 flex flex-col items-center pointer-events-none transition-opacity">
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
  );
};

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
  } = useGame();

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan state
  const [scale, setScale] = useState<number>(0.85);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: -650, y: -450 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [isSmoothAnimating, setIsSmoothAnimating] = useState<boolean>(false);

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

  // Clamp offset to keep map in view
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

  // Center camera on player's central settlement on mount
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const initialOffset = {
        x: clientWidth / 2 - 1300 * scale,
        y: clientHeight / 2 - 950 * scale,
      };
      setOffset(clampOffset(initialOffset, scale));
    }
  }, []);

  // Zoom In / Out handlers with smooth focal point
  const handleZoom = useCallback(
    (delta: number, clientX?: number, clientY?: number) => {
      setScale((prevScale) => {
        const nextScale = Math.min(1.8, Math.max(0.42, prevScale + delta));
        if (!containerRef.current) return nextScale;

        const rect = containerRef.current.getBoundingClientRect();
        const originX = clientX !== undefined ? clientX - rect.left : rect.width / 2;
        const originY = clientY !== undefined ? clientY - rect.top : rect.height / 2;

        setOffset((prevOffset) => {
          const factor = nextScale / prevScale;
          const targetOffset = {
            x: originX - (originX - prevOffset.x) * factor,
            y: originY - (originY - prevOffset.y) * factor,
          };
          return clampOffset(targetOffset, nextScale);
        });

        return nextScale;
      });
    },
    [clampOffset]
  );

  // Wheel Zoom listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.09 : -0.09;
      handleZoom(delta, e.clientX, e.clientY);
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

          // Check if tap hit the central settlement house (x: 1300, y: 990)
          const distToHouse = Math.hypot(worldX - 1300, worldY - 990);
          if (distToHouse < 90) {
            if (onOpenHomestead) onOpenHomestead();
            return;
          }

          // Check if tap hit Sawmill (clearing at 1050, 780; Sawmill at 1090-1160, 820-910; center approx 1125, 865)
          const distToSawmill = Math.hypot(worldX - 1125, worldY - 865);
          if (distToSawmill < 85) {
            if (onOpenModal) onOpenModal('sawmill');
            return;
          }

          // Check if tap hit Forge (clearing at 1050, 780; Forge at 1445-1515, 820-910; center approx 1480, 865)
          const distToForge = Math.hypot(worldX - 1480, worldY - 865);
          if (distToForge < 85) {
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
        x: clientWidth / 2 - 1300 * scale,
        y: clientHeight / 2 - 950 * scale,
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
              left: '1750px',
              top: '220px',
              width: '800px',
              height: '700px',
              background: '#0284c7',
            }}
          />

          {/* Biome Zone 4: Mystic Ironwood Sanctum (SW) */}
          <div
            className="absolute rounded-full blur-3xl opacity-35"
            style={{
              left: '250px',
              top: '1050px',
              width: '850px',
              height: '700px',
              background: '#7e22ce',
            }}
          />

          {/* Biome Zone 5: Ancient Redwoods (SE) */}
          <div
            className="absolute rounded-full blur-3xl opacity-35"
            style={{
              left: '1650px',
              top: '1050px',
              width: '850px',
              height: '700px',
              background: '#b91c1c',
            }}
          />

          {/* Natural River curving from North to South */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 1800 0 Q 1550 500 1620 900 T 1350 1800"
              fill="none"
              stroke="#0284c7"
              strokeWidth="50"
              strokeLinecap="round"
            />
            <path
              d="M 1800 0 Q 1550 500 1620 900 T 1350 1800"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="20"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>

          {/* Biome Territory Signposts */}
          <div className="absolute left-[520px] top-[260px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-emerald-400 bg-stone-950/80 px-3 py-1 rounded-full border border-emerald-700/50 shadow">
              🌲 Whispering Pines (Tier 1)
            </span>
          </div>

          <div className="absolute left-[1250px] top-[180px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-amber-300 bg-stone-950/80 px-3 py-1 rounded-full border border-amber-600/50 shadow">
              🌳 Sturdy Oak Copse (Tier 2)
            </span>
          </div>

          <div className="absolute left-[2000px] top-[250px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-sky-300 bg-stone-950/80 px-3 py-1 rounded-full border border-sky-600/50 shadow">
              🍃 Silver Birch Glade (Tier 3)
            </span>
          </div>

          <div className="absolute left-[1950px] top-[1060px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-rose-400 bg-stone-950/80 px-3 py-1 rounded-full border border-rose-700/50 shadow">
              🪵 Ancient Redwood Valley (Tier 4)
            </span>
          </div>

          <div className="absolute left-[480px] top-[1060px] pointer-events-none text-center">
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-purple-400 bg-stone-950/80 px-3 py-1 rounded-full border border-purple-700/50 shadow">
              🔮 Mystic Ironwood Sanctum (Tier 5)
            </span>
          </div>

          {/* Central Settlement Clearing (x: 1300, y: 950) */}
          <div
            className="absolute rounded-full border-4 border-amber-800/30"
            style={{
              left: '1050px',
              top: '780px',
              width: '500px',
              height: '420px',
              background: 'radial-gradient(ellipse at center, #292524 0%, #1c1917 70%, transparent 100%)',
            }}
          >
            {/* Settlement Visual House Building */}
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
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group hover:scale-105 active:scale-95 transition-all z-20 pointer-events-auto"
            >
              <div className="w-24 h-24 rounded-2xl bg-amber-950/80 border-2 border-amber-500/80 group-hover:border-amber-400 flex items-center justify-center text-4xl shadow-2xl">
                🏡
              </div>
              <div className="mt-2 bg-stone-950/95 px-3 py-1 rounded-lg border border-amber-600/60 shadow text-center">
                <span className="font-display font-bold text-xs text-amber-200 block whitespace-nowrap">
                  {currentHouse.name} (Lv.{houseLevel})
                </span>
                <span className="text-[10px] text-amber-400 font-semibold block whitespace-nowrap">
                  Tap to Upgrade House
                </span>
              </div>
            </div>

            {/* Sawmill & Timber Racks nearby */}
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
              className="absolute left-10 top-12 flex flex-col items-center cursor-pointer group hover:scale-110 active:scale-95 transition-all z-20 pointer-events-auto"
              title="Sawmill: Convert 10 Wood -> 1 Plank, Sell 10 Planks -> 1 Gold"
            >
              <div className="w-16 h-16 rounded-2xl bg-stone-900 border-2 border-amber-500/80 group-hover:border-amber-400 flex items-center justify-center text-3xl shadow-xl hover:shadow-amber-500/20">
                ⚙️
              </div>
              <div className="mt-1 bg-stone-950/95 px-2 py-0.5 rounded border border-amber-600/50 shadow text-center">
                <span className="text-[11px] font-bold text-amber-200 block whitespace-nowrap">
                  Sawmill
                </span>
                <span className="text-[9px] text-amber-400 font-mono block whitespace-nowrap">
                  10w ➔ 1 Plank
                </span>
              </div>
            </div>

            {/* Blacksmith Forge nearby */}
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
              className="absolute right-10 top-12 flex flex-col items-center cursor-pointer group hover:scale-110 active:scale-95 transition-all z-20 pointer-events-auto"
              title="Blacksmith Forge: Upgrade Weapon Damage (+2 DMG) for 10 Gold"
            >
              <div className="w-16 h-16 rounded-2xl bg-stone-900 border-2 border-rose-500/80 group-hover:border-rose-400 flex items-center justify-center text-3xl shadow-xl hover:shadow-rose-500/20">
                ⚒️
              </div>
              <div className="mt-1 bg-stone-950/95 px-2 py-0.5 rounded border border-rose-600/50 shadow text-center">
                <span className="text-[11px] font-bold text-rose-200 block whitespace-nowrap">
                  Forge
                </span>
                <span className="text-[9px] text-emerald-400 font-mono block whitespace-nowrap">
                  +2 DMG (10g)
                </span>
              </div>
            </div>
          </div>
        </div>

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

        {/* Hired Workers animated roaming near trees */}
        {hiredWorkers.map((worker, idx) => {
          const baseX = 850 + ((idx * 220) % 800);
          const baseY = 650 + ((idx * 160) % 550);

          return (
            <div
              key={worker.id}
              className="absolute pointer-events-none transition-all duration-1000 flex flex-col items-center"
              style={{
                left: `${baseX}px`,
                top: `${baseY}px`,
                zIndex: Math.round(baseY) + 2,
              }}
            >
              <div className="relative flex items-center justify-center animate-bounce">
                <span className="text-xl">🪓</span>
                <span className="text-sm absolute -bottom-1">🧔</span>
              </div>
              <span className="text-[10px] font-mono text-stone-300 bg-stone-900/90 px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                {worker.name}
              </span>
            </div>
          );
        })}

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

      {/* OVERLAY CONTROLS (Always on top of map) */}

      {/* 1. Zoom and Camera Controls (Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-800 shadow-xl pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoom(0.18);
          }}
          aria-label="Zoom in"
          title="Zoom in (+)"
          className="p-2 text-stone-300 hover:text-amber-300 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
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
          className="p-2 text-stone-300 hover:text-amber-300 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setScale(1.0);
            centerCamp();
          }}
          aria-label="Reset zoom to 100%"
          title="Reset zoom to 100%"
          className="px-2.5 py-1 text-xs font-mono font-semibold text-stone-300 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            centerCamp();
          }}
          aria-label="Center on Settlement"
          title="Center on Settlement Camp"
          className="p-2 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-stone-700 mx-0.5" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenModal) onOpenModal('sawmill');
          }}
          aria-label="Open Sawmill"
          title="Open Sawmill (10 Wood -> 1 Plank, Sell Planks for Gold)"
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 rounded-lg border border-amber-600/40 transition-colors cursor-pointer shadow-sm active:scale-95"
        >
          <span className="text-sm">⚙️</span>
          <span className="hidden sm:inline">Sawmill</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenModal) onOpenModal('forge');
          }}
          aria-label="Open Forge"
          title="Open Blacksmith Forge (Upgrade Weapon +2 DMG for 10 Gold)"
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 rounded-lg border border-rose-600/40 transition-colors cursor-pointer shadow-sm active:scale-95"
        >
          <span className="text-sm">⚒️</span>
          <span className="hidden sm:inline">Forge</span>
        </button>
      </div>

      {/* 2. Minimap / Radar (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-20 hidden sm:flex flex-col items-end pointer-events-auto">
        <div
          onClick={handleMinimapClick}
          className="relative w-48 h-32 bg-stone-950/90 backdrop-blur-md rounded-xl border border-stone-800 overflow-hidden shadow-2xl cursor-crosshair group"
          title="Tap anywhere on Minimap to pan camera"
        >
          {/* Mini Biome Patches */}
          <div className="absolute left-[10%] top-[15%] w-8 h-8 rounded-full bg-emerald-700/30" />
          <div className="absolute left-[45%] top-[12%] w-8 h-8 rounded-full bg-amber-600/30" />
          <div className="absolute left-[75%] top-[15%] w-8 h-8 rounded-full bg-sky-600/30" />
          <div className="absolute left-[12%] top-[65%] w-8 h-8 rounded-full bg-purple-600/30" />
          <div className="absolute left-[72%] top-[65%] w-8 h-8 rounded-full bg-rose-600/30" />

          {/* Central Settlement Dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />

          {/* Tree dots */}
          {trees.map((t) => (
            <div
              key={t.id}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${(t.x / WORLD_WIDTH) * 100}%`,
                top: `${(t.y / WORLD_HEIGHT) * 100}%`,
                backgroundColor: WOOD_DEFINITIONS[t.woodType].accentColor,
                opacity: t.state === 'standing' ? 0.9 : 0.3,
              }}
            />
          ))}

          {/* Current Camera Viewport Rectangle */}
          {containerRef.current && (
            <div
              className="absolute border border-white/70 bg-white/10 pointer-events-none"
              style={{
                left: `${Math.max(0, (-offset.x / (WORLD_WIDTH * scale)) * 100)}%`,
                top: `${Math.max(0, (-offset.y / (WORLD_HEIGHT * scale)) * 100)}%`,
                width: `${Math.min(100, (containerRef.current.clientWidth / (WORLD_WIDTH * scale)) * 100)}%`,
                height: `${Math.min(100, (containerRef.current.clientHeight / (WORLD_HEIGHT * scale)) * 100)}%`,
              }}
            />
          )}

          <div className="absolute top-1 left-1.5 text-[9px] font-mono text-stone-400 uppercase pointer-events-none">
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
    </div>
  );
};
