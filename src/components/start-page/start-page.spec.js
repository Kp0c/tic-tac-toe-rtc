import { StartPage } from './start-page.js';

describe('StartPage component', () => {
  let elem;
  let shadowRoot;

  beforeAll(() => {
    customElements.define('test-component', StartPage);
  })

  beforeEach(() => {
    elem = document.createElement('test-component');
    document.body.appendChild(elem);

    shadowRoot = elem.shadowRoot;
  })

  it('initializes with 0', () => {
    const numberElement = shadowRoot.getElementById('number');

    expect(numberElement.textContent).toEqual('0');
  });

  it('increments the counter when the increment button is clicked', () => {
    const incrementButton = shadowRoot.getElementById('increment');
    const numberElement = shadowRoot.getElementById('number');

    incrementButton.click();

    expect(numberElement.textContent).toEqual('1');
  });

  it('decrements the counter when the decrement button is clicked', () => {
    const decrementButton = shadowRoot.getElementById('decrement');
    const numberElement = shadowRoot.getElementById('number');

    decrementButton.click();

    expect(numberElement.textContent).toEqual('-1');
  });
})
