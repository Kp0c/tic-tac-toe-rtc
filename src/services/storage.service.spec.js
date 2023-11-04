import { StorageService } from './storage.service.js';

describe('StorageService', () => {
  let storageService;

  beforeEach(() => {
    localStorage.clear();
    storageService = new StorageService();
  });

  describe('get', () => {
    it('returns the value if it exists', () => {
      const item = { test: 'test' };
      localStorage.setItem('test', JSON.stringify(item));

      const result = storageService.get('test');

      expect(result).toEqual(item);
    });

    it('returns null if the value does not exist', () => {
      const result = storageService.get('test');

      expect(result).toEqual(null);
    });
  });

  describe('set', () => {
    it('sets the value in local storage', () => {
      const item = { test: 'test' };
      storageService.set('test', item);

      const result = localStorage.getItem('test');

      expect(result).toEqual(JSON.stringify(item));
    });
  });

  describe('remove', () => {
    it('removes the value from local storage', () => {
      localStorage.setItem('test', 'test');
      storageService.remove('test');

      const result = localStorage.getItem('test');

      expect(result).toEqual(null);
    });
  });
});
