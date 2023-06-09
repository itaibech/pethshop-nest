import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";
import { Connection, QueryError } from "mysql2";

const mysql = require("mysql");

export class MysqlDatabase implements Database {
  private connection: Connection;

  constructor(private readonly databaseUrl: string,
              private readonly databaseUser: string,
              private readonly databasePassword: string,
              private readonly databaseName: string) {
    this.connection = mysql.createConnection({
      host: databaseUrl,
      user: databaseUser,
      password: databasePassword,
      database: databaseName
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.connect(function(err: QueryError) {
        if (err) {
          return console.error("error: " + err.message);
          reject(err);
        } else {
          console.log("Connected to the MySQL server.");
          resolve();
        }
      });
    });
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

  findAnimals(params: Animal): Promise<Animal[]> {
    return Promise.resolve([]);
  }
}
