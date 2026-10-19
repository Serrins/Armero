export interface Friend {
  id: string;
  name: string;
  title: string;
  avatarSeed: number;
  highestLevel: number;
  medals: {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
  };
  addedAt: string;
}

const STORAGE_KEY_FRIENDS = 'armero_friends_v1';

// Initial realm companions
const DEFAULT_FRIENDS: Friend[] = [
  {
    id: 'friend_galahad',
    name: 'Sir Galahad',
    title: 'Campeón Real',
    avatarSeed: 1,
    highestLevel: 16,
    medals: {
      platinum: 2,
      gold: 6,
      silver: 4,
      bronze: 3,
    },
    addedAt: '2026-10-15T12:00:00Z',
  },
  {
    id: 'friend_yvaine',
    name: 'Dame Yvaine',
    title: 'Maestra Forjadora',
    avatarSeed: 2,
    highestLevel: 14,
    medals: {
      platinum: 1,
      gold: 5,
      silver: 5,
      bronze: 2,
    },
    addedAt: '2026-10-16T14:30:00Z',
  },
  {
    id: 'friend_thorin',
    name: 'Thorin Ironbeard',
    title: 'Guardián del Yunque',
    avatarSeed: 3,
    highestLevel: 12,
    medals: {
      platinum: 0,
      gold: 3,
      silver: 6,
      bronze: 3,
    },
    addedAt: '2026-10-17T09:15:00Z',
  },
  {
    id: 'friend_rowan',
    name: 'Rowan Swiftblade',
    title: 'Armero del Bosque',
    avatarSeed: 4,
    highestLevel: 9,
    medals: {
      platinum: 0,
      gold: 1,
      silver: 4,
      bronze: 4,
    },
    addedAt: '2026-10-18T18:00:00Z',
  },
];

export function getFriends(): Friend[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FRIENDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_FRIENDS, JSON.stringify(DEFAULT_FRIENDS));
      return DEFAULT_FRIENDS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FRIENDS;
  }
}

export function saveFriends(friends: Friend[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FRIENDS, JSON.stringify(friends));
  } catch {
    // ignore
  }
}

export function addFriend(
  name: string,
  title?: string
): { success: boolean; errorKey?: string; friend?: Friend } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { success: false, errorKey: 'enterFriendName' };
  }

  const current = getFriends();
  const exists = current.some((f) => f.name.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    return { success: false, errorKey: 'friendAlreadyExists' };
  }

  // Generate deterministic realistic medals based on name string
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  const platinum = posHash % 7 === 0 ? (posHash % 3) : 0;
  const gold = (posHash % 5);
  const silver = (posHash % 6) + 1;
  const bronze = (posHash % 5) + 1;
  const highestLevel = Math.min(18, Math.max(3, 5 + (posHash % 12)));

  const defaultTitles = [
    'Caballero Forjador',
    'Escudero del Valle',
    'Armero Mayor',
    'Defensor del Bastión',
    'Artífice del Roble',
  ];
  const chosenTitle = title || defaultTitles[posHash % defaultTitles.length];

  const newFriend: Friend = {
    id: `friend_${Date.now()}_${posHash}`,
    name: trimmed,
    title: chosenTitle,
    avatarSeed: (posHash % 6) + 1,
    highestLevel,
    medals: {
      platinum,
      gold,
      silver,
      bronze,
    },
    addedAt: new Date().toISOString(),
  };

  const updated = [newFriend, ...current];
  saveFriends(updated);
  return { success: true, friend: newFriend };
}

export function removeFriend(id: string): Friend[] {
  const current = getFriends();
  const updated = current.filter((f) => f.id !== id);
  saveFriends(updated);
  return updated;
}
