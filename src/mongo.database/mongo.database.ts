import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";
import { MongoClient } from "mongodb";

export class MongoDatabase implements Database {
  private client: MongoClient;

  constructor(private readonly databaseUrl: string) {
    this.client = new MongoClient(databaseUrl);
  }

  async connect(): Promise<void> {
    await this.client.connect();
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
