import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalController } from './animal/animal.controller';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [],
  controllers: [AppController, AnimalController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
