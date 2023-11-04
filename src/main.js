import { App } from './components/app/app.js';
import { StartPage } from './components/start-page/start-page.js';
import { HostPage } from './components/host-page/host-page.js';
import { GuestPage } from './components/guest-page/guest-page.js';
import { GamePage } from './components/game-page/game-page.js';

window.customElements.define('ttt-app', App);
window.customElements.define('ttt-start-page', StartPage);
window.customElements.define('ttt-host-page', HostPage);
window.customElements.define('ttt-guest-page', GuestPage);
window.customElements.define('ttt-game-page', GamePage);

