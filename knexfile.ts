import { configDotenv } from "dotenv";
import type { Knex } from "knex";
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

configDotenv()

const filename = process.env.DB_PATH || '';

if (!filename) {
  throw new Error('DB_PATH not set');
}

// create intermediate directories if they don't exist for filename
if (!existsSync(dirname(filename))) {
  mkdirSync(dirname(filename), { recursive: true });
}

// Update with your config settings.
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename,
    },
    migrations: {
      directory: "./database/migrations"
    },
    useNullAsDefault: true,
    seeds: {
      directory: "./database/seeds"
    }
  },
};

module.exports = config;
