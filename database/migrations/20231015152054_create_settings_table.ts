import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const update_trigger = `
    CREATE TRIGGER update_timestamp_setting
AFTER UPDATE ON setting
FOR EACH ROW
BEGIN
    UPDATE setting SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`
    return knex.schema
        .createTable('setting', table => {
            table.string('id').primary()
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.jsonb('value').notNullable()
        })
        .raw(update_trigger)
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .raw('DROP TRIGGER IF EXISTS update_timestamp_setting')
        .dropTableIfExists('setting')
}

