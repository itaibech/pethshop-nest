import { Animal } from "../animal/animal.interface";

export interface Database {
  connect: () => Promise<void>;
  getAllAnimals: () => Promise<Animal[]>;
  getAnimalById: (id: string) => Promise<Animal | null>;
  findAnimals: (params: any, orderBy: string, direction: string) => Promise<Animal[]>;
  createAnimal: (animal: Animal) => Promise<number>;
  updateAnimal: (id: string, animal: Animal) => Promise<boolean>;
  deleteAnimal: (id: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
}
