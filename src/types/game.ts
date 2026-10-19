export type Language = 'es' | 'en';

export type ItemType =
  | 'gold_shield'
  | 'blue_shield'
  | 'red_shield'
  | 'knight_helm'
  | 'royal_sword'
  | 'battle_axe'
  | 'morningstar'
  | 'crossbow'
  | 'arrow_quiver'
  | 'javelins'
  | 'mana_potion'
  | 'health_potion'
  | 'forest_elixir'
  | 'golden_chalice'
  | 'royal_crown'
  | 'ancient_grimoire'
  | 'iron_gauntlet'
  | 'hunting_horn';

export interface ItemDef {
  type: ItemType;
  name: {
    es: string;
    en: string;
  };
  category: 'shield' | 'weapon' | 'potion' | 'armor' | 'relic';
  rarity: 'common' | 'rare' | 'regal';
  description: {
    es: string;
    en: string;
  };
}

export interface ItemInstance {
  id: string;
  type: ItemType;
}

export interface Stand {
  id: number;
  // Items currently visible in the front slot (up to 3 items)
  items: ItemInstance[];
  // Hidden items waiting behind on deeper levels (max capacity: 3 per layer)
  hiddenLayers?: ItemInstance[][];
}

export type GameScreen =
  | 'TITLE_MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'LEVEL_COMPLETE'
  | 'LEVEL_SELECT';

export interface LevelConfig {
  level: number;
  itemTypes: ItemType[];
  totalStands: number;
  columns: number;
  hasHiddenLayers: boolean;
  timeLimitSeconds: number;
}
