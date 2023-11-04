import template from './host-page.html?raw';
import styles from './host-page.css?inline'
import { BaseComponent } from '../base-component.js';
import { WebRtcService } from '../../services/web-rtc.service.js';

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
   * @type {WebRtcService}
   */
  #webRtcService;

  constructor() {
    super(template, styles);
  }

  /**
   * Set's app state and initializes component
   *
   * @param {AppState} state
   */
  setAppState(state) {
    this.#webRtcService = state.webRtcService;

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

    this.#webRtcService.code$.subscribe((code) => {
      this.#state.hostCode = code;
      this.#render();
    }, {
      signal: this.destroyedSignal,
      pushLatestValue: true
    });

    await this.#webRtcService.startHost();
  }

  async #connect() {
    await this.#webRtcService.setAnswer(this.#state.answerCode);
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
