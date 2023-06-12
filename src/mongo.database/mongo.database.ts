import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";
import { Collection, Db, Filter, MongoClient, ObjectId } from "mongodb";
import { Utils } from "../utils/utils";

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

  async findAnimals(searchParams: any, orderBy: string, direction: string): Promise<Animal[]> {
    let filter: Filter<any> = {};

    for (const property in searchParams) {
      let isSimpleProperty: boolean = Utils.isSimpleProperty(property);
      if (searchParams.hasOwnProperty(property)) {
        if (typeof searchParams[property] === "string") {
          filter = MongoDatabase.createQueryByType(isSimpleProperty, filter, property, searchParams[property], "=");
        } else if (typeof searchParams[property] === "object") {
          if (searchParams[property].gte) {
            filter = MongoDatabase.createQueryByType(isSimpleProperty, filter, property, searchParams[property].gte, "$gte");
          }
          if (searchParams[property].gt) {
            filter = MongoDatabase.createQueryByType(isSimpleProperty, filter, property, searchParams[property].gt, "$gt");
          }
          if (searchParams[property].lte) {
            filter = MongoDatabase.createQueryByType(isSimpleProperty, filter, property, searchParams[property].lte, "$lte");
          }
          if (searchParams[property].lt) {
            filter = MongoDatabase.createQueryByType(isSimpleProperty, filter, property, searchParams[property].lt, "$lt");
          }
          if (searchParams[property].not) {
            filter = MongoDatabase.createQueryByType(isSimpleProperty, filter, property, searchParams[property].not, "$ne");
          }
        }
      }
    }
    try {
      let animals = [];
      if (orderBy && direction && !Utils.isSimpleProperty(orderBy)) {
        animals = await this.findAndSortByAttributes(orderBy, direction, filter);
      } else {
        animals = await this.findAndSortIfNeeded(orderBy, direction, filter);
      }
      return Promise.resolve(animals);
    } catch (err) {
      console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
  }

  private async findAndSortByAttributes(orderBy: string, direction: string, filter: any) {
    let directionNumber: number = direction === "ASC" ? 1 : -1;
    let orderByValue: string = `${orderBy}.value`;
    const pipeline = [
      {
        $match: filter

      },
      {
        $addFields: {
          breed: {
            $filter: {
              input: "$attributes",
              cond: { $eq: ["$$this.name", orderBy] }
            }
          }
        }
      },
      {
        $sort: { [orderByValue]: directionNumber }
      }
    ];
    return (await this.collection.aggregate(pipeline).toArray()) as Animal[];
  }

  private async findAndSortIfNeeded(orderBy: string, direction: string, filter: any) {
    if (orderBy && direction) {
      let sortQuery: any = {};
      if (direction === "ASC") {
        sortQuery = { [orderBy]: 1 }; // Sort by field in ascending order
      } else {
        sortQuery = { [orderBy]: -1 }; // Sort by field in descending order
      }
      return (await this.collection.find(filter).sort(sortQuery).toArray()) as Animal[];
    } else {
      return await this.collection.find(filter).toArray() as Animal[];
    }
  }
  private static createQueryByType(isSimpleProperty: boolean, filter: Filter<any>, property: string, value, sign: string) {

    if (isSimpleProperty) {
      if (sign === "=") {
        filter[property] = Utils.GetNumberOrString(value);
      } else {
        if (!filter[property]) {
          filter[property] = { [sign]: Utils.GetNumberOrString(value) };
        } else {
          filter[property][sign] = Utils.GetNumberOrString(value);
        }
      }
    } else {
      if (sign === "=") {
        filter["attributes"] = { $elemMatch: { name: property, value: value } };
      } else {
        filter["attributes"] = { $elemMatch: { name: property, value: { [sign]: value } } };
      }
    }
    return filter;
  }


}
