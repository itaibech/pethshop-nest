import { Animal } from "../animal/animal.interface";

export interface Database {
  connect: () => Promise<void>;
  getAllAnimals: () => Promise<Animal[]>;
  getAnimalById: (id: number) => Promise<Animal | null>;
  createAnimal: (animal: Animal) => Promise<number>;
  updateAnimal: (id: number, animal: Animal) => Promise<boolean>;
  deleteAnimal: (id: number) => Promise<boolean>;
  disconnect: () => Promise<void>;
}

