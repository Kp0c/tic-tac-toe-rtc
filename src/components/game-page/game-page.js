import template from './game-page.html?raw';
import styles from './game-page.css?inline'
import { BaseComponent } from '../base-component.js';
import { CELL_STATE, GAME_STAGE, ROLE } from '../../enums.js';

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

    const turn = this.shadowRoot.getElementById('turn');
    turn.textContent = this.#gameController.turn === this.#gameController.myRole
      ? 'Your turn'
      : 'Opponent\'s turn';

    const isHost = this.#gameController.myRole === ROLE.HOST;
    if (isHost) {
      this.shadowRoot.getElementById('you-host').hidden = false;
      this.shadowRoot.getElementById('you-guest').hidden = true;
    } else {
      this.shadowRoot.getElementById('you-host').hidden = true;
      this.shadowRoot.getElementById('you-guest').hidden = false;
    }
  }
}
