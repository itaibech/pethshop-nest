import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { Animal } from "./animal.interface";

@Controller("animal")
export class AnimalController {
  constructor(private readonly databaseService: DatabaseService) {

  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAnimals(): Promise<Animal[]> {
    return this.databaseService.getAllAnimals();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOneAnimal(@Param("id") id: string): Promise<Animal> {
    return this.databaseService.getAnimalById(Number(id));
  }

  @Post()
  @HttpCode(204)
  create(@Body() newAnimal: Animal) {
    return this.databaseService.createAnimal(newAnimal);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updatedAnimal: Animal) {
    return this.databaseService.updateAnimal(Number(id), updatedAnimal);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.databaseService.deleteAnimal(Number(id));
  }
}
