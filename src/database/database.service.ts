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
  private readonly databasePort: string;
  private readonly collectionName: string;
  private readonly databaseName: string;
  private readonly databaseUser: string;
  private readonly databasePassword: string;

  constructor(private readonly appService: AppService) {
    this.databaseType = appService.environment.parsed["DATABASE_TYPE"];
    this.databaseUrl = appService.environment.parsed["DATABASE_URL"];
    this.databasePort = appService.environment.parsed["DATABASE_PORT"];
    this.databaseName = appService.environment.parsed["DATABASE_NAME"];
    this.collectionName = appService.environment.parsed["COLLECTION_NAME"];
    this.databaseUser = appService.environment.parsed["DATABASE_USER"];
    this.databasePassword = appService.environment.parsed["DATABASE_PASSWORD"];

    if (this.databaseType === "mongoDB") {
      this.database = new MongoDatabase(this.databaseUrl,
        this.databaseName,
        this.collectionName);
      this.connect().then(()=> {
        console.log("DatabaseService :: Connected to the mongoDB server.");
      }).catch((err)=>{
        console.error("DatabaseService :: Cannot Connect to mongoDB server." + err);
      });
    } else if (this.databaseType === "mySQL") {
      this.database = new MysqlDatabase(this.databaseUrl,this.databasePort,
        this.databaseUser, this.databasePassword, this.databaseName);
      this.connect().then(()=> {
        console.log("DatabaseService :: Connected to the mySQL server.");
      }).catch(()=>{
        console.error("DatabaseService :: Cannot Connect to mySQL server.");
      });
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

  getAnimalById(id: string): Promise<Animal | null> {
    return this.database.getAnimalById(id);
  }

  createAnimal(animal: Animal): Promise<any> {
    return this.database.createAnimal(animal);
  }

  updateAnimal(id: string, animal: Animal): Promise<boolean> {
    return this.database.updateAnimal(id, animal);
  }

  deleteAnimal(id: string): Promise<boolean> {
    return this.database.deleteAnimal(id);
  }

  disconnect(): Promise<void> {
    return this.database.disconnect();
  }

  findAnimals(searchParams: any): Promise<Animal[]> {
    const { orderBy, direction, ...updatedSearchParams } = searchParams;
    return this.database.findAnimals(updatedSearchParams, orderBy, direction);
  }

  async onModuleDestroy() {
    await this.disconnect();
  }
}
