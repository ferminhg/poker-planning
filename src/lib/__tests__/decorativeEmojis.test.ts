import { DECORATIVE_EMOJIS, getEmojiForRoom } from '../decorativeEmojis';

describe('decorativeEmojis', () => {
  describe('DECORATIVE_EMOJIS', () => {
    it('contains fun/troll emojis', () => {
      expect(DECORATIVE_EMOJIS).toContain('🐙');
      expect(DECORATIVE_EMOJIS).toContain('🍮');
      expect(DECORATIVE_EMOJIS).toContain('🦑');
      expect(DECORATIVE_EMOJIS.length).toBeGreaterThan(0);
    });
  });

  describe('getEmojiForRoom', () => {
    it('returns an emoji from the set', () => {
      const emoji = getEmojiForRoom('abc123');
      expect(DECORATIVE_EMOJIS).toContain(emoji);
    });

    it('is deterministic - same roomId returns same emoji', () => {
      const emoji1 = getEmojiForRoom('room-42');
      const emoji2 = getEmojiForRoom('room-42');
      expect(emoji1).toBe(emoji2);
    });

    it('different roomIds can return different emojis', () => {
      const emojis = new Set<string>();
      for (let i = 0; i < 50; i++) {
        emojis.add(getEmojiForRoom(`room-${i}`));
      }
      expect(emojis.size).toBeGreaterThan(1);
    });

    it('handles empty string', () => {
      const emoji = getEmojiForRoom('');
      expect(DECORATIVE_EMOJIS).toContain(emoji);
    });
  });
});
