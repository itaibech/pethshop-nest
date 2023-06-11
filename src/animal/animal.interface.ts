import { AnimalAttributes } from "./animal.attributes";

export interface Animal {
  type: string;
  _id: any;
  name: string;
  age: number;
  color: string;
  attributes: AnimalAttributes[];
}
