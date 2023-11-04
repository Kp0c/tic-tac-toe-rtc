import template from './app.html?raw';
import styles from './app.css?inline'
import { BaseComponent } from '../base-component.js';
import { WebRtcService } from '../../services/web-rtc.service.js';

export class App extends BaseComponent {
  constructor() {
    super(template, styles);

    const webRtc = new WebRtcService();
    this.shadowRoot.getElementById('create')
      .addEventListener('click', () => {
        webRtc.createConnectionCode();
      }, {
        signal: this.destroyedSignal,
      });

    this.shadowRoot.getElementById('join')
      .addEventListener('click', () => {
        const code = this.shadowRoot.getElementById('code').value;

        console.log('trying to join via code', code);
        webRtc.tryToJoinViaConnectionCode(code);
      }, {
        signal: this.destroyedSignal,
      });

    this.shadowRoot.getElementById('answer')
      .addEventListener('click', () => {
        const answer = this.shadowRoot.getElementById('code').value;

        console.log('Set answer', answer);
        webRtc.setAnswer(answer);
      });

    this.shadowRoot.getElementById('msg')
      .addEventListener('click', () => {
        console.log('sending message');

        const message = this.shadowRoot.getElementById('code').value;
        webRtc.sendMessage(message);
      });
  }
}
