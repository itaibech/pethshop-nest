import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";

export class MockDatabase implements Database {
  private animals: Animal[] = [
    {
      type: "dog",
      id: 1,
      age: 3.5,
      name: "moco",
      breed: "Bulldog",
      color: "White"
    },
    {
      type: "dog",
      id: 2,
      age: 1,
      name: "Luna",
      breed: "Poodle",
      color: "Black"
    },
    {
      type: "dog",
      id: 3,
      age: 2,
      name: "Catch",
      breed: "Siberian Husky",
      color: "Brown"
    },
    {
      type: "dog",
      id: 4,
      age: 1.5,
      name: "Charlie",
      breed: "Chihuahua",
      color: "black & white"
    }
  ];

  connect(): Promise<void> {
    console.log("connect to mock database");
    return Promise.resolve(undefined);
  }

  createAnimal(animal: Animal): Promise<number> {
    console.log("create animal in mock database");
    if (!animal.id) {
      let maxIndex = Math.max(...this.animals.map(o => o.id))
      animal.id = ++maxIndex;
    }
    this.animals.push(animal);
    return Promise.resolve(0);
  }

  deleteAnimal(id: number): Promise<boolean> {
    console.log("delete animal from mock database");
    this.animals = this.animals.filter(function(obj) {
      return obj.id !== id;
    });
    return Promise.resolve(true);
  }

  disconnect(): Promise<void> {
    console.log("disconnect from mock database");
    return Promise.resolve(undefined);
  }

  getAllAnimals(): Promise<Animal[]> {
    console.log("get all animals from mock database");
    return Promise.resolve(this.animals);
  }

  getAnimalById(id: number): Promise<Animal | null> {
    console.log("get animal by Id from mock database");
    let animal = this.animals.find(item => item.id === id);
    return Promise.resolve(animal);
  }

  updateAnimal(id: number, animal: Animal): Promise<boolean> {
    console.log("update animal by Id from mock database");
    let elementIndex = this.animals.findIndex(item => item.id === id);
    let oldAnimal =  this.animals[elementIndex];
    this.animals[elementIndex] = { ...oldAnimal, ...animal };
    return Promise.resolve(true);
  }

  findAnimals(params: Animal): Promise<Animal[]> {
    let result: Animal[] = this.animals.filter((obj) => {
      for (const key in params) {
        if (params.hasOwnProperty(key) && obj[key] != params[key]) {
          return false;
        }
      }
      return true;
    });
    return Promise.resolve(result);
  }

}
