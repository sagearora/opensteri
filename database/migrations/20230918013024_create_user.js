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
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        const update_trigger = `
    CREATE TRIGGER update_timestamp_user
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    UPDATE user SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`;
        return knex.schema.raw('PRAGMA foreign_keys = ON;')
            .createTable('user', table => {
            table.increments('id').primary();
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.string('name').notNullable();
            table.integer('pin').notNullable().unique();
            table.boolean('is_active').notNullable().defaultTo(true);
        })
            .raw(update_trigger);
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTableIfExists('user');
    });
}
exports.down = down;
