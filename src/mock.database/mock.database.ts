import { Database } from "../database/database.interface";
import { Animal } from "../animal/animal.interface";
import { AnimalAttributes } from "../animal/animal.attributes";

export class MockDatabase implements Database {
  private animals: Animal[] = [
    {
      type: "dog",
      id: 1,
      age: 3.5,
      name: "moco",
      color: "White",
      attributes: [{ name: "breed", value: "Bulldog" }]
    },
    {
      type: "dog",
      id: 2,
      age: 1,
      name: "Luna",
      color: "Black",
      attributes: [{ name: "breed", value: "Bulldog" }]
    },
    {
      type: "dog",
      id: 3,
      age: 2,
      name: "Catch",
      color: "Brown",
      attributes: [{ name: "breed", value: "Siberian Husky" }]
    },
    {
      type: "dog",
      id: 4,
      age: 1.5,
      name: "Charlie",
      color: "black & white",
      attributes: [{ name: "breed", value: "Chihuahua" }]
    }
  ];

  connect(): Promise<void> {
    return Promise.resolve(undefined);
  }

  createAnimal(animal: Animal): Promise<number> {
    if (!animal.id) {
      let maxIndex = Math.max(...this.animals.map(o => o.id));
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
    return Promise.resolve(undefined);
  }

  getAllAnimals(): Promise<Animal[]> {
    return Promise.resolve(this.animals);
  }

  getAnimalById(id: number): Promise<Animal | null> {
    let animal = this.animals.find(item => item.id === id);
    return Promise.resolve(animal);
  }

  updateAnimal(id: number, animal: Animal): Promise<boolean> {
    let elementIndex = this.animals.findIndex(item => item.id === id);
    let oldAnimal = this.animals[elementIndex];
    this.animals[elementIndex] = { ...oldAnimal, ...animal };
    return Promise.resolve(true);
  }

  findAnimals(searchParams: any): Promise<Animal[]> {
    const result: Animal[] = this.animals.filter((animal) => {
      let isValid = true;
      for (const property in searchParams) {
        if (!property) continue;
        if (typeof searchParams[property] === "string") {
          let value = this.getValueFromAnimal(animal, property);
          if (value == searchParams[property]) {
            isValid = isValid && true;
          } else {
            isValid = isValid && false;
          }
        } else if (typeof searchParams[property] === "object") {
          let value = this.getValueFromAnimal(animal, property);
          if (searchParams[property].gte) {
            isValid = isValid && value >= searchParams[property].gte;
          }
          if (searchParams[property].gt) {
            isValid = isValid && value > searchParams[property].gt;
          }
          if (searchParams[property].lte) {
            isValid = isValid && value <= searchParams[property].lte;
          }
          if (searchParams[property].lt) {
            isValid = isValid && value <= searchParams[property].lt;
          }
          if (searchParams[property].not) {
            isValid = isValid && value != searchParams[property].not;
          }
        }
      }
      return isValid;
    });

    return Promise.resolve(result);
  }

  private getValueFromAnimal(animal: Animal, property: string) {
    let value: string = animal[property];
    if (!value) {
      const attributes: AnimalAttributes[] = animal.attributes.filter(item => item.name === property);
      if (attributes.length !== 0 && attributes[0].value) {
        value = attributes[0].value;
      }
    }
    return value;
  }
}
