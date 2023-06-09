import { Injectable } from "@nestjs/common";
import { AppService } from "../app.service";
import { Animal } from "../animal/animal.interface";
import { Database } from "./database.interface";
import { MongoDatabase } from "../mongo.database/mongo.database";
import { MysqlDatabase } from "../mysql.database/mysql.database";
import { MockDatabase } from "../mock.database/mock.database";

@Injectable()
export class DatabaseService {
  private database: Database;
  private readonly databaseType: string;
  private readonly databaseUrl: string;
  private readonly collectionName: string;
  private readonly databaseName: string;
  private readonly databaseUser: string;
  private readonly databasePassword: string;

  constructor(private readonly appService: AppService) {
    this.databaseType = appService.environment.parsed["DATABASE_TYPE"];
    this.databaseUrl = appService.environment.parsed["DATABASE_URL"];
    this.databaseName = appService.environment.parsed["DATABASE_NAME"];
    this.collectionName = appService.environment.parsed["COLLECTION_NAME"];
    this.databaseUser = appService.environment.parsed["DATABASE_USER"];
    this.databasePassword = appService.environment.parsed["DATABASE_PASSWORD"];

    if (this.databaseType === "mongoDB") {
      this.database = new MongoDatabase(this.databaseUrl,
        this.databaseName,
        this.collectionName);
    } else if (this.databaseType === "mySQL") {
      this.database = new MysqlDatabase(this.databaseUrl,
        this.databaseUser, this.databasePassword, this.databaseName);
    } else if (this.databaseType === "mockDB") {
      this.database = new MockDatabase();
    }
  }

  connect(): Promise<void> {
    return this.database.connect();
  }

  getAllAnimals(): Promise<Animal[]> {
    return this.database.getAllAnimals();
  }

  getAnimalById(id: number): Promise<Animal | null> {
    return this.database.getAnimalById(id);
  }

  createAnimal(animal: Animal): Promise<number> {
    return this.database.createAnimal(animal);
  }

  updateAnimal(id: number, animal: Animal): Promise<boolean> {
    return this.database.updateAnimal(id, animal);
  }

  deleteAnimal(id: number): Promise<boolean> {
    return this.database.deleteAnimal(id);  }

  disconnect(): Promise<void> {
    return this.database.disconnect();
  }
  async onModuleDestroy() {
    await this.disconnect()
  }
}
