import template from './start-page.html?raw';
import styles from './start-page.css?inline'
import { BaseComponent } from '../base-component.js';

export class StartPage extends BaseComponent {
  constructor() {
    super(template, styles);

    this.shadowRoot.getElementById('host')
      .addEventListener('click', () => {
        window.location.hash = '#host';
      }, {
        signal: this.destroyedSignal,
      });

    this.shadowRoot.getElementById('join')
      .addEventListener('click', () => {
        window.location.hash = '#guest';
      }, {
        signal: this.destroyedSignal,
      });
  }
}
