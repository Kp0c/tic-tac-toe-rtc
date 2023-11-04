import template from './finish-page.html?raw';
import styles from './finish-page.css?inline'
import { BaseComponent } from '../base-component.js';
import { GAME_RESULT, GAME_STAGE } from '../../enums.js';

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

    this.#render();
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
  }
}
