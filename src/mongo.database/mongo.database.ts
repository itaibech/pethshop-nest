import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";
import { AppService } from "../app.service";
const { MongoClient } = require("mongodb");

export class MongoDatabase implements Database  {
  constructor(private readonly appService: AppService) {

  }
  async connect(): Promise<void> {
    const client = new MongoClient(this.appService.databaseUrl);
    await client.connect();
    return Promise.resolve(undefined);
  }

  createAnimal(animal: Animal): Promise<number> {

    return Promise.resolve(0);
  }

  deleteAnimal(id: number): Promise<boolean> {
    return Promise.resolve(false);
  }

  disconnect(): Promise<void> {
    return Promise.resolve(undefined);
  }

  getAllAnimals(): Promise<Animal[]> {
    return Promise.resolve([]);
  }

  getAnimalById(id: number): Promise<Animal | null> {
    return Promise.resolve(undefined);
  }

  updateAnimal(id: number, animal: Animal): Promise<boolean> {
    return Promise.resolve(false);
  }
}

