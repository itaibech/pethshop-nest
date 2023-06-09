import { MysqlDatabase } from './mysql.database';

describe('MysqlDatabase', () => {
  it('should be defined', () => {
    expect(new MysqlDatabase()).toBeDefined();
  });
});
