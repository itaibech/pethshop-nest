import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { AppService } from "../app.service";
import { MongoDatabase } from "../mongo.database/mongo.database";
import { MysqlDatabase } from "../mysql.database/mysql.database";
import { MockDatabase } from "../mock.database/mock.database";
import { Database } from "./database.interface";

describe('DatabaseService', () => {
  let databaseService: DatabaseService;
  let appService: AppService;
  // Create a mock instance of AppService
  const appServiceMock = {
    environment: {
      parsed: {
        DATABASE_TYPE: 'mockDB', // Set the desired database type for testing
        DATABASE_NAME :'myDatabaseName',
        DATABASE_PORT :3306,
        COLLECTION_NAME :'animalsCollection',
        DATABASE_URL :'mockUrl',
        DATABASE_USER :'root',
        DATABASE_PASSWORD :'password'
        // Add other environment variables used in the constructor if needed
      },
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService,
        { provide: AppService, useValue: appServiceMock },],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
    appService = module.get<AppService>(AppService);
  });
  describe('constructor', () => {
    it('should create a MongoDatabase instance if databaseType is "mongoDB"', () => {
      appService.environment.parsed['DATABASE_TYPE'] = 'mongoDB';
      appService.environment.parsed['DATABASE_URL'] = 'mongodb://mockUrl';
      databaseService = new DatabaseService(appService);
      expect(databaseService['database']).toBeInstanceOf(MongoDatabase);
    });

    it('should create a MysqlDatabase instance if databaseType is "mySQL"', () => {
      appService.environment.parsed['DATABASE_TYPE'] = 'mySQL';
      databaseService = new DatabaseService(appService);
      expect(databaseService['database']).toBeInstanceOf(MysqlDatabase);
    });

    it('should create a MockDatabase instance if databaseType is "mockDB"', () => {
      appService.environment.parsed['DATABASE_TYPE'] = 'mockDB';
      databaseService = new DatabaseService(appService);
      expect(databaseService['database']).toBeInstanceOf(MockDatabase);
    });
  });
  describe('getAllAnimals', () => {
    it('should call getAllAnimals method of the underlying database', async () => {
      const mockDatabase: Database = databaseService['database'];
      const getAllAnimalsSpy = jest.spyOn(mockDatabase, 'getAllAnimals');

      await databaseService.getAllAnimals();

      expect(getAllAnimalsSpy).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should call disconnect method of the underlying database', async () => {
      const mockDatabase: Database = databaseService['database'];
      const disconnectSpy = jest.spyOn(mockDatabase, 'disconnect');

      await databaseService.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

});
