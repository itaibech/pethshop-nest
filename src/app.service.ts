import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public databaseType:string;
  public databaseUrl:string;

  constructor() {
    let environment = require('dotenv').config({path: __dirname + '/environment.env'})
    this.databaseType = environment.parsed['DATABASE_TYPE'];
    this.databaseUrl = environment.parsed['DATABASE_URL'];

  }
  getHello(): string {
    return 'Hello Petshop Store Clients!';
  }
}
