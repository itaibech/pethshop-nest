import { MongoDatabase } from './mongo.database';

describe('MongoDatabase', () => {
  it('should be defined', () => {
    expect(new MongoDatabase('mongodb+srv://databaseUrl',
      'databaseName','collectionName')).toBeDefined();
  });
});
