import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";
import { Collection, Db, MongoClient } from "mongodb";

export class MongoDatabase implements Database {
  private client: MongoClient;
  private database: Db;
  private collection: Collection<Animal>;

  constructor(private readonly databaseUrl: string,
              private readonly databaseName: string,
              private readonly collectionName: string) {
    this.client = new MongoClient(databaseUrl);
    this.database = this.client.db(databaseName);
    this.collection = this.database.collection(collectionName);

  }
  async connect(): Promise<void> {
    await this.client.connect();
    return Promise.resolve(undefined);
  }

  async createAnimal(animal: Animal): Promise<number> {
    await this.collection.insertOne(animal);
    return Promise.resolve(0);
  }

  async deleteAnimal(id: number): Promise<boolean> {
    const query = { id: id };
    const result = await this.collection.deleteOne(query);
    return Promise.resolve(false);
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    return Promise.resolve(undefined);
  }

  async getAllAnimals(): Promise<Animal[]> {
    let animals : Animal[] = null;
    try {
      animals = await this.collection.find().toArray() as Animal[];
      console.log();
    } catch (err) {
      console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
    return Promise.resolve(animals);
  }

  async getAnimalById(id: number): Promise<Animal | null> {
    const findQuery = { id: id };
    let animal : Animal = null;
    try {
      animal = await this.collection.findOne(findQuery) as Animal;
      console.log();
    } catch (err) {
      console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
    return Promise.resolve(animal);
  }

  async updateAnimal(id: number, animal: Animal): Promise<boolean> {
    const filter = { id: id };
    let updateResult;
    try {
      updateResult = await this.collection.updateOne(filter, { $set: animal });
    } catch (err) {
      console.error(`Something went wrong trying to update one document: ${err}\n`);
    }
    return Promise.resolve(updateResult);
  }
}
