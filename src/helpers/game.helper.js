import { CELL_STATE } from '../enums.js';

export class GameHelper {
  /**
   * Analyzes the game state and returns the winner if any.
   * Grid should be in format:
   * 0 1 2
   * 3 4 5
   * 6 7 8
   *
   * @param {number[]} gameState - The game state.
   * @returns {number} - The winner if any, 0 otherwise.
   */
  static tryToGetWinner(gameState) {
    const winningCombinations = [
      // horizontal
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // vertical
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // diagonal
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (
        gameState[a] !== CELL_STATE.Empty &&
        gameState[a] === gameState[b] &&
        gameState[a] === gameState[c]
      ) {
        return gameState[a];
      }
    }

    return CELL_STATE.Empty;
  }

  /**
   * Returns true if there are available moves. False otherwise.
   *
   * @param {number[]} gameState - The game state.
   * @returns {boolean} - True if there are available moves. False otherwise.
   */
  static areThereAvailableMoves(gameState) {
    return gameState.some((cellState) => cellState === CELL_STATE.Empty);
  }
}
