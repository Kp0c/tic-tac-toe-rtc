import template from './finish-page.html?raw';
import styles from './finish-page.css?inline'
import { BaseComponent } from '../base-component.js';
import { GAME_RESULT, GAME_STAGE, ROLE } from '../../enums.js';

export class FinishPage extends BaseComponent {
  /**
   * @type {GameController}
   */
  #gameController;

  constructor() {
    super(template, styles);
  }

  /**
   * Set's game controller and initializes component
   *
   * @param {GameController} gameController
   */
  setGameController(gameController) {
    this.#gameController = gameController;

    this.#init();
    this.#render();
  }

  #init() {
    this.shadowRoot.getElementById('play-again').addEventListener('click', () => {
      this.#gameController.playAgain();
    }, {
      signal: this.destroyedSignal,
    });

    this.#gameController.update$.subscribe(() => {
      this.#render();
    }, {
      signal: this.destroyedSignal,
    });
  }

  #render() {
    if (this.#gameController.gameStage !== GAME_STAGE.FINISHED) {
      window.location.hash = '';
      return;
    }

    const messageEl = this.shadowRoot.getElementById('message');

    const gameResult = this.#gameController.getGameResult();

    if (gameResult === GAME_RESULT.WIN) {
      messageEl.textContent = 'You won!';
    } else if (gameResult === GAME_RESULT.LOSE) {
      messageEl.textContent = 'You lost!';
    } else {
      messageEl.textContent = 'Draw!';
    }

    const isCurrentPlayerReady = this.#gameController.playAgainAgreedRoles.includes(this.#gameController.myRole);
    if (isCurrentPlayerReady) {
      this.shadowRoot.getElementById('play-again').hidden = true;
      this.shadowRoot.getElementById('waiting').hidden = false;
    }

    const opponentRole = this.#gameController.myRole === ROLE.HOST ? ROLE.GUEST : ROLE.HOST;
    const isOpponentReady = this.#gameController.playAgainAgreedRoles.includes(opponentRole);
    if (isOpponentReady) {
      this.shadowRoot.getElementById('play-again-message').hidden = false;
    }
  }
}
