import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface JoystickVector {
  x: number; // -1 to 1
  y: number; // -1 to 1
  angle: number; // radians
  distance: number; // 0 to 1
  active: boolean;
}

interface VirtualJoystickProps {
  onMove: (vector: JoystickVector) => void;
  className?: string;
  size?: number;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  className = '',
  size = 120,
}) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState<boolean>(false);
  const pointerIdRef = useRef<number | null>(null);

  const maxRadius = (size / 2) * 0.72;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    pointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    setIsActive(true);
    updateKnob(e.clientX, e.clientY);
  };

  const updateKnob = useCallback(
    (clientX: number, clientY: number) => {
      if (!baseRef.current) return;
      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rawDx = clientX - centerX;
      const rawDy = clientY - centerY;
      const dist = Math.hypot(rawDx, rawDy);
      const angle = Math.atan2(rawDy, rawDx);

      const clampedDist = Math.min(dist, maxRadius);
      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;

      setKnobPos({ x: knobX, y: knobY });

      const normalizedDist = clampedDist / maxRadius;
      const normX = Math.cos(angle) * normalizedDist;
      const normY = Math.sin(angle) * normalizedDist;

      onMove({
        x: normX,
        y: normY,
        angle,
        distance: normalizedDist,
        active: true,
      });
    },
    [maxRadius, onMove]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive || pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    pointerIdRef.current = null;
    setIsActive(false);
    setKnobPos({ x: 0, y: 0 });

    onMove({
      x: 0,
      y: 0,
      angle: 0,
      distance: 0,
      active: false,
    });
  };

  // Keyboard input support (WASD and Arrow keys)
  useEffect(() => {
    const keysDown = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        // Only prevent default if not typing in an input
        if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        keysDown.add(key);
        computeKeyVector();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keysDown.has(key)) {
        keysDown.delete(key);
        computeKeyVector();
      }
    };

    const computeKeyVector = () => {
      if (isActive) return; // Touch joystick takes precedence if active

      let vx = 0;
      let vy = 0;

      if (keysDown.has('w') || keysDown.has('arrowup')) vy -= 1;
      if (keysDown.has('s') || keysDown.has('arrowdown')) vy += 1;
      if (keysDown.has('a') || keysDown.has('arrowleft')) vx -= 1;
      if (keysDown.has('d') || keysDown.has('arrowright')) vx += 1;

      const dist = Math.hypot(vx, vy);
      if (dist > 0) {
        const normX = vx / dist;
        const normY = vy / dist;
        const angle = Math.atan2(normY, normX);

        setKnobPos({
          x: normX * maxRadius * 0.75,
          y: normY * maxRadius * 0.75,
        });

        onMove({
          x: normX,
          y: normY,
          angle,
          distance: 1,
          active: true,
        });
      } else {
        setKnobPos({ x: 0, y: 0 });
        onMove({
          x: 0,
          y: 0,
          angle: 0,
          distance: 0,
          active: false,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive, maxRadius, onMove]);

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`relative select-none touch-none rounded-full flex items-center justify-center transition-shadow ${
        isActive
          ? 'bg-stone-900/80 border-2 border-amber-500 shadow-xl shadow-amber-500/30'
          : 'bg-stone-950/60 border border-stone-700/60 hover:border-stone-500/80'
      } backdrop-blur-md ${className}`}
      title="Virtual Joystick: Drag or use WASD / Arrow keys to move character"
    >
      {/* Cardinal Direction Ticks */}
      <div className="absolute top-1.5 w-1 h-2 rounded bg-stone-500/50" />
      <div className="absolute bottom-1.5 w-1 h-2 rounded bg-stone-500/50" />
      <div className="absolute left-1.5 w-2 h-1 rounded bg-stone-500/50" />
      <div className="absolute right-1.5 w-2 h-1 rounded bg-stone-500/50" />

      {/* Center guide mark */}
      <div className="w-4 h-4 rounded-full border border-stone-600/40 pointer-events-none" />

      {/* Floating Joystick Thumb Knob */}
      <div
        className={`absolute rounded-full pointer-events-none transition-transform duration-75 flex items-center justify-center shadow-lg ${
          isActive
            ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-200 text-stone-950 scale-105 shadow-amber-500/50'
            : 'bg-gradient-to-br from-stone-700 to-stone-800 border border-stone-500 text-stone-300'
        }`}
        style={{
          width: `${size * 0.42}px`,
          height: `${size * 0.42}px`,
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
        }}
      >
        <span className="text-xs font-bold drop-shadow-sm">🕹️</span>
      </div>
    </div>
  );
};
