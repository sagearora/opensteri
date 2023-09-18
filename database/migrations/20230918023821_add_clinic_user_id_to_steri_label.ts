import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const update_trigger = `
    CREATE TRIGGER update_timestamp_steri_label
AFTER UPDATE ON steri_label
FOR EACH ROW
BEGIN
    UPDATE steri_label SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`
    return knex.schema
        .raw('DROP TRIGGER IF EXISTS update_timestamp_steri_label')
        .dropTableIfExists('steri_label')
        .createTable('steri_label', table => {
            table.increments('id').primary()
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.integer('steri_item_id').notNullable().references('id').inTable('steri_item')
            table.dateTime('expiry_at').notNullable()
            table.integer('clinic_user_id').notNullable().references('id').inTable('user')
            table.integer('steri_cycle_id').nullable().references('id').inTable('steri_cycle')
            table.integer('steri_cycle_user_id').nullable().references('id').inTable('user')
            table.dateTime('loaded_at').nullable()
        })
        .raw(update_trigger)
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .raw('DROP TRIGGER IF EXISTS update_timestamp_steri_label')
        .dropTableIfExists('steri_label')
}

