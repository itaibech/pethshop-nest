import { Test, TestingModule } from '@nestjs/testing';
import { AnimalController } from './animal.controller';
import { DatabaseService } from "../database/database.service";
import { AppService } from "../app.service";

describe('AnimalController', () => {
  let controller: AnimalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalController],
      providers:[DatabaseService,AppService]
    }).compile();

    controller = module.get<AnimalController>(AnimalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
