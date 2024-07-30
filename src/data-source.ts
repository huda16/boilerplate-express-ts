import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User.js";

export const AppDataSource = new DataSource({
  type: "oracle",
  host: "127.0.0.1",
  username: "root",
  password: "root",
  port: 1539,
  sid: "root",
  serviceName: "FREEPDB1",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
  migrationsTableName: "typeorm_migrations",
  migrationsRun: true,
});
