import { ItemDef, ItemType } from '../types/game';

export const ITEM_DEFINITIONS: Record<ItemType, ItemDef> = {
  gold_shield: {
    type: 'gold_shield',
    name: {
      es: 'Escudo del León de Oro',
      en: 'Golden Lion Shield',
    },
    category: 'shield',
    rarity: 'regal',
    description: {
      es: 'Escudo heater adornado con el león real dorado rampante.',
      en: 'Heater shield emblazoned with the royal gilded lion rampant.',
    },
  },
  blue_shield: {
    type: 'blue_shield',
    name: {
      es: 'Escudo de la Flor de Lis',
      en: 'Fleur-de-lis Shield',
    },
    category: 'shield',
    rarity: 'rare',
    description: {
      es: 'Escudo de caballero azul con la flor de lis dorada heráldica.',
      en: 'Azure knight shield bearing the golden heraldic fleur-de-lis.',
    },
  },
  red_shield: {
    type: 'red_shield',
    name: {
      es: 'Escudo del Grifo Rojo',
      en: 'Crimson Gryphon Shield',
    },
    category: 'shield',
    rarity: 'common',
    description: {
      es: 'Escudo de campo de batalla carmesí reforzado con borde de hierro.',
      en: 'Crimson battlefield shield reinforced with riveted iron border.',
    },
  },
  knight_helm: {
    type: 'knight_helm',
    name: {
      es: 'Yelmo de Cruzado',
      en: 'Crusader Greathelm',
    },
    category: 'armor',
    rarity: 'rare',
    description: {
      es: 'Yelmo de acero forjado con cruz ocular de latón y hendiduras de ventilación.',
      en: 'Forged steel greathelm with brass ocular cross and ventilation slits.',
    },
  },
  royal_sword: {
    type: 'royal_sword',
    name: {
      es: 'Espada de Caballero',
      en: 'Knight Broadsword',
    },
    category: 'weapon',
    rarity: 'common',
    description: {
      es: 'Hoja de acero templado de doble filo con cruceta dorada.',
      en: 'Double-edged tempered steel blade with gilded crossguard.',
    },
  },
  battle_axe: {
    type: 'battle_axe',
    name: {
      es: 'Hacha de Guerra Doble',
      en: 'Double Battleaxe',
    },
    category: 'weapon',
    rarity: 'rare',
    description: {
      es: 'Pesada hacha de combate con doble hoja y mango de fresno encuadernado en cuero.',
      en: 'Heavy dual-bladed battleaxe with leather-bound ash handle.',
    },
  },
  morningstar: {
    type: 'morningstar',
    name: {
      es: 'Maza de Púas',
      en: 'Spiked Morningstar',
    },
    category: 'weapon',
    rarity: 'common',
    description: {
      es: 'Cabeza esférica de hierro fundido con púas sobre asta de roble anillada.',
      en: 'Cast iron spiked head on a steel-ringed oak shaft.',
    },
  },
  crossbow: {
    type: 'crossbow',
    name: {
      es: 'Ballesta de Asedio',
      en: 'Siege Crossbow',
    },
    category: 'weapon',
    rarity: 'rare',
    description: {
      es: 'Arbalesta de madera noble con arco de acero y mecanismo de disparo de hierro.',
      en: 'Hardwood arbalest with steel prod and iron trigger mechanism.',
    },
  },
  arrow_quiver: {
    type: 'arrow_quiver',
    name: {
      es: 'Carcaj de Flechas',
      en: 'Arrow Quiver',
    },
    category: 'weapon',
    rarity: 'common',
    description: {
      es: 'Carcaj de cuero cosido repleto de flechas con plumas de ganso.',
      en: 'Stitched leather quiver bristling with goose-feather fletched arrows.',
    },
  },
  javelins: {
    type: 'javelins',
    name: {
      es: 'Lanzas de Caza',
      en: 'Hunting Javelins',
    },
    category: 'weapon',
    rarity: 'common',
    description: {
      es: 'Par de lanzas arrojadizas equilibradas con puntas de acero en hoja de laurel.',
      en: 'Pair of balanced throwing spears with leaf-bladed steel heads.',
    },
  },
  mana_potion: {
    type: 'mana_potion',
    name: {
      es: 'Poción de Maná Azul',
      en: 'Azure Mana Potion',
    },
    category: 'potion',
    rarity: 'rare',
    description: {
      es: 'Frasco de elixir cobalto luminiscente destilado de musgo estelar.',
      en: 'Flask of luminescent cobalt elixir distilled from star-moss.',
    },
  },
  health_potion: {
    type: 'health_potion',
    name: {
      es: 'Frasco de Vida Carmesí',
      en: 'Crimson Life Draught',
    },
    category: 'potion',
    rarity: 'common',
    description: {
      es: 'Dulce bebida medicinal elaborada a partir de bayas de raíz de dragón carmesí.',
      en: 'Sweet medicinal draught brewed from crimson dragonroot berries.',
    },
  },
  forest_elixir: {
    type: 'forest_elixir',
    name: {
      es: 'Elixir del Bosque',
      en: 'Forest Elixir',
    },
    category: 'potion',
    rarity: 'common',
    description: {
      es: 'Frasco esmeralda brillante infusionado con rocío de bosques milenarios.',
      en: 'Glowing emerald vial infused with ancient woodland dew.',
    },
  },
  golden_chalice: {
    type: 'golden_chalice',
    name: {
      es: 'Cáliz Real',
      en: 'Royal Golden Chalice',
    },
    category: 'relic',
    rarity: 'regal',
    description: {
      es: 'Cáliz ceremonial de oro grabado engastado con profundos rubíes.',
      en: 'Embossed ceremonial gold goblet studded with deep rubies.',
    },
  },
  royal_crown: {
    type: 'royal_crown',
    name: {
      es: 'Corona del Reino',
      en: 'Crown of the Realm',
    },
    category: 'relic',
    rarity: 'regal',
    description: {
      es: 'Diadema dorada de filigrana transmitida por generaciones de armeros reales.',
      en: 'Filigree golden circlet passed down through generations of armorsmiths.',
    },
  },
  ancient_grimoire: {
    type: 'ancient_grimoire',
    name: {
      es: 'Grimorio Antiguo',
      en: 'Ancient Grimoire',
    },
    category: 'relic',
    rarity: 'rare',
    description: {
      es: 'Pesado libro encuadernado en cuero con pestillo de hierro y esquinas de latón.',
      en: 'Heavy leatherbound spell manual with iron latch and brass corners.',
    },
  },
  iron_gauntlet: {
    type: 'iron_gauntlet',
    name: {
      es: 'Guantelete Articulado',
      en: 'Articulated Gauntlet',
    },
    category: 'armor',
    rarity: 'common',
    description: {
      es: 'Guantelete de placas de acero forjado a mano con agarre soberano.',
      en: 'Hand-hammered steel plate gauntlet offering sovereign grip.',
    },
  },
  hunting_horn: {
    type: 'hunting_horn',
    name: {
      es: 'Cuerno de Batalla',
      en: 'War Horn',
    },
    category: 'relic',
    rarity: 'rare',
    description: {
      es: 'Cuerno de marfil pulido con bandas de latón grabado que resuena en los bosques.',
      en: 'Polished horn with engraved brass bands sounding across the woods.',
    },
  },
};

export const ORDERED_ITEM_KEYS: ItemType[] = [
  'gold_shield',
  'knight_helm',
  'royal_sword',
  'blue_shield',
  'health_potion',
  'battle_axe',
  'mana_potion',
  'arrow_quiver',
  'crossbow',
  'forest_elixir',
  'red_shield',
  'morningstar',
  'javelins',
  'golden_chalice',
  'royal_crown',
  'ancient_grimoire',
  'iron_gauntlet',
  'hunting_horn',
];
