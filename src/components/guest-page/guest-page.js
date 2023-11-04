import template from './guest-page.html?raw';
import styles from './guest-page.css?inline'
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

export class GuestPage extends BaseComponent {
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

    this.#webRtcService.code$.subscribe((code) => {
      this.#state.answerCode = code;
      this.#render();
    }, {
      signal: this.destroyedSignal
    });
  }

  async #connect() {
    await this.#webRtcService.tryToJoinViaConnectionCode(this.#state.hostCode);
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
