import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";
import { Collection, Db, DeleteResult, MongoClient, ObjectId } from "mongodb";

export class MongoDatabase implements Database {
  private client: MongoClient;
  private database: Db;
  private collection: Collection<any>;

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

  async createAnimal(animal: Animal): Promise<any> {
    let result = await this.collection.insertOne(animal);
    return Promise.resolve(result);
  }

  async deleteAnimal(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = { _id: new ObjectId(id) };
      this.collection.deleteOne(query).then(result => {
        resolve(result.acknowledged);
      }).catch((err) => {
        console.error(`Something went wrong trying to delete the documents: ${err}\n`);
        reject(err);
      });
    });
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    return Promise.resolve(undefined);
  }

  async getAllAnimals(): Promise<Animal[]> {
    let animals: Animal[] = null;
    try {
      animals = await this.collection.find().toArray() as Animal[];
      console.log();
    } catch (err) {
      console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
    return Promise.resolve(animals);
  }

  getAnimalById(id: string): Promise<Animal | null> {
    return new Promise((resolve, reject) => {
      const findQuery = { _id: new ObjectId(id) };
      this.collection.findOne(findQuery).then(animal => {
        resolve(animal);
      }).catch((err) => {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
        reject(err);
      });
    });
  }

  updateAnimal(id: string, animal: Animal): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const filter = { _id: new ObjectId(id) };
      this.collection.updateOne(filter, { $set: animal }).then(result => {
        resolve(result.acknowledged);
      }).catch((err) => {
        console.error(`Something went wrong trying to update the documents: ${err}\n`);
        reject(err);
      });
    });
  }

  findAnimals(params: Animal): Promise<Animal[]> {
    return Promise.resolve([]);
  }
}
