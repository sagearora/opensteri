import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const update_trigger = `
    CREATE TRIGGER update_timestamp_count
AFTER UPDATE ON count
FOR EACH ROW
BEGIN
    UPDATE count SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`
    return knex.schema
        .createTable('count', table => {
            table.increments('id').primary()
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        })
        .raw(update_trigger)
        .alterTable('steri_label', table => {
            table.integer('count_id').nullable()
                .references('id').inTable('count')
        })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .raw('DROP TRIGGER IF EXISTS update_timestamp_count')
    .alterTable('steri_label', table => {
        table.dropColumn('count_id')
    })
    .dropTableIfExists('count')
}

