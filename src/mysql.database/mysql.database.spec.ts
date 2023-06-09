import { MysqlDatabase } from './mysql.database';

describe('MysqlDatabase', () => {
  it('should be defined', () => {
    expect(new MysqlDatabase('databaseUrl','3003',
      'databaseUser','databasePassword','databaseName'
    )).toBeDefined();
  });
});
