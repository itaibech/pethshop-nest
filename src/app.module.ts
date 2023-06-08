import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalController } from './animal/animal.controller';

@Module({
  imports: [],
  controllers: [AppController, AnimalController],
  providers: [AppService],
})
export class AppModule {}
