"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.connection = void 0;
const pg_1 = require("pg");
const db_config_1 = require("../config/db.config");
exports.connection = new pg_1.Pool({
    host: db_config_1.dbConfig.HOST,
    user: db_config_1.dbConfig.USER,
    password: db_config_1.dbConfig.PASSWORD,
    database: db_config_1.dbConfig.DB,
    port: db_config_1.dbConfig.PORT,
});
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.connection.connect();
        console.log("Successfully connected to the PostgreSQL database.");
    }
    catch (error) {
        console.error("Error connecting to the PostgreSQL database:", error);
        throw error;
    }
});
exports.connectDatabase = connectDatabase;
exports.default = exports.connection;
