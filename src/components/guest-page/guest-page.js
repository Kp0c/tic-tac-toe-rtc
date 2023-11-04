import template from './guest-page.html?raw';
import styles from './guest-page.css?inline'
import { BaseComponent } from '../base-component.js';


/**
 * Represents a UserProfile component state.js.
 * @class
 */
class State {
  /**
   * Host code
   * @type {string}
   */
  hostCode = '';

  /**
   * Answer code
   * @type {string}
   */
  answerCode = '';
}

export class GuestPage extends BaseComponent {
  /**
   * Represents a component state.js
   *
   * @type {State}
   */
  #state = new State();

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

    this.init().catch(console.error);

    this.#render();
  }

  async init() {
    this.shadowRoot.getElementById('copy-answer').addEventListener('click', () => {
      navigator.clipboard.writeText(this.#state.answerCode);
    }, {
      signal: this.destroyedSignal
    });

    this.shadowRoot.getElementById('host-code').addEventListener('input', (event) => {
      this.#state.hostCode = event.target.value;

      this.#render();
    })

    this.shadowRoot.getElementById('connect-guest').addEventListener('click', () => {
      this.#connect().catch(console.error);
    });

    this.#gameController.code$.subscribe((code) => {
      this.#state.answerCode = code;
      this.#render();
    }, {
      signal: this.destroyedSignal
    });
  }

  async #connect() {
    await this.#gameController.joinViaConnectionCode(this.#state.hostCode);
  }

  #render() {
    const hostCodeInput = this.shadowRoot.getElementById('host-code');
    hostCodeInput.value = this.#state.hostCode;

    const connectButton = this.shadowRoot.getElementById('connect-guest');
    connectButton.disabled = !this.#state.hostCode;

    const answerCodeInput = this.shadowRoot.getElementById('answer-code');
    answerCodeInput.value = this.#state.answerCode;
  }
}
