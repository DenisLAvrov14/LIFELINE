import { Pool } from 'pg';
import { dbConfig } from '../config/db.config';

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
    console.log('Successfully connected to the PostgreSQL database.');
  } catch (error) {
    console.error('Error connecting to the PostgreSQL database:', error);
    throw error;
  }
};

export default connection;
