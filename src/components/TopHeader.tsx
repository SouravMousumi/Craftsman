import React from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  BarChart3,
  TreePine,
  Layers,
  Coins,
  Sword,
  Home,
  Users,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getTotalWood } from '../types/game';
import { sound } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'map' | 'homestead' | 'sawmill' | 'forge' | 'workers';

interface TopHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenModal: (type: 'wood' | 'planks' | 'sawmill' | 'gold' | 'weapon' | 'forge') => void;
  onOpenStats: () => void;
  onReset: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenModal,
  onOpenStats,
  onReset,
  isMuted,
  setIsMuted,
}) => {
  const { resources, currentTool, weaponBonusDamage } = useGame();

  const totalWood = getTotalWood(resources.wood);
  const totalDamage = currentTool.chopPower + weaponBonusDamage;

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  return (
    <header className="z-30 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shrink-0 h-14 select-none">
      <div className="h-full px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 max-w-full">
        {/* Left: Brand title */}
        <div
          onClick={() => setActiveTab('map')}
          className="flex items-center gap-2 cursor-pointer shrink-0"
          title="Return to World Map"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-800/80 border border-emerald-600/60 flex items-center justify-center text-emerald-400">
            <TreePine className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-amber-100 hidden sm:inline">
            TimberCraft
          </span>
        </div>

        {/* Center: THE 4 RESOURCE ICONS WITH NUMBERS (Click opens conversion menu) */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {/* 1. WOOD ICON + NUMBER */}
          <button
            onClick={() => onOpenModal('wood')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-600/50 transition-all text-xs font-semibold cursor-pointer shadow-sm group"
            title="Wood: Click to open Wood Conversion & Milling Menu (10 Wood -> 1 Plank)"
          >
            <span className="text-base group-hover:scale-110 transition-transform">🪵</span>
            <span className="font-mono text-amber-200 tabular-nums">
              {totalWood.toLocaleString()}
            </span>
          </button>

          {/* 2. SAWMILL & PLANKS */}
          <button
            onClick={() => onOpenModal('sawmill')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 transition-all text-xs font-semibold cursor-pointer shadow-sm group active:scale-95"
            title="Sawmill: Mill 10 Wood -> 1 Plank, or sell 10 Planks -> 1 Gold"
          >
            <span className="text-base group-hover:scale-110 transition-transform">⚙️</span>
            <span className="hidden sm:inline text-amber-300/90 font-medium">Sawmill:</span>
            <span className="font-mono text-stone-100 tabular-nums">
              {resources.planks.toLocaleString()}
            </span>
          </button>

          {/* 3. GOLD ICON + NUMBER */}
          <button
            onClick={() => onOpenModal('gold')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-400/60 transition-all text-xs font-semibold cursor-pointer shadow-sm group active:scale-95"
            title="Gold: Click to open Gold Menu (Upgrade Weapon for 10 Gold, Unlock Tree Groves)"
          >
            <span className="text-base group-hover:scale-110 transition-transform">🪙</span>
            <span className="font-mono text-amber-300 font-bold tabular-nums">
              {resources.coins.toLocaleString()}
            </span>
          </button>

          {/* 4. FORGE & WEAPON */}
          <button
            onClick={() => onOpenModal('forge')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-rose-500/50 transition-all text-xs font-semibold cursor-pointer shadow-sm group active:scale-95"
            title="Forge: Upgrade Weapon Damage (+2 DMG) for 10 Gold"
          >
            <span className="text-base group-hover:scale-110 transition-transform">⚒️</span>
            <span className="hidden sm:inline text-rose-300/90 font-medium">Forge:</span>
            <span className="font-mono text-rose-300 font-bold tabular-nums">
              {totalDamage} DMG
            </span>
          </button>
        </div>

        {/* Right: Views & Utilities */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'map'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            Map
          </button>

          <button
            onClick={() => setActiveTab('homestead')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'homestead'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">House</span>
          </button>

          <button
            onClick={() => setActiveTab('sawmill')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'sawmill'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
            title="View Sawmill Workshop & Planks Trade"
          >
            <span>⚙️</span>
            <span className="hidden md:inline">Sawmill</span>
          </button>

          <button
            onClick={() => setActiveTab('forge')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'forge'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
            title="View Blacksmith Forge & Weapon Upgrades"
          >
            <span>⚒️</span>
            <span className="hidden md:inline">Forge</span>
          </button>

          <button
            onClick={() => setActiveTab('workers')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'workers'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Workers</span>
          </button>

          <div className="h-4 w-[1px] bg-stone-800 mx-1 hidden sm:block" />

          {/* In-App Mobile PWA Install Button */}
          <PWAInstallButton />

          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-1.5 text-stone-400 hover:text-amber-300 rounded hover:bg-stone-800 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={onOpenStats}
            aria-label="View Milestones and Statistics"
            title="Settlement Statistics"
            className="p-1.5 text-stone-400 hover:text-amber-300 rounded hover:bg-stone-800 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            aria-label="Reset Settlement Progress"
            title="Reset Game"
            className="p-1.5 text-stone-500 hover:text-rose-400 rounded hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
