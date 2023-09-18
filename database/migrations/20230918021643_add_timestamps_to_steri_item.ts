import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const update_trigger = `
    CREATE TRIGGER update_timestamp_steri_item
AFTER UPDATE ON steri_item
FOR EACH ROW
BEGIN
    UPDATE steri_item SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`
    return knex.schema.alterTable('steri_item', table => {
        table.dateTime('created_at').notNullable().defaultTo(new Date().toISOString())
        table.dateTime('updated_at').notNullable().defaultTo(new Date().toISOString())
    })
        .raw(update_trigger)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema
        .raw('DROP TRIGGER IF EXISTS update_timestamp_steri_item')
}

