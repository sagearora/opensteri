import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const update_trigger = `
    CREATE TRIGGER update_timestamp_user
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    UPDATE user SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`
    return knex.schema.raw('PRAGMA foreign_keys = ON;')
        .createTable('user', table => {
            table.increments('id').primary()
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.string('name').notNullable()
            table.integer('pin').notNullable().unique()
            table.boolean('is_active').notNullable().defaultTo(true)
        })
        .raw(update_trigger)
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('user')
}

