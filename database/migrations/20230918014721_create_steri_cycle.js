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
    CREATE TRIGGER update_timestamp_steri_cycle
AFTER UPDATE ON steri_cycle
FOR EACH ROW
BEGIN
    UPDATE steri_cycle SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`;
        return knex.schema
            .createTable('steri_cycle', table => {
            table.increments('id').primary();
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.integer('steri_id').notNullable().references('id').inTable('steri');
            table.integer('cycle_number').notNullable();
            table.dateTime('start_at').nullable();
            table.integer('start_user_id').nullable().references('id').inTable('user');
            table.dateTime('finish_at').nullable();
            table.integer('finish_user_id').nullable().references('id').inTable('user');
            table.string('notes').nullable();
            table.string('status').notNullable().defaultTo('loading');
            table.boolean('is_spore_test_enabled').notNullable().defaultTo(false);
            table.integer('spore_test_user_id').nullable().references('id').inTable('user');
            table.dateTime('spore_test_recorded_at').nullable();
            table.string('spore_test_result').nullable();
            table.string('log_data').nullable();
            table.unique(['steri_id', 'cycle_number']);
        })
            .raw(update_trigger);
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .raw('DROP TRIGGER IF EXISTS update_timestamp_steri_cycle')
            .dropTableIfExists('steri_cycle');
    });
}
exports.down = down;
