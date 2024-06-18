// import "reflect-metadata";
// import { DataSource } from "typeorm";
// import { UserRegistration } from "./entity/user.entity";
// import { Post } from "./entity/posts.entity";
require("dotenv").config();
require("reflect-metadata");
const { DataSource } = require("typeorm");
const { UserRegistration } = require("./entity/user.entity");
const { Post } = require("./entity/posts.entity");

console.log(process.env.DB_NAME);

export const db = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "pinterest_backend",
  synchronize: true,
  logging: false,
  entities: [UserRegistration, Post],
  subscribers: [],
  migrations: [],
});
