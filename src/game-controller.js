import { WebRtcService } from './services/web-rtc.service.js';
import { CELL_STATE, GAME_RESULT, GAME_STAGE, ROLE } from './enums.js';
import { Observable } from './helpers/observable.js';
import { GameHelper } from './helpers/game.helper.js';

/**
 * Game Controller. Manages the game state
 */
export class GameController {
  /**
   * My role
   * @type {number}
   */
  myRole = ROLE.NONE;

  /**
   * Current Game State
   * The very first element is the left top corner, the last one is the right bottom corner.
   * Here's the index table:
   * 0 1 2
   * 3 4 5
   * 6 7 8
   *
   * @type {number[]}
   */
  gameBoard = [1, 2, 0, 0, 0, 0, 0, 0, 0];

  /**
   * Game sides
   */
  sides = {
    [ROLE.HOST]: CELL_STATE.X,
    [ROLE.GUEST]: CELL_STATE.O,
  }

  /**
   * Current turn
   * @type {number}
   */
  turn = ROLE.HOST;

  /**
   * Game stage
   * @type {number}
   */
  gameStage = GAME_STAGE.NONE;

  /**
   * Shows what roles are ready to play again
   * @type {[]}
   */
  playAgainAgreedRoles = [];

  /**
   * Host/Answer codes
   * @type {Observable<string>}
   */
  code$ = new Observable();

  /**
   * Fires when update received
   *
   * @type {Observable<void>}
   */
  update$ = new Observable();

  /**
   * Fires when error happened
   *
   * @type {Observable<string>}
   */
  errors$ = new Observable();

  /**
   * WebRTC Service
   * @type {WebRtcService}
   */
  #webRtcService = new WebRtcService();

  constructor() {
    this.#webRtcService.code$.subscribe((code) => {
      this.code$.next(code);
    });

    this.#webRtcService.connectionState$.subscribe((state) => {
      if (state === 'connected') {
        this.initGame();
      }
    });

    this.#webRtcService.errors$.subscribe((error) => {
      this.#handleError(error);
    });

    this.#webRtcService.messages$.subscribe((message) => {
      const opponentRole = this.myRole === ROLE.HOST ? ROLE.GUEST : ROLE.HOST;
      if (message.type === 'move') {
        this.markMove(message.index, opponentRole);
      } else if (message.type === 'play-again') {
        this.markPlayAgain(opponentRole);
      } else if (message.type === 'start') {
        this.turn = message.turn;
        this.startGame();
      }
    });
  }

  /**
   * Starts hosting a game
   * @returns {Promise<void>}
   */
  async startHost() {
    await this.#webRtcService.startHost();

    this.myRole = ROLE.HOST;
  }

  /**
   * Sets the answer code provided by the guest.
   *
   * @param {string} answerCode
   * @returns {Promise<void>}
   */
  async setAnswerCode(answerCode) {
    await this.#webRtcService.setAnswer(answerCode);
  }

  /**
   * Joins a game via the connection code provided by the host.
   *
   * @param {string} connectionCode
   * @returns {Promise<void>}
   */
  async joinViaConnectionCode(connectionCode) {
    try {
      await this.#webRtcService.joinViaConnectionCode(connectionCode);

      this.myRole = ROLE.GUEST;
    } catch (err) {
      this.#handleError(err);
    }
  }

  /**
   * Initializes the game. Cleans up the state, randomly selects who goes first
   */
  initGame() {
    this.playAgainAgreedRoles = [];
    this.gameBoard = Array(9).fill(0);
    this.gameStage = GAME_STAGE.STARTED;

    if (this.myRole === ROLE.HOST) {
      // randomly select who goes first
      this.turn = Math.random() > 0.5 ? ROLE.HOST : ROLE.GUEST;

      this.#webRtcService.sendMessage({
        type: 'start',
        turn: this.turn,
      });

      this.startGame();
    }
  }

  /**
   * Starts the game
   */
  startGame() {
    window.location.hash = '#game';
  }

  /**
   * Makes a move
   * @param index
   */
  makeMove(index) {
    const result = this.markMove(index, this.myRole);

    if (result) {
      this.#webRtcService.sendMessage({
        type: 'move',
        index,
      });
    }
  }

  /**
   * Marks move on the board
   * Returns true if move was successful
   *
   * @param {number} index index of the cell
   * @param {number} role role of the player
   * @returns {boolean} returns true if move was successful
   */
  markMove(index, role) {
    if (this.gameStage !== GAME_STAGE.STARTED) {
      this.errors$.next('Game is not started');
      return false;
    }

    if (this.gameBoard[index] !== 0) {
      this.errors$.next('Cell is already filled');
      return false;
    }

    if (this.turn !== role) {
      this.errors$.next('It\'s not your turn');
      return false;
    }

    this.gameBoard[index] = this.sides[role];
    this.turn = this.turn === ROLE.HOST ? ROLE.GUEST : ROLE.HOST;

    const winner = GameHelper.tryToGetWinner(this.gameBoard);
    if (winner || !GameHelper.areThereAvailableMoves(this.gameBoard)) {
      this.gameStage = GAME_STAGE.FINISHED;
      window.location.hash = '#game-over';
      return true;
    }

    this.update$.next();

    return true;
  }

  /**
   * Returns the game winner
   * @returns {number}
   */
  getGameResult() {
    const result = GameHelper.tryToGetWinner(this.gameBoard);

    if (result === CELL_STATE.Empty) {
      return GAME_RESULT.DRAW;
    }

    if (result === this.sides[this.myRole]) {
      return GAME_RESULT.WIN;
    }

    return GAME_RESULT.LOSE;
  }

  /**
   * Requests to play again
   */
  playAgain() {
    this.#webRtcService.sendMessage({
      type: 'play-again',
    });

    this.markPlayAgain(this.myRole);
  }

  /**
   * Marks that the player is ready to play again
   * Starts the game if both players are ready
   *
   * @param role
   */
  markPlayAgain(role) {
    if (!this.playAgainAgreedRoles.includes(role)) {
      this.playAgainAgreedRoles.push(role);
      this.update$.next();
    }

    if (this.playAgainAgreedRoles.length === 2) {
      this.initGame();
    }
  }

  /**
   * Clears the state to prepare for a completely new game (with a new opponent)
   */
  newGame() {
    this.#webRtcService.close();
    this.#webRtcService = new WebRtcService();
    window.location.hash = '';
  }

  /**
   * Handles errors
   * @param error
   */
  #handleError(error) {
    // We cannot proceed when RTCErrorEvent or 'InvalidStateError' happened. It's fatal. So we need to stop the game
    if (error instanceof RTCErrorEvent || error.name === 'InvalidStateError') {
      error = 'Connection error. Please start a new game';
      this.gameStage = GAME_STAGE.NONE;
      this.#webRtcService.close();
      this.#webRtcService = new WebRtcService();

      this.update$.next();
    }
    this.errors$.next(error);
  }
}
