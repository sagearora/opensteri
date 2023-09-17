import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./database/dev.sqlite3"
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
