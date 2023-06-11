import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";
import { Connection, QueryError } from "mysql2";
import { AnimalAttributes } from "../animal/animal.attributes";

const mysql = require("mysql");

export class MysqlDatabase implements Database {
  private connection: Connection;

  constructor(private readonly databaseUrl: string,
              private readonly databasePort: string,
              private readonly databaseUser: string,
              private readonly databasePassword: string,
              private readonly databaseName: string) {
    this.connection = mysql.createConnection({
      host: databaseUrl,
      port: databasePort,
      user: databaseUser,
      password: databasePassword,
      database: databaseName
    });
  }

  async connect(): Promise<void> {
    this.connection.connect(function(err: QueryError) {
      if (err) {
        return console.error("error: " + err.message);
      } else {
        console.log("Connected to the MySQL server.");
      }
    });
    return Promise.resolve();
  }

  createAnimal(animal: Animal): Promise<any> {
    return new Promise((resolve, reject) => {
      let animalId;
      const insertQuery = `INSERT INTO Animals (name, type, color, age)
                           VALUES ('${animal.name}', '${animal.type}', '${animal.color}', ${animal.age})`;

      this.connection.query(insertQuery, (err: QueryError | null, result: any) => {
        if (err) reject(err);
        animalId = result.insertId;
        for (const attribute of animal.attributes) {
          const attributeInsertQuery = `INSERT INTO AnimalAttributes (animal_id, attribute_name, attribute_value)
                                        VALUES (${animalId}, '${attribute.name}', '${attribute.value}')`;
          this.connection.query(attributeInsertQuery, (err: QueryError | null, result: any) => {
            if (err) reject(err);
          });
        }
        resolve(result);
      });
    });
  }


  deleteAnimal(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const deleteAttributeQuery  = `DELETE FROM AnimalAttributes WHERE animal_id = ${id};`;
      const deleteAnimalQuery = `DELETE FROM Animals WHERE _id = ${id}`;
      this.connection.query(deleteAttributeQuery, (err: QueryError | null, result: any) => {
        if (err) reject(err);
        this.connection.query(deleteAnimalQuery, (err: QueryError | null, result: any) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    });
  }

  disconnect(): Promise<void> {
    this.connection.end();
    return Promise.resolve(undefined);
  }
  getAllAnimals(): Promise<Animal[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT a._id, a.name, a.type, a.color, a.age, aa.attribute_name, aa.attribute_value
                     FROM Animals a
                     LEFT JOIN AnimalAttributes aa ON a._id = aa.animal_id`;

      this.connection.query(query, (err: QueryError | null, result: any) => {
        if (err) reject(err);
        const animals = this.mapResultToAnimalsObject(result);
        resolve(animals);
      });
    })
  }

  private mapResultToAnimalsObject(result: any) {
    const animals: Animal[] = [];
    const animalMap = new Map<number, Animal>();
    for (const row of result) {
      const animalId = row._id;
      if (!animalMap.has(animalId)) {
        const animal: Animal = {
          _id: animalId,
          name: row.name,
          type: row.type,
          color: row.color,
          age: row.age,
          attributes: []
        };
        animalMap.set(animalId, animal);
        animals.push(animal);
      }
      if (row.attribute_name && row.attribute_value) {
        const attribute: AnimalAttributes = {
          name: row.attribute_name,
          value: row.attribute_value
        };
        const animal = animalMap.get(animalId);
        animal?.attributes.push(attribute);
      }
    }
    return animals;
  }

  getAnimalById(id: string): Promise<Animal | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT a._id, a.name, a.type, a.color, a.age, aa.attribute_name, aa.attribute_value  
                     FROM Animals a
                     JOIN AnimalAttributes aa ON a._id = aa.animal_id
                     WHERE a._id = ${id}`;
      this.connection.query(query, (err: QueryError | null, result: any) => {
        if (err) reject(err);
        const animals = this.mapResultToAnimalsObject(result);
        resolve(animals[0]);
      });
    })
  }

  updateAnimal(id: string, animal: Animal): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let updateAnimalQuery = `UPDATE Animals SET `;
      const updateAnimalParams: any[] = [];
      if (animal.name) {
        updateAnimalQuery += `name = ?, `;
        updateAnimalParams.push(animal.name);
      }

      if (animal.age) {
        updateAnimalQuery += `age = ?, `;
        updateAnimalParams.push(animal.age);
      }

      if (animal.color) {
        updateAnimalQuery += `color = ?, `;
        updateAnimalParams.push(animal.color);
      }

      // Remove the trailing comma and space
      updateAnimalQuery = updateAnimalQuery.slice(0, -2);
      // Add the WHERE clause for the specific animal ID
      updateAnimalQuery += ` WHERE _id = ?`;
      updateAnimalParams.push(id);
      this.connection.query(updateAnimalQuery, updateAnimalParams, (err: QueryError | null, result: any) => {
        if (err) reject(err);
        this.updateAnimalAttributes(animal, id, reject);
        resolve(result);
      });
    });
  }

  private updateAnimalAttributes(animal: Animal, id: string, reject: (reason?: any) => void) {
    if (animal.attributes) {
      for (const attribute of animal.attributes) {
        const updateAttributeQuery = `UPDATE AnimalAttributes
                                          SET attribute_value = ?
                                          WHERE animal_id = ? AND attribute_name = ?`;

        // Execute the update query for each attribute
        this.connection.query(updateAttributeQuery, [
          attribute.value,
          id,
          attribute.name
        ], (err: QueryError | null, result: any) => {
          if (err) reject(err);
        });
      }
    }
  }
  private isSimpleProperty(property: string) {
    return property === 'type' ||  property === 'name' || property === 'age' || property === 'color';
  }
  findAnimals(searchParams: Animal): Promise<Animal[]> {
    return new Promise((resolve, reject) => {
      let query = `SELECT a._id, a.name, a.type, a.color, a.age ,aa.attribute_name, aa.attribute_value  
                   FROM Animals a
                   JOIN AnimalAttributes aa ON a._id = aa.animal_id
                   WHERE 1=1`;
      const queryParams: any[] = [];

      for (const property in searchParams) {
        let isSimpleProperty:boolean = this.isSimpleProperty(property);
        if (searchParams.hasOwnProperty(property)) {
          if (typeof searchParams[property] === 'string') {
            query = this.createQueryByType(isSimpleProperty, query, property, queryParams, searchParams[property],'=');
          } else if (typeof searchParams[property] === 'object') {
            if (searchParams[property].gte) {
              query = this.createQueryByType(isSimpleProperty, query, property, queryParams, searchParams[property].gte,'>=');
            }
            if (searchParams[property].gt) {
              query = this.createQueryByType(isSimpleProperty, query, property, queryParams, searchParams[property].gt,'>');
            }
            if (searchParams[property].lte) {
              query = this.createQueryByType(isSimpleProperty, query, property, queryParams, searchParams[property].lte,'<=');
            }
            if (searchParams[property].lt) {
              query = this.createQueryByType(isSimpleProperty, query, property, queryParams, searchParams[property].lt,'<');
            }
            if (searchParams[property].not) {
              query = this.createQueryByType(isSimpleProperty, query, property, queryParams, searchParams[property].not,'!=');
            }
          }
        }
      }
      this.connection.query(query, queryParams, (err: QueryError | null, result: any) => {
        if (err) reject(err);
        const animals = this.mapResultToAnimalsObject(result);
        resolve(animals);
      });
    });
  }

  private createQueryByType(isSimpleProperty: boolean, query: string, property: string, queryParams: any[], value, sign: string) {
    if (isSimpleProperty) {
      query += ` AND (a.${property} ${sign} ? )`;
      queryParams.push(value);
    } else {
      query += ` AND (aa.attribute_name = ? AND aa.attribute_value ${sign} ?)`;
      queryParams.push(property, value);
    }
    return query;
  }
}
