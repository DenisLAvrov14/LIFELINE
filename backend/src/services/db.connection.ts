import { Pool } from "pg";
import { dbConfig } from "../config/db.config";
import path from "path";
import fs from 'fs';

export const connection = new Pool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT,
});

export const connectDatabase = async () => {
  try {
    await connection.connect();
    console.log("Successfully connected to the PostgreSQL database.");

    // Читаем SQL-файл с миграциями и выполняем
    const migrationsPath = path.join(__dirname, '../migrations/init.sql');
    if (fs.existsSync(migrationsPath)) {
      const migrationsSQL = fs.readFileSync(migrationsPath, 'utf-8');
      await connection.query(migrationsSQL);
      console.log("Migrations executed.");
    } else {
      console.log("No migrations found.");
    }
  } catch (error) {
    console.error("Error connecting to the PostgreSQL database:", error);
    throw error;
  }
};

export default connection;
