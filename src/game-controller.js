import { WebRtcService } from './services/web-rtc.service.js';
import { CELL_STATE, GAME_STAGE, ROLE } from './enums.js';
import { Observable } from './helpers/observable.js';

export class GameController {
  myRole = ROLE.HOST;

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

  turn = ROLE.HOST;

  /**
   * Game stage
   * @type {number}
   */
  gameStage = GAME_STAGE.NONE;

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
   *
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
      this.errors$.next(error);
    });

    this.#webRtcService.messages$.subscribe((message) => {
      if (message.type === 'move') {
        this.markMove(message.index, this.myRole === ROLE.HOST ? ROLE.GUEST : ROLE.HOST);
      }
    });
  }

  async startHost() {
    await this.#webRtcService.startHost();

    this.myRole = ROLE.HOST;
  }

  async setAnswerCode(answerCode) {
    await this.#webRtcService.setAnswer(answerCode);
  }

  async joinViaConnectionCode(connectionCode) {
    await this.#webRtcService.joinViaConnectionCode(connectionCode);

    this.myRole = ROLE.GUEST;
  }

  initGame() {
    this.gameBoard = Array(9).fill(0);
    this.gameStage = GAME_STAGE.STARTED;

    window.location.hash = '#game';
  }

  makeMove(index) {
    this.markMove(index, this.myRole);

    this.#webRtcService.sendMessage({
      type: 'move',
      index,
    });
  }

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
    this.update$.next();

    return true;
  }
}
