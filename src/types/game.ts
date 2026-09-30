export type WoodType = 'pine' | 'oak' | 'birch' | 'redwood' | 'ironwood';

export const WORLD_WIDTH = 5200;
export const WORLD_HEIGHT = 3600;

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
    maxHp: 8,
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
    maxHp: 16,
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
    maxHp: 28,
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
    maxHp: 50,
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
    maxHp: 100,
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
    name: 'Shabby Forest Hut',
    title: 'Makeshift Shelter',
    tagline: 'A simple timber lean-to',
    description: 'A basic wooden shelter with a thatched roof and campfire.',
    cost: { coins: 0, wood: {}, planks: 0 },
    perks: ['Harvest Pine trees', 'Wood storage: 200 logs', '1 hired worker slot'],
    maxWorkerSlots: 1,
    storageCap: 200,
    unlockedWoods: ['pine'],
    visualTheme: 'shabby_hut',
  },
  {
    level: 1,
    name: 'Rustic Timber Cabin',
    title: 'Notched Pine Log Cabin',
    tagline: 'Warm stone hearth and fragrant pine logs',
    description: 'Built with sturdy horizontal notched pine logs, a riverstone chimney puffing smoke, stacked firewood, and a warm hearth.',
    cost: { coins: 50, wood: { pine: 60 }, planks: 0 },
    perks: ['Unlocks Oak trees', 'Unlocks Sawmill construction', 'Max 3 hired workers', 'Storage cap: 500 logs'],
    maxWorkerSlots: 3,
    storageCap: 500,
    unlockedWoods: ['pine', 'oak'],
    visualTheme: 'log_cabin',
  },
  {
    level: 2,
    name: 'Two-Story Oak Homestead',
    title: 'Oak Timber Homestead',
    tagline: 'Gabled dormers, balcony and blooming flowerboxes',
    description: 'Solid mortise-and-tenon oak framing on a riverstone foundation. Features dormer windows, flower planter boxes, and a second-story balcony.',
    cost: { coins: 180, wood: { pine: 80, oak: 70 }, planks: 40 },
    perks: ['Unlocks Silver Birch trees', 'Unlocks Blacksmith Forge', 'Max 5 hired workers', 'Storage cap: 1,200 logs'],
    maxWorkerSlots: 5,
    storageCap: 1200,
    unlockedWoods: ['pine', 'oak', 'birch'],
    visualTheme: 'homestead',
  },
  {
    level: 3,
    name: 'Craftsman Woodland Manor',
    title: 'Forester Craftsman Manor',
    tagline: 'White birch trim, multi-tier slate roof & veranda',
    description: 'An expansive estate with polished birch pillars, multi-gabled slate roofs, a wraparound veranda deck, and glowing bay windows.',
    cost: { coins: 500, wood: { oak: 120, birch: 110 }, planks: 100 },
    perks: ['Unlocks Ancient Redwood trees', 'Passive +25% worker chop speed', 'Max 8 hired workers', 'Storage cap: 3,000 logs'],
    maxWorkerSlots: 8,
    storageCap: 3000,
    unlockedWoods: ['pine', 'oak', 'birch', 'redwood'],
    visualTheme: 'manor',
  },
  {
    level: 4,
    name: 'Redwood Fortified Chateau',
    title: 'Redwood Fortress Chateau',
    tagline: 'Massive redwood keep & twin defensive watchtowers',
    description: 'An architectural fortress carved into the valley. Towering redwood ramparts, twin watchtowers with red heraldic banners, and an arched gateway.',
    cost: { coins: 1400, wood: { birch: 160, redwood: 180 }, planks: 250 },
    perks: ['Unlocks Mystic Ironwood trees', 'Auto-sawmill passive conversion', 'Max 12 hired workers', 'Storage cap: 7,500 logs'],
    maxWorkerSlots: 12,
    storageCap: 7500,
    unlockedWoods: ['pine', 'oak', 'birch', 'redwood', 'ironwood'],
    visualTheme: 'chateau',
  },
  {
    level: 5,
    name: 'Imperial Sovereign Palace',
    title: 'Grand Palace of the Forest',
    tagline: 'The magnificent royal palace of the sovereign realm',
    description: 'An awe-inspiring imperial palace built from carved white marble and mystic ironwood. Golden cupola domes, royal spires, heraldic gold banners, and enchanted crystal rose windows.',
    cost: { coins: 4000, wood: { redwood: 250, ironwood: 250 }, planks: 600 },
    perks: ['All workers chop 2x faster', 'Double amber drop rate', 'Max 18 hired workers', 'Storage cap: 20,000 logs'],
    maxWorkerSlots: 18,
    storageCap: 20000,
    unlockedWoods: ['pine', 'oak', 'birch', 'redwood', 'ironwood'],
    visualTheme: 'palace',
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
  monstersKilled?: number;
  playerDeaths?: number;
}

// Forest Obstacles
export type ObstacleType = 'boulder' | 'fallen_log' | 'bramble' | 'monolith';

export interface ForestObstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  radius: number;
  width?: number;
  height?: number;
  rotation?: number;
  label?: string;
}

// Wild Animals and Monsters
export type AnimalMonsterType = 'wild_boar' | 'dire_wolf' | 'grizzly_bear' | 'shadow_drake';

export interface AnimalMonsterDefinition {
  type: AnimalMonsterType;
  name: string;
  tier: number;
  maxHp: number;
  attackPower: number;
  speed: number;
  aggroRadius: number;
  attackRadius: number;
  attackCooldownMs: number;
  goldReward: number; // Gold earned upon defeat (varies by monster strength)
  color: string;
  accentColor: string;
  icon: string;
  biomeHint: string;
  description: string;
}

export const ANIMAL_DEFINITIONS: Record<AnimalMonsterType, AnimalMonsterDefinition> = {
  wild_boar: {
    type: 'wild_boar',
    name: 'Wild Razorback Boar',
    tier: 1,
    maxHp: 24,
    attackPower: 8,
    speed: 110,
    aggroRadius: 135,
    attackRadius: 42,
    attackCooldownMs: 1200,
    goldReward: 10, // Base monster drops 10 gold
    color: '#78350f',
    accentColor: '#fbbf24',
    icon: '🐗',
    biomeHint: 'Whispering Pines',
    description: 'A territorial wild pig armed with curved razor tusks. Quick to charge at encroaching woodcutters.',
  },
  dire_wolf: {
    type: 'dire_wolf',
    name: 'Timber Direwolf',
    tier: 2,
    maxHp: 48,
    attackPower: 14,
    speed: 135,
    aggroRadius: 160,
    attackRadius: 44,
    attackCooldownMs: 1000,
    goldReward: 18, // Medium monster drops 18 gold
    color: '#64748b',
    accentColor: '#38bdf8',
    icon: '🐺',
    biomeHint: 'Oak & Birch Glades',
    description: 'A stealthy predator stalking the shadows of old-growth oak trees. Swift and ferocious bite.',
  },
  grizzly_bear: {
    type: 'grizzly_bear',
    name: 'Ancient Redwood Bear',
    tier: 3,
    maxHp: 90,
    attackPower: 22,
    speed: 95,
    aggroRadius: 150,
    attackRadius: 48,
    attackCooldownMs: 1400,
    goldReward: 32, // Strong monster drops 32 gold
    color: '#451a03',
    accentColor: '#f97316',
    icon: '🐻',
    biomeHint: 'Redwood Valley',
    description: 'A massive brown behemoth with razor claws. Sluggish when calm, but devastating when disturbed.',
  },
  shadow_drake: {
    type: 'shadow_drake',
    name: 'Mystic Forest Drake',
    tier: 4,
    maxHp: 160,
    attackPower: 34,
    speed: 115,
    aggroRadius: 180,
    attackRadius: 52,
    attackCooldownMs: 1300,
    goldReward: 55, // Elite boss monster drops 55 gold
    color: '#581c87',
    accentColor: '#c084fc',
    icon: '🐉',
    biomeHint: 'Mystic Ironwood Sanctum',
    description: 'A primordial winged beast infused with arcane ironwood energy. Rains mystical venom and tail strikes.',
  },
};

export interface AnimalMonster {
  id: string;
  type: AnimalMonsterType;
  x: number;
  y: number;
  spawnX: number;
  spawnY: number;
  currentHp: number;
  maxHp: number;
  facing: 'left' | 'right';
  state: 'idle' | 'patrolling' | 'chasing' | 'attacking' | 'dead';
  isAggro: boolean;
  lastAttackTime: number;
  isHit: boolean;
  patrolTargetX: number;
  patrolTargetY: number;
  deathTimer?: number;
}

export const DEFAULT_OBSTACLES: ForestObstacle[] = [
  // Whispering Pines (NW: 0 to 2200, 0 to 1600)
  { id: 'obs_boulder_1', type: 'boulder', x: 840, y: 760, radius: 42, label: 'Mossy Boulder' },
  { id: 'obs_log_1', type: 'fallen_log', x: 1480, y: 920, radius: 36, width: 110, height: 38, rotation: -18, label: 'Fallen Pine Trunk' },
  { id: 'obs_bramble_1', type: 'bramble', x: 620, y: 1240, radius: 46, label: 'Thorny Briar' },
  { id: 'obs_boulder_2', type: 'boulder', x: 1240, y: 460, radius: 45, label: 'Granite Outcrop' },
  { id: 'obs_log_1b', type: 'fallen_log', x: 880, y: 1400, radius: 36, width: 100, height: 36, rotation: 25, label: 'Mossy Log' },

  // Sturdy Oak Copse (North Center: 1800 to 3400, 0 to 1400)
  { id: 'obs_log_2', type: 'fallen_log', x: 2300, y: 640, radius: 40, width: 120, height: 40, rotation: 12, label: 'Hollow Oak Log' },
  { id: 'obs_boulder_3', type: 'boulder', x: 2960, y: 560, radius: 44, label: 'Weathered Rock' },
  { id: 'obs_bramble_2', type: 'bramble', x: 2440, y: 1100, radius: 48, label: 'Thorny Thicket' },
  { id: 'obs_boulder_3b', type: 'boulder', x: 2050, y: 950, radius: 42, label: 'Ancient Crag' },

  // Silver Birch Glade (NE: 3200 to 5200, 0 to 1700)
  { id: 'obs_boulder_4', type: 'boulder', x: 3840, y: 720, radius: 45, label: 'River Stone' },
  { id: 'obs_log_3', type: 'fallen_log', x: 4520, y: 840, radius: 38, width: 115, height: 38, rotation: -25, label: 'Rotting Birch Log' },
  { id: 'obs_bramble_3', type: 'bramble', x: 3700, y: 1280, radius: 50, label: 'Blackberry Briar' },
  { id: 'obs_boulder_5', type: 'boulder', x: 4680, y: 1300, radius: 48, label: 'Glacial Erratic' },
  { id: 'obs_log_3b', type: 'fallen_log', x: 4200, y: 520, radius: 36, width: 105, height: 36, rotation: 35, label: 'Birch Driftwood' },

  // Ancient Redwood Valley (SE: 3200 to 5200, 2000 to 3600)
  { id: 'obs_log_4', type: 'fallen_log', x: 3700, y: 2440, radius: 52, width: 150, height: 50, rotation: 30, label: 'Colossal Redwood Trunk' },
  { id: 'obs_boulder_6', type: 'boulder', x: 4480, y: 2520, radius: 52, label: 'Ancient Crag' },
  { id: 'obs_bramble_4', type: 'bramble', x: 3440, y: 2920, radius: 48, label: 'Spike Bush' },
  { id: 'obs_boulder_7', type: 'boulder', x: 4560, y: 3000, radius: 50, label: 'Red Sandstone Boulder' },
  { id: 'obs_log_4b', type: 'fallen_log', x: 4050, y: 3150, radius: 48, width: 135, height: 46, rotation: -15, label: 'Hollow Redwood' },

  // Mystic Ironwood Sanctum (SW: 0 to 2200, 2000 to 3600)
  { id: 'obs_monolith_1', type: 'monolith', x: 900, y: 2480, radius: 42, label: 'Runic Pillar' },
  { id: 'obs_monolith_2', type: 'monolith', x: 1560, y: 2960, radius: 44, label: 'Spirited Obelisk' },
  { id: 'obs_boulder_8', type: 'boulder', x: 760, y: 2980, radius: 46, label: 'Iron Ore Deposit' },
  { id: 'obs_bramble_5', type: 'bramble', x: 1440, y: 2420, radius: 46, label: 'Arcane Bramble' },
  { id: 'obs_monolith_3', type: 'monolith', x: 1850, y: 2750, radius: 42, label: 'Runestone Shrine' },
];
