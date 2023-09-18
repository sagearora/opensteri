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
    CREATE TRIGGER update_timestamp_steri_label
AFTER UPDATE ON steri_label
FOR EACH ROW
BEGIN
    UPDATE steri_label SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`;
        return knex.schema
            .createTable('steri_label', table => {
            table.increments('id').primary();
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.integer('steri_item_id').notNullable().references('id').inTable('steri_item');
            table.dateTime('expiry_at').notNullable();
            table.integer('steri_cycle_id').nullable().references('id').inTable('steri_cycle');
            table.integer('steri_cycle_user_id').nullable().references('id').inTable('user');
            table.dateTime('loaded_at').nullable();
        })
            .raw(update_trigger);
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .raw('DROP TRIGGER IF EXISTS update_timestamp_steri_label')
            .dropTableIfExists('steri_label');
    });
}
exports.down = down;
