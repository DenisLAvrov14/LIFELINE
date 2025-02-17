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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.connection = void 0;
const pg_1 = require("pg");
const db_config_1 = require("../config/db.config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
        // Читаем SQL-файл с миграциями и выполняем
        const migrationsPath = path_1.default.join(__dirname, '../migrations/init.sql');
        if (fs_1.default.existsSync(migrationsPath)) {
            const migrationsSQL = fs_1.default.readFileSync(migrationsPath, 'utf-8');
            yield exports.connection.query(migrationsSQL);
            console.log("Migrations executed.");
        }
        else {
            console.log("No migrations found.");
        }
    }
    catch (error) {
        console.error("Error connecting to the PostgreSQL database:", error);
        throw error;
    }
});
exports.connectDatabase = connectDatabase;
exports.default = exports.connection;
