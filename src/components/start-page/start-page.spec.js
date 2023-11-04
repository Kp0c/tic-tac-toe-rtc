import { StartPage } from './start-page.js';

describe('StartPage component', () => {
  let elem;
  let shadowRoot;

  beforeAll(() => {
    customElements.define('test-component', StartPage);
  });

  beforeEach(() => {
    elem = document.createElement('test-component');
    document.body.appendChild(elem);

    shadowRoot = elem.shadowRoot;
  });

  it('goes to the host page when the host button is clicked', () => {
    const hostButton = shadowRoot.getElementById('host');

    hostButton.click();

    expect(window.location.hash).toEqual('#host');
  });

  it('goes to the guest page when the guest button is clicked', () => {
    const guestButton = shadowRoot.getElementById('guest');

    guestButton.click();

    expect(window.location.hash).toEqual('#guest');
  });
});
