export type WoodType = 'pine' | 'oak' | 'birch' | 'redwood' | 'ironwood';

export const WORLD_WIDTH = 2600;
export const WORLD_HEIGHT = 1800;

export function getTotalWood(wood: Record<WoodType, number>): number {
  return (
    (wood.pine || 0) +
    (wood.oak || 0) +
    (wood.birch || 0) +
    (wood.redwood || 0) +
    (wood.ironwood || 0)
  );
}

export interface WoodDefinition {
  id: WoodType;
  name: string;
  description: string;
  tier: number;
  maxHp: number; // Hits required with base tool
  hardness: number; // Resistance / required tool power recommendation
  baseYield: [number, number]; // [min, max]
  hitYield: number; // Wood gathered on every single hit
  regrowTime: number; // seconds
  sellPrice: number; // Gold per unit
  plankYield: number; // Planks produced per 10 logs (1 plank per 10 wood)
  color: string;
  barkColor: string;
  leafColor: string;
  accentColor: string;
  unlockGoldCost: number;
  unlockHouseLevel: number;
}

export const WOOD_DEFINITIONS: Record<WoodType, WoodDefinition> = {
  pine: {
    id: 'pine',
    name: 'Pine Softwood',
    description: 'Fragrant and easy to fell. Plentiful wood that kickstarts your settlement.',
    tier: 1,
    maxHp: 4,
    hardness: 1,
    baseYield: [25, 40],
    hitYield: 2,
    regrowTime: 4,
    sellPrice: 1,
    plankYield: 1, // 10 wood = 1 plank
    color: '#84cc16',
    barkColor: '#78350f',
    leafColor: '#15803d',
    accentColor: '#4ade80',
    unlockGoldCost: 0,
    unlockHouseLevel: 0,
  },
  oak: {
    id: 'oak',
    name: 'Sturdy Oak',
    description: 'Dense, durable hardwood. High-yield timber for structural beams.',
    tier: 2,
    maxHp: 8,
    hardness: 2,
    baseYield: [45, 75],
    hitYield: 4,
    regrowTime: 6,
    sellPrice: 2,
    plankYield: 1,
    color: '#ca8a04',
    barkColor: '#451a03',
    leafColor: '#166534',
    accentColor: '#facc15',
    unlockGoldCost: 10,
    unlockHouseLevel: 1,
  },
  birch: {
    id: 'birch',
    name: 'Silver Birch',
    description: 'Clean pale bark and supple grain. High wood harvest per tree.',
    tier: 3,
    maxHp: 14,
    hardness: 4,
    baseYield: [80, 130],
    hitYield: 6,
    regrowTime: 9,
    sellPrice: 3,
    plankYield: 1,
    color: '#38bdf8',
    barkColor: '#e2e8f0',
    leafColor: '#65a30d',
    accentColor: '#38bdf8',
    unlockGoldCost: 25,
    unlockHouseLevel: 2,
  },
  redwood: {
    id: 'redwood',
    name: 'Ancient Redwood',
    description: 'Massive towering giants yielding enormous crimson timber reserves.',
    tier: 4,
    maxHp: 25,
    hardness: 8,
    baseYield: [160, 260],
    hitYield: 10,
    regrowTime: 14,
    sellPrice: 5,
    plankYield: 1,
    color: '#dc2626',
    barkColor: '#7f1d1d',
    leafColor: '#065f46',
    accentColor: '#f87171',
    unlockGoldCost: 50,
    unlockHouseLevel: 3,
  },
  ironwood: {
    id: 'ironwood',
    name: 'Mystic Ironwood',
    description: 'Dark, metallic timber infused with forest spirits. Colossal wood yield.',
    tier: 5,
    maxHp: 50,
    hardness: 15,
    baseYield: [300, 500],
    hitYield: 18,
    regrowTime: 20,
    sellPrice: 10,
    plankYield: 1,
    color: '#a855f7',
    barkColor: '#1e1b4b',
    leafColor: '#4c1d95',
    accentColor: '#c084fc',
    unlockGoldCost: 100,
    unlockHouseLevel: 4,
  },
};

export interface ToolDefinition {
  id: string;
  name: string;
  tier: number;
  description: string;
  chopPower: number; // Damage per click
  critChance: number; // 0 to 1
  critMultiplier: number;
  cleaveChance: number; // Chance to hit adjacent tree
  cost: {
    coins: number;
    woodType?: WoodType;
    woodAmount?: number;
    planks?: number;
  };
  icon: string;
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'flint_hatchet',
    name: 'Flint Hatchet',
    tier: 1,
    description: 'A primitive stone wedge bound to a pine branch. Cuts basic pine trees.',
    chopPower: 1,
    critChance: 0.05,
    critMultiplier: 2,
    cleaveChance: 0,
    cost: { coins: 0 },
    icon: '🪓',
  },
  {
    id: 'bronze_axe',
    name: 'Woodsman Bronze Axe',
    tier: 2,
    description: 'Sharpened bronze head. Chops through sturdy oak and gathers wood faster.',
    chopPower: 3,
    critChance: 0.1,
    critMultiplier: 2.2,
    cleaveChance: 0.05,
    cost: { coins: 40, woodType: 'pine', woodAmount: 35 },
    icon: '🪓',
  },
  {
    id: 'iron_felling_axe',
    name: 'Forged Iron Feller',
    tier: 3,
    description: 'Heavy tempered iron blade. Cuts birch and oak trees with clean, deep bites.',
    chopPower: 8,
    critChance: 0.15,
    critMultiplier: 2.5,
    cleaveChance: 0.12,
    cost: { coins: 150, woodType: 'oak', woodAmount: 60, planks: 20 },
    icon: '⚔️',
  },
  {
    id: 'steel_broad_axe',
    name: 'Tempered Steel Broadaxe',
    tier: 4,
    description: 'Double-beveled lumberjack axe. Breezes through dense timber and redwoods.',
    chopPower: 20,
    critChance: 0.22,
    critMultiplier: 3.0,
    cleaveChance: 0.2,
    cost: { coins: 450, woodType: 'birch', woodAmount: 80, planks: 60 },
    icon: '⚡',
  },
  {
    id: 'gasoline_chainsaw',
    name: 'Forest Master Saw',
    tier: 5,
    description: 'Motorized tungsten-carbide saw that tears through towering ancient redwoods in seconds.',
    chopPower: 45,
    critChance: 0.3,
    critMultiplier: 3.5,
    cleaveChance: 0.35,
    cost: { coins: 1200, woodType: 'redwood', woodAmount: 120, planks: 150 },
    icon: '⚙️',
  },
  {
    id: 'sunforged_reaper',
    name: 'Sunforged Timber Cleaver',
    tier: 6,
    description: 'Mythic battleaxe forged in solar embers. Cleaves through ironwood like warm butter.',
    chopPower: 110,
    critChance: 0.45,
    critMultiplier: 4.0,
    cleaveChance: 0.5,
    cost: { coins: 3500, woodType: 'ironwood', woodAmount: 180, planks: 300 },
    icon: '✨',
  },
];

export interface HouseStage {
  level: number;
  name: string;
  title: string;
  tagline: string;
  description: string;
  cost: {
    coins: number;
    wood: Partial<Record<WoodType, number>>;
    planks: number;
  };
  perks: string[];
  maxWorkerSlots: number;
  storageCap: number; // Maximum units per wood type
  unlockedWoods: WoodType[];
  visualTheme: string;
}

export const HOUSE_STAGES: HouseStage[] = [
  {
    level: 0,
    name: 'Wilderness Camp',
    title: 'Campfire & Lean-to',
    tagline: 'A modest clearing under the stars',
    description: 'A crackling stone campfire and rolled bedroll. The first humble step into the untamed wilderness.',
    cost: { coins: 0, wood: {}, planks: 0 },
    perks: ['Can harvest Pine trees', 'Base wood storage: 200 logs', 'Max 1 hired worker'],
    maxWorkerSlots: 1,
    storageCap: 200,
    unlockedWoods: ['pine'],
    visualTheme: 'camp',
  },
  {
    level: 1,
    name: 'Rustic Timber Cabin',
    title: 'Log Cabin with Porch',
    tagline: 'Warm hearth and notched pine logs',
    description: 'Built with sturdy horizontal pine logs, a riverstone chimney puffing smoke, and a sheltered firewood porch.',
    cost: { coins: 50, wood: { pine: 60 }, planks: 0 },
    perks: ['Unlocks Oak trees', 'Unlocks Sawmill construction', 'Max 3 hired workers', 'Storage cap: 500 logs'],
    maxWorkerSlots: 3,
    storageCap: 500,
    unlockedWoods: ['pine', 'oak'],
    visualTheme: 'log_cabin',
  },
  {
    level: 2,
    name: 'Homestead Lodge',
    title: 'Two-Story Oak Homestead',
    tagline: 'Gabled dormers and sturdy oak frame',
    description: 'Solid mortise-and-tenon oak framing with glass dormer windows, flower planters, and an expanded pantry.',
    cost: { coins: 180, wood: { pine: 80, oak: 70 }, planks: 40 },
    perks: ['Unlocks Silver Birch trees', 'Unlocks Blacksmith Forge', 'Max 5 hired workers', 'Storage cap: 1,200 logs'],
    maxWorkerSlots: 5,
    storageCap: 1200,
    unlockedWoods: ['pine', 'oak', 'birch'],
    visualTheme: 'homestead',
  },
  {
    level: 3,
    name: 'Forester Manor',
    title: 'Craftsman Woodland Manor',
    tagline: 'Birch trim, tiled roof & wraparound deck',
    description: 'An expansive estate with polished birch flooring, hand-carved decorative pillars, and a dedicated planning office.',
    cost: { coins: 500, wood: { oak: 120, birch: 110 }, planks: 100 },
    perks: ['Unlocks Ancient Redwood trees', 'Passive +25% worker chop speed', 'Max 8 hired workers', 'Storage cap: 3,000 logs'],
    maxWorkerSlots: 8,
    storageCap: 3000,
    unlockedWoods: ['pine', 'oak', 'birch', 'redwood'],
    visualTheme: 'manor',
  },
  {
    level: 4,
    name: 'Redwood Grand Chateau',
    title: 'Redwood Timber Chateau',
    tagline: 'Massive redwood pillars & stone watchtowers',
    description: 'An architectural marvel carved into the valley. Towering redwood arches, courtyard gardens, and artisan workshops.',
    cost: { coins: 1400, wood: { birch: 160, redwood: 180 }, planks: 250 },
    perks: ['Unlocks Mystic Ironwood trees', 'Auto-sawmill passive conversion', 'Max 12 hired workers', 'Storage cap: 7,500 logs'],
    maxWorkerSlots: 12,
    storageCap: 7500,
    unlockedWoods: ['pine', 'oak', 'birch', 'redwood', 'ironwood'],
    visualTheme: 'chateau',
  },
  {
    level: 5,
    name: 'Citadel of the Forest',
    title: 'Grand Timber Citadel',
    tagline: 'The legendary sovereign hall of the woods',
    description: 'An awe-inspiring sanctuary built from reinforced ironwood and marble. Crowned with glowing amber lanterns and royal banner crests.',
    cost: { coins: 4000, wood: { redwood: 250, ironwood: 250 }, planks: 600 },
    perks: ['All workers chop 2x faster', 'Double amber drop rate', 'Max 18 hired workers', 'Storage cap: 20,000 logs'],
    maxWorkerSlots: 18,
    storageCap: 20000,
    unlockedWoods: ['pine', 'oak', 'birch', 'redwood', 'ironwood'],
    visualTheme: 'citadel',
  },
];

export interface WorkerRole {
  id: string;
  name: string;
  title: string;
  description: string;
  hireCost: number;
  levelCostMultiplier: number;
  baseChopPower: number;
  chopIntervalSeconds: number;
  specialty: string;
  unlockedAtHouseLevel: number;
  allowedWoods: WoodType[];
  color: string;
}

export const WORKER_ROLES: WorkerRole[] = [
  {
    id: 'lumberjack_apprentice',
    name: 'Forest Apprentice',
    title: 'Lumberjack',
    description: 'Enthusiastic beginner who reliably harvests pine and oak trees.',
    hireCost: 35,
    levelCostMultiplier: 1.5,
    baseChopPower: 1,
    chopIntervalSeconds: 2.0,
    specialty: 'Steady basic wood gathering',
    unlockedAtHouseLevel: 0,
    allowedWoods: ['pine', 'oak'],
    color: '#16a34a',
  },
  {
    id: 'veteran_forester',
    name: 'Veteran Woodsman',
    title: 'Timber Forester',
    description: 'Hardened veteran who specializes in cutting tough Oak and Birch trees.',
    hireCost: 120,
    levelCostMultiplier: 1.6,
    baseChopPower: 3,
    chopIntervalSeconds: 1.8,
    specialty: '+15% bonus wood per cut',
    unlockedAtHouseLevel: 1,
    allowedWoods: ['pine', 'oak', 'birch'],
    color: '#0284c7',
  },
  {
    id: 'redwood_hewer',
    name: 'Redwood Hewer',
    title: 'Heavy Logger',
    description: 'A burly giant equipped to conquer massive Redwood trunks.',
    hireCost: 380,
    levelCostMultiplier: 1.7,
    baseChopPower: 8,
    chopIntervalSeconds: 1.5,
    specialty: 'High damage vs hard woods',
    unlockedAtHouseLevel: 3,
    allowedWoods: ['pine', 'oak', 'birch', 'redwood'],
    color: '#b91c1c',
  },
  {
    id: 'ironwood_druid',
    name: 'Mystic Sylvan Druid',
    title: 'Forest Weaver',
    description: 'Whispers to the ancient trees, harvesting enchanted ironwood without harming the roots.',
    hireCost: 950,
    levelCostMultiplier: 1.8,
    baseChopPower: 22,
    chopIntervalSeconds: 1.2,
    specialty: 'Can harvest Ironwood; finds rare Amber',
    unlockedAtHouseLevel: 4,
    allowedWoods: ['pine', 'oak', 'birch', 'redwood', 'ironwood'],
    color: '#9333ea',
  },
];

export interface HiredWorker {
  id: string;
  roleId: string;
  name: string;
  level: number;
  assignedWood: WoodType | 'auto';
  totalGathered: number;
}

export interface SettlementBuilding {
  id: 'sawmill' | 'forge' | 'storage_shed' | 'trading_cart';
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  unlockedAtHouseLevel: number;
  cost: {
    coins: number;
    wood: Partial<Record<WoodType, number>>;
    planks: number;
  };
  benefit: string;
}

export const BASE_BUILDINGS: SettlementBuilding[] = [
  {
    id: 'sawmill',
    name: 'Hydraulic Sawmill',
    description: 'Processes raw logs into clean planks with waterwheel efficiency.',
    level: 0,
    maxLevel: 5,
    unlockedAtHouseLevel: 1,
    cost: { coins: 60, wood: { pine: 50, oak: 25 }, planks: 0 },
    benefit: 'Converts logs to planks +50% faster, +10% bonus planks per level',
  },
  {
    id: 'forge',
    name: 'Lumberjack Blacksmith Forge',
    description: 'Maintains axe edges and tempers tool steel for higher critical hits.',
    level: 0,
    maxLevel: 5,
    unlockedAtHouseLevel: 2,
    cost: { coins: 150, wood: { oak: 60, birch: 40 }, planks: 30 },
    benefit: '+5% Tool Critical Strike Chance & +10% chop damage per level',
  },
  {
    id: 'storage_shed',
    name: 'Reinforced Timber Yard',
    description: 'Organized log ramps and sheltered sheds that raise your resource storage limits.',
    level: 0,
    maxLevel: 5,
    unlockedAtHouseLevel: 1,
    cost: { coins: 90, wood: { pine: 70, oak: 40 }, planks: 20 },
    benefit: '+50% Wood & Plank maximum capacity per level',
  },
  {
    id: 'trading_cart',
    name: 'Merchant Outpost',
    description: 'Allows traveling trade caravans to purchase surplus timber for gold.',
    level: 0,
    maxLevel: 5,
    unlockedAtHouseLevel: 2,
    cost: { coins: 120, wood: { birch: 60 }, planks: 40 },
    benefit: '+15% Gold value when selling logs, unlocks bulk trading',
  },
];

export interface TreeInstance {
  id: string;
  woodType: WoodType;
  maxHp: number;
  currentHp: number;
  state: 'standing' | 'falling' | 'stump' | 'growing';
  regrowProgress: number; // 0 to 100
  x: number; // Position percentage inside forest plot (10-90)
  y: number; // Position percentage inside forest plot (10-90)
  sizeVariant: number; // 0.85 to 1.15
  shake: boolean;
}

export interface FloatingParticle {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  isCrit?: boolean;
}

export interface GameStats {
  totalTreesCut: number;
  totalWoodGathered: number;
  totalCoinsEarned: number;
  totalAmberFound: number;
  manualChops: number;
  workerChops: number;
  startTime: number;
}
