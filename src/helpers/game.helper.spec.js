import { GameHelper } from './game.helper.js';

describe('GameHelper', () => {
  describe('tryToGetWinner', () => {
    it('returns 0 if there is no winner', () => {
      const gameState = [
        0, 1, 2,
        2, 2, 1,
        1, 2, 1,
      ];

      expect(GameHelper.tryToGetWinner(gameState)).toBe(0);
    });

    it('returns horizontal winner', () => {
      const gameState = [
        1, 1, 1,
        2, 2, 0,
        1, 2, 0,
      ];

      expect(GameHelper.tryToGetWinner(gameState)).toBe(1);
    });

    it('returns vertical winner', () => {
      const gameState = [
        1, 2, 0,
        1, 2, 0,
        1, 0, 0,
      ];

      expect(GameHelper.tryToGetWinner(gameState)).toBe(1);
    });

    it('returns diagonal winner', () => {
      const gameState = [
        2, 1, 0,
        1, 2, 1,
        0, 0, 2,
      ];

      expect(GameHelper.tryToGetWinner(gameState)).toBe(2);
    });
  });

  describe('areThereAvailableMoves', () => {
    it('returns true if there are available moves', () => {
      const gameState = [
        0, 1, 2,
        2, 2, 1,
        1, 2, 1,
      ];

      expect(GameHelper.areThereAvailableMoves(gameState)).toBe(true);
    });

    it('returns false if there are no available moves', () => {
      const gameState = [
        1, 1, 1,
        2, 2, 1,
        1, 2, 1,
      ];

      expect(GameHelper.areThereAvailableMoves(gameState)).toBe(false);
    });
  });
});
