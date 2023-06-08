import { Injectable } from "@nestjs/common";
import { DotenvConfigOutput } from "dotenv";

@Injectable()
export class AppService {
  public environment: DotenvConfigOutput;

  constructor() {
    let path = __dirname + "/environment.env";
    console.log("current environment path " + path);
    this.environment = require("dotenv").config({
      path: path
    });

  }

  getHello(): string {
    return "Hello Petshop Store Clients!";
  }
}
