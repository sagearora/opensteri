"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const path_1 = require("path");
(0, dotenv_1.configDotenv)();
const filename = process.env.DB_PATH || '';
if (!filename) {
    throw new Error('DB_PATH not set');
}
// create intermediate directories if they don't exist for filename
if (!(0, fs_1.existsSync)((0, path_1.dirname)(filename))) {
    (0, fs_1.mkdirSync)((0, path_1.dirname)(filename), { recursive: true });
}
// Update with your config settings.
const config = {
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
