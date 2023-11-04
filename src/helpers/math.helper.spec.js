import { MathHelper } from './math.helper.js';

describe('MathHelper', () => {
  describe('increment', () => {
    it('increments the number', () => {
      const result = MathHelper.increment(10);

      expect(result).toEqual(11);
    })
  });
});
