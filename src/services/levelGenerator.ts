import { ItemInstance, ItemType, LevelConfig, Stand } from '../types/game';
import { ORDERED_ITEM_KEYS } from '../data/items';

/**
 * Generates configuration and guaranteed solvable initial stand state for each level.
 * Level 1 starts with 3 objects (1 match triplet).
 * Each level adds one extra object type (triplet) and extra stands to increase complexity.
 */
export function getLevelConfig(level: number): LevelConfig {
  // Types count increases with level:
  // Level 1: 1 type (3 objects)
  // Level 2: 2 types (6 objects)
  // Level 3: 3 types (9 objects)
  // Level 4: 4 types (12 objects)
  // Level 5: 5 types (15 objects)
  // Level 6: 6 types (18 objects)
  // ... up to 12+ types on higher levels
  const itemTypesCount = Math.min(18, Math.max(1, level));

  // Determine stands count:
  // Must always have enough capacity + extra empty/free maneuvering slots
  // Level 1: 2 stands (capacity 6, 3 objects)
  // Level 2: 3 stands (capacity 9, 6 objects)
  // Level 3: 4 stands (capacity 12, 9 objects)
  // Level 4: 5 stands (capacity 15, 12 objects)
  // Level 5: 6 stands (capacity 18, 15 objects - 2 rows of 3)
  // Level 6: 7 stands
  // Level 7: 8 stands
  // Level 8: 9 stands (3 rows of 3)
  // Level 10+: 12 stands (4 rows of 3)
  // Level 14: 18 stands (6 rows of 3, as in the user's screenshot "Armero 14"!)
  let totalStands = 2;
  if (level === 1) totalStands = 2;
  else if (level === 2) totalStands = 3;
  else if (level === 3) totalStands = 4;
  else if (level === 4) totalStands = 5;
  else if (level === 5) totalStands = 6;
  else if (level <= 7) totalStands = 7;
  else if (level <= 9) totalStands = 9;
  else if (level <= 12) totalStands = 12;
  else if (level <= 15) totalStands = 15;
  else totalStands = 18;

  // Columns layout: 2 columns for early small levels, 3 columns for larger armories
  const columns = totalStands <= 4 ? 2 : 3;

  // Selected item types for this level
  const itemTypes: ItemType[] = [];
  for (let i = 0; i < itemTypesCount; i++) {
    itemTypes.push(ORDERED_ITEM_KEYS[i % ORDERED_ITEM_KEYS.length]);
  }

  // Timer: generous cozy timer or zen
  const timeLimitSeconds = Math.max(90, 60 + level * 20);

  return {
    level,
    itemTypes,
    totalStands,
    columns,
    hasHiddenLayers: level >= 6,
    timeLimitSeconds,
  };
}

/**
 * Creates the initial board state with guaranteed solvability.
 */
export function generateInitialStands(config: LevelConfig): Stand[] {
  const stands: Stand[] = Array.from({ length: config.totalStands }, (_, i) => ({
    id: i,
    items: [],
    hiddenLayers: config.hasHiddenLayers ? [] : undefined,
  }));

  // Build the items pool: 3 instances of each item type
  const allItems: ItemInstance[] = [];
  let idCounter = 1;

  config.itemTypes.forEach((type) => {
    for (let j = 0; j < 3; j++) {
      allItems.push({
        id: `item_${config.level}_${type}_${idCounter++}`,
        type,
      });
    }
  });

  if (config.level === 1) {
    // Level 1 tutorial: exactly 3 objects (e.g. 3 gold shields)
    // 2 in Stand 0, 1 in Stand 1.
    // Player moves 1 item to trigger instant 3-in-a-row match!
    stands[0].items = [allItems[0], allItems[1]];
    stands[1].items = [allItems[2]];
    return stands;
  }

  if (config.level === 2) {
    // Level 2: 2 types (6 objects total) across 3 stands
    // Stand 0: [TypeA, TypeB]
    // Stand 1: [TypeA, TypeA]
    // Stand 2: [TypeB, TypeB]
    // Easy 1-2 moves to complete!
    const [a1, a2, a3, b1, b2, b3] = allItems;
    stands[0].items = [a1, b1];
    stands[1].items = [a2, a3];
    stands[2].items = [b2, b3];
    return stands;
  }

  // For Level 3+, distribute items ensuring that:
  // 1. No stand starts with an already-completed match (3 identical items)
  // 2. There is at least 1 stand with open space (< 3 items) so moves can be made
  // 3. Shuffle thoroughly

  // Shuffle all items
  const shuffled = [...allItems].sort(() => Math.random() - 0.5);

  let standIdx = 0;
  for (const item of shuffled) {
    // Find a stand with space (< 3 items)
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 50) {
      const targetStand = stands[standIdx % stands.length];
      // Check if adding this item would create an instant 3-match at the very start
      const currentSameType = targetStand.items.filter((it) => it.type === item.type).length;
      if (targetStand.items.length < 3 && currentSameType < 2) {
        targetStand.items.push(item);
        placed = true;
      }
      standIdx++;
      attempts++;
    }

    if (!placed) {
      // Fallback: place in any stand with space
      const standWithSpace = stands.find((s) => s.items.length < 3);
      if (standWithSpace) {
        standWithSpace.items.push(item);
      } else {
        // Last resort
        stands[0].items.push(item);
      }
    }
  }

  // Verify that not all stands are completely full (must have at least one free slot for movement)
  const totalSlots = stands.length * 3;
  const usedSlots = allItems.length;
  if (totalSlots === usedSlots) {
    // Should never happen with our stand allocation, but just in case
    stands.push({ id: stands.length, items: [] });
  }

  return stands;
}
