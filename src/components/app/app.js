import template from './app.html?raw';
import styles from './app.css?inline'
import { BaseComponent } from '../base-component.js';
import { AppState } from '../../app-state.js';

export class App extends BaseComponent {
  #state = new AppState();

  #router = {
    'start': 'ttt-start-page',
    'host': 'ttt-host-page',
    'guest': 'ttt-guest-page',
    'game': 'ttt-game-page',
  }

  constructor() {
    super(template, styles);

    this.#state.webRtcService.connectionState$.subscribe((state) => {
      if (state === 'connected') {
        window.location.hash = 'game';
      }
    }, {
      signal: this.destroyedSignal
    });
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
      console.log(element.setAppState);
      if (typeof element.setAppState === 'function') {
        element.setAppState(this.#state);
      }
    });
  }
}
