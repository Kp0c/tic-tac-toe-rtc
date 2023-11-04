import { GuestPage } from './guest-page.js';
import { Observable } from '../../helpers/observable.js';

describe('GuestPage component', () => {
  let elem;
  let shadowRoot;
  let gameController = vi.fn();
  gameController.code$ = new Observable();

  beforeAll(() => {
    customElements.define('test-component', GuestPage);
  });

  beforeEach(() => {
    elem = document.createElement('test-component');
    document.body.appendChild(elem);

    shadowRoot = elem.shadowRoot;

    elem.setGameController(gameController);
  });

  afterEach(() => {
    vi.resetAllMocks();
  })

  it('disabled the connect button when the host input is empty', () => {
    const connectButton = shadowRoot.getElementById('connect-guest');

    expect(connectButton.disabled).toEqual(true);

    const hostCodeInput = shadowRoot.getElementById('host-code');
    hostCodeInput.value = '123';

    hostCodeInput.dispatchEvent(new Event('input'));

    expect(connectButton.disabled).toEqual(false);
  });

  it('copies the answer code to the clipboard when the copy button is clicked', () => {
    gameController.code$.next('123');

    const copyButton = shadowRoot.getElementById('copy-answer');
    const copySpy = vi.spyOn(navigator.clipboard, 'writeText');

    copyButton.click();

    expect(copySpy).toHaveBeenCalledWith('123');
  });
});
