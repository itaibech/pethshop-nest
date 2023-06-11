import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { Animal } from "./animal.interface";

@Controller("animal")
export class AnimalController {
  constructor(private readonly databaseService: DatabaseService) {

  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAnimals(@Query() params: Animal): Promise<Animal[]> {
    if (params && Object.keys(params).length !== 0) {
      return this.databaseService.findAnimals(params);
    } else {
      return this.databaseService.getAllAnimals();
    }
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getAnimalById(@Param("id") id: string): Promise<Animal> {
    return this.databaseService.getAnimalById(id);
  }

  @Post()
  @HttpCode(204)
  create(@Body() newAnimal: Animal) {
    return this.databaseService.createAnimal(newAnimal);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updatedAnimal: Animal) {
    return this.databaseService.updateAnimal(id, updatedAnimal);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.databaseService.deleteAnimal(id);
  }
}
