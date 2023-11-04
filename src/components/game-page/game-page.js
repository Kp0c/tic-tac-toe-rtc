import template from './game-page.html?raw';
import styles from './game-page.css?inline'
import { BaseComponent } from '../base-component.js';
import { CELL_STATE, GAME_STAGE } from '../../enums.js';

export class GamePage extends BaseComponent {
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

    this.#gameController.update$.subscribe(() => {
      this.#render();
    }, {
      signal: this.destroyedSignal,
    });
  }

  #render() {
    if (this.#gameController.gameStage !== GAME_STAGE.STARTED) {
      window.location.hash = '';
    }

    const container = this.shadowRoot.getElementById('game-container');

    container.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const box = document.createElement('div');
      box.classList.add('box');
      box.dataset.index = i.toString();

      const cellState = this.#gameController.gameBoard[i];
      if (cellState === CELL_STATE.Empty) {
        box.addEventListener('click', () => {
          this.#gameController.makeMove(i);
        });

        box.classList.add('available');
      } else if (cellState === CELL_STATE.O) {
        box.classList.add('o');
      } else if (cellState === CELL_STATE.X) {
        box.classList.add('x');
      }

      container.appendChild(box);
    }
  }
}
