import template from './game-page.html?raw';
import styles from './game-page.css?inline'
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

export class GamePage extends BaseComponent {
  /**
   * Represents a component state.js
   *
   * @type {State}
   */
  #state = new State();

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
  }
}
