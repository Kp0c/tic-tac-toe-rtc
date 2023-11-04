import { App } from './app.js';
import { StorageService } from '../../services/storage.service.js';

vi.mock('../../services/storage.service.js', () => {
  const StorageService = vi.fn();
  StorageService.prototype.get = vi.fn();
  StorageService.prototype.set = vi.fn();
  StorageService.prototype.remove = vi.fn();

  return { StorageService };
});

describe('App', () => {
  let elem;
  let shadowRoot;
  let storageService;

  beforeAll(() => {
    customElements.define('test-component', App);
  });

  beforeEach(() => {
    storageService = new StorageService();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  function initComponent() {
    elem = document.createElement('test-component');
    document.body.appendChild(elem);

    shadowRoot = elem.shadowRoot;
  }

  describe('initialization', () => {
    it('opens profile page if username is not saved', () => {
      storageService.get.mockReturnValue(null);
      initComponent();

      const userProfile = shadowRoot.querySelector('ttt-user-profile');

      expect(userProfile).not.toBeNull();
    });

    it('opens start page if username is saved', () => {
      storageService.get.mockReturnValue('test');
      initComponent();

      const startPage = shadowRoot.querySelector('ttt-start-page');

      expect(startPage).not.toBeNull();
    });
  });
});
