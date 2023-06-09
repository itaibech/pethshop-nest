import { MockDatabase } from './mock.database';

describe('MockDatabase', () => {
  it('should be defined', () => {
    expect(new MockDatabase()).toBeDefined();
  });
});
