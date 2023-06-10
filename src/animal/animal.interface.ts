import { AnimalAttributes } from "./animal.attributes";

export interface Animal {
  type: string;
  id: number;
  name: string;
  age: number;
  color: string;
  attributes: AnimalAttributes[];
}
