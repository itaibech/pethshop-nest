import { Injectable } from '@nestjs/common';
import { AppService } from "../app.service";
import { Animal } from "../animal/animal.interface";
import { Database } from "./database.interface";

@Injectable()
export class DatabaseService {

  private database:Database;

  constructor(private readonly appService: AppService) {

  }
  connect: () => Promise<void>;
  getAllAnimals: () => Promise<Animal[]>;
  getAnimalById: (id: number) => Promise<Animal | null>;
  createAnimal: (animal: Animal) => Promise<number>;
  updateAnimal: (id: number, animal: Animal) => Promise<boolean>;
  deleteAnimal: (id: number) => Promise<boolean>;
  disconnect: () => Promise<void>;
}
