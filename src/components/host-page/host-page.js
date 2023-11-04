import template from './host-page.html?raw';
import styles from './host-page.css?inline'
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

export class HostPage extends BaseComponent {
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
    this.shadowRoot.getElementById('copy-host-code').addEventListener('click', () => {
      navigator.clipboard.writeText(this.#state.hostCode);
    }, {
      signal: this.destroyedSignal
    });

    this.shadowRoot.getElementById('answer-code').addEventListener('input', (event) => {
      this.#state.answerCode = event.target.value;

      this.#render();
    })

    this.shadowRoot.getElementById('connect-host').addEventListener('click', () => {
      this.#connect().catch(console.error);
    });

    this.#gameController.code$.subscribe((code) => {
      this.#state.hostCode = code;
      this.#render();
    }, {
      signal: this.destroyedSignal,
      pushLatestValue: true
    });

    await this.#gameController.startHost();
  }

  async #connect() {
    await this.#gameController.setAnswerCode(this.#state.answerCode);
  }

  #render() {
    const hostCodeInput = this.shadowRoot.getElementById('host-code');
    hostCodeInput.value = this.#state.hostCode;

    const copyHostCodeButton = this.shadowRoot.getElementById('copy-host-code');
    copyHostCodeButton.disabled = !this.#state.hostCode;

    const answerCodeInput = this.shadowRoot.getElementById('answer-code');
    answerCodeInput.value = this.#state.answerCode;
    answerCodeInput.disabled = !this.#state.hostCode;

    const connectButton = this.shadowRoot.getElementById('connect-host');
    connectButton.disabled = !this.#state.hostCode || !this.#state.answerCode;
  }
}
