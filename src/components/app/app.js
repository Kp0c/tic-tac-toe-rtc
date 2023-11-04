import template from './app.html?raw';
import styles from './app.css?inline'
import { BaseComponent } from '../base-component.js';
import { GameController } from '../../game-controller.js';

export class App extends BaseComponent {
  #gameController = new GameController();

  #router = {
    'start': 'ttt-start-page',
    'host': 'ttt-host-page',
    'guest': 'ttt-guest-page',
    'game': 'ttt-game-page',
  }

  constructor() {
    super(template, styles);
  }

  connectedCallback() {
    window.addEventListener('hashchange', () => {
      this.#selectRoute();
    }, {
      signal: this.destroyedSignal,
    });

    this.#selectRoute();
  }

  #selectRoute() {
    const { hash } = window.location;
    const location = hash.replace('#', '');

    const page = this.#router[location];

    if (!page) {
      window.location.hash = 'start';
    }

    const routerSlot = this.shadowRoot.getElementById('router-slot');
    routerSlot.innerHTML = '';
    const element = document.createElement(page);
    routerSlot.appendChild(element);

    // small delay to init component
    setTimeout(() => {
      if (typeof element.setGameController === 'function') {
        element.setGameController(this.#gameController);
      }
    });
  }
}
