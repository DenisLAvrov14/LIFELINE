"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5433),
    username: process.env.DB_USER || 'owner',
    password: process.env.DB_PASSWORD || 'theplayerapp',
    database: process.env.DB_NAME || 'my_todo_project',
    synchronize: false,
    logging: false,
    entities: [__dirname + "/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    console.log("DB_NAME:", process.env.DB_NAME);
    console.log("DB_PORT:", process.env.DB_PORT);
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
