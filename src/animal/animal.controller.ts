import { Controller, Get } from "@nestjs/common";

@Controller('animal')
export class AnimalController {
  @Get()
  findAll(): string {
    return 'This action returns all animals';
  }

}
