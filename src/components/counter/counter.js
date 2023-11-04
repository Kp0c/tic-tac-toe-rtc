import template from './counter.html?raw';
import styles from './counter.css?inline'
import { BaseComponent } from '../base-component.js';
import { MathHelper } from '../../helpers/math.helper.js';

/**
 * Represents a StartPage component state.
 * @class
 */
class State {
  /**
   * Represents a counter variable.
   * @type {number}
   */
  counter;

  constructor() {
    this.counter = 0;
  }
}

export class Counter extends BaseComponent {
  /**
   * Represents a component state
   *
   * @type {State}
   */
  #state = new State();

  /**
   * Represents a numeric element.
   *
   * @type {HTMLElement}
   */
  #numberElement;

  constructor() {
    super(template, styles);

    this.#numberElement = this.shadowRoot.getElementById('number');
    this.#setupDecrement();
    this.#setupIncrement();


    this.#render();
  }

  /**
   * Sets up the decrement functionality for the counter.
   * Decrements the counter by 1 when the 'decrement' element is clicked.
   *
   * @private
   */
  #setupDecrement() {
    this.shadowRoot.getElementById('decrement').addEventListener('click', () => {
      this.#state.counter--;

      this.#render();
    }, {
      signal: this.destroyedSignal
    });
  }

  /**
   * Sets up the increment functionality for the counter.
   * Increments the counter by 1 when the 'increment' element is clicked.
   *
   * @private
   */
  #setupIncrement() {
    this.shadowRoot.getElementById('increment').addEventListener('click', () => {
      this.#state.counter = MathHelper.increment(this.#state.counter);

      this.#render();
    }, {
      signal: this.destroyedSignal
    });
  }

  /**
   * Renders the component
   */
  #render() {
    this.#numberElement.innerText = this.#state.counter;
  }
}
