/**
 * Fun emojis for room decoration - random/troll vibes
 */
export const DECORATIVE_EMOJIS = [
  '🐙', // pulpo
  '🍮', // flan
  '🦑', // calamar
  '🦆', // pato
  '🥞', // pancakes
  '🦩', // flamenco
  '🍩', // donut
  '🐸', // rana
  '🥑', // aguacate
  '🦊', // zorro
  '🍕', // pizza
  '🐧', // pingüino
] as const;

export type DecorativeEmoji = (typeof DECORATIVE_EMOJIS)[number];

/**
 * Simple hash function for deterministic emoji selection per room.
 * Same roomId always returns the same emoji.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Returns a decorative emoji for the given room ID.
 * Deterministic: same room always gets the same emoji.
 */
export function getEmojiForRoom(roomId: string): DecorativeEmoji {
  const index = simpleHash(roomId) % DECORATIVE_EMOJIS.length;
  return DECORATIVE_EMOJIS[index];
}
