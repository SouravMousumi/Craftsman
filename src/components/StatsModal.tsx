import React from 'react';
import { X, Trophy, Award, Clock, TreePine, Coins, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { HOUSE_STAGES } from '../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const { stats, houseLevel, hiredWorkers, resources } = useGame();

  if (!isOpen) return null;

  const currentHouse = HOUSE_STAGES[houseLevel] || HOUSE_STAGES[0];

  const minutesPlayed = Math.max(1, Math.floor((Date.now() - stats.startTime) / 60000));

  const achievements = [
    {
      id: 'first_tree',
      title: 'First Timber',
      desc: 'Fell at least 1 tree in the frontier',
      unlocked: stats.totalTreesCut >= 1,
    },
    {
      id: 'cabin_builder',
      title: 'Homestead Founder',
      desc: 'Upgrade house to Rustic Log Cabin (Lv. 1)',
      unlocked: houseLevel >= 1,
    },
    {
      id: 'two_story',
      title: 'Oak Framer',
      desc: 'Upgrade house to Two-Story Homestead (Lv. 2)',
      unlocked: houseLevel >= 2,
    },
    {
      id: 'forester_manor',
      title: 'Woodland Manor',
      desc: 'Build the Craftsman Woodland Manor (Lv. 3)',
      unlocked: houseLevel >= 3,
    },
    {
      id: 'redwood_chateau',
      title: 'Redwood Lord',
      desc: 'Construct the Redwood Timber Chateau (Lv. 4)',
      unlocked: houseLevel >= 4,
    },
    {
      id: 'citadel',
      title: 'Citadel of the Forest',
      desc: 'Construct the legendary Great Forest Citadel (Lv. 5)',
      unlocked: houseLevel >= 5,
    },
    {
      id: 'lumber_guild',
      title: 'Lumber Guildmaster',
      desc: 'Employ at least 4 active workers simultaneously',
      unlocked: hiredWorkers.length >= 4,
    },
    {
      id: 'amber_eye',
      title: 'Amber Prospector',
      desc: 'Discover 3 or more rare Amber stones',
      unlocked: stats.totalAmberFound >= 3 || resources.amber >= 3,
    },
    {
      id: 'beast_slayer',
      title: 'Wild Frontier Hunter',
      desc: 'Defeat at least 3 wild beasts in the forest',
      unlocked: (stats.monstersKilled || 0) >= 3,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close Statistics"
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-stone-100">
              Settlement Records & Milestones
            </h3>
            <span className="text-xs text-stone-400">
              {currentHouse.name} · Level {houseLevel}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Trees Felled</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">
              {stats.totalTreesCut.toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Wood Harvested</span>
            <span className="text-lg font-bold text-amber-300 tabular-nums">
              {stats.totalWoodGathered.toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Gold Earned</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">
              {stats.totalCoinsEarned.toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Beasts Slain</span>
            <span className="text-lg font-bold text-rose-400 tabular-nums">
              {(stats.monstersKilled || 0).toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Amber Found</span>
            <span className="text-lg font-bold text-amber-500 tabular-nums">
              {stats.totalAmberFound.toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Player Chops</span>
            <span className="text-lg font-bold text-stone-200 tabular-nums">
              {stats.manualChops.toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Settler Defeats</span>
            <span className="text-lg font-bold text-red-400 tabular-nums">
              {(stats.playerDeaths || 0).toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Time in Woods</span>
            <span className="text-lg font-bold text-sky-400 tabular-nums">
              {minutesPlayed} min
            </span>
          </div>
        </div>

        {/* Milestone Achievements */}
        <div>
          <h4 className="font-display font-semibold text-sm text-stone-300 uppercase tracking-wider mb-3">
            Milestones & Achievements
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                  a.unlocked
                    ? 'bg-amber-950/20 border-amber-500/40 text-stone-100'
                    : 'bg-stone-950/40 border-stone-800/80 text-stone-500 opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    a.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-600'
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                    <span>{a.title}</span>
                    {a.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" />}
                  </div>
                  <div className="text-[11px] text-stone-400 truncate mt-0.5">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors cursor-pointer"
        >
          Close Records
        </button>
      </div>
    </div>
  );
};
