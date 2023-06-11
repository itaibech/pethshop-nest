<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
# Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# How to work with the API

## Definitions in file environment.env

environment file for mySQL
```bash
# API
API_TOKEN=myUniqueApiToken

#Database Type 
DATABASE_TYPE=mySQL
# Database
DATABASE_NAME=sql12624569
DATABASE_PORT=3306
COLLECTION_NAME=animalsCollection
DATABASE_URL=sql12.freesqldatabase.com
DATABASE_USER=xxxxx
DATABASE_PASSWORD=xxxx
```
environment file for mongoDB

```bash
# API
API_TOKEN=myUniqueApiToken

#Database Type
DATABASE_TYPE=mongoDb
# Database
DATABASE_NAME=Petshop_store_database
DATABASE_PORT=3306
COLLECTION_NAME=Animals
DATABASE_URL=mongodb+srv://xxx:xxx@cluster0.zyujh4k.mongodb.net/?retryWrites=true&w=majority
DATABASE_USER=xxxxx
DATABASE_PASSWORD=xxxx
```

## Adding a new dog 

send POST Request with postman use this data
```bash
POST http://localhost:3000/animal
```
Body

```bash
{
    "type": "dog",
    "age": 3.5,
    "name": "moco",
    "color": "White",
    "attributes":[{"name":"breed","value":"Bulldog"}]
}
```
Updating an existing Dog

```bash
PUT http://localhost:3000/animal/3
```
BODY
```bash
 {
  "type": "dog",
  "age": 4,
  "name": "updatedName",
  "color": "updatedColor",
  "attributes":[{"name":"breed","value":"updatedBreed"}]
  }
```
delete an existing dog

```bash
DELETE http://localhost:3000/animal/3
```

Get all dogs in the shop

```bash
GET http://localhost:3000/animal
```

Find a dogs which age = 2

```bash
GET http://localhost:3000/animal?type=dog&age=2
```
Find a dogs which age >= 2 and <=10

```bash
GET http://localhost:3000/animal?type=dog&age[gte]=2&age[lte]=10
```
Find a dogs which age >= 2 and <=5 and breed is not Bulldog

```bash
GET http://localhost:3000/animal?type=dog&age[gte]=2&age[lte]=5&breed[not]=Bulldog
```
Find a dogs which age > 1 and < 4 and breed is not Bulldog

```bash
GET http://localhost:3000/animal?type=dog&age[gt]=1&age[lt]=4&breed[not]=Bulldog
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Itai Bechor](itai.bechor@gmail.com)
- LinkedIn - (https://www.linkedin.com/in/itaibechor/)

## License

Nest is [MIT licensed](LICENSE).
Pet shop is [MIT licensed](LICENSE).
