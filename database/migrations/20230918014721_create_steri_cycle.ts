import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const update_trigger = `
    CREATE TRIGGER update_timestamp_steri_cycle
AFTER UPDATE ON steri_cycle
FOR EACH ROW
BEGIN
    UPDATE steri_cycle SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`
    return knex.schema
        .createTable('steri_cycle', table => {
            table.increments('id').primary()
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.integer('steri_id').notNullable().references('id').inTable('steri')
            table.integer('cycle_number').notNullable()
            table.dateTime('start_at').nullable()
            table.integer('start_user_id').nullable().references('id').inTable('user')
            table.dateTime('finish_at').nullable()
            table.integer('finish_user_id').nullable().references('id').inTable('user')
            table.string('notes').nullable()
            table.string('status').notNullable().defaultTo('loading')
            table.boolean('is_spore_test_enabled').notNullable().defaultTo(false)
            table.integer('spore_test_user_id').nullable().references('id').inTable('user')
            table.dateTime('spore_test_recorded_at').nullable()
            table.string('spore_test_result').nullable()
            table.string('log_data').nullable()
            table.unique(['steri_id', 'cycle_number'])
        })
        .raw(update_trigger)
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .raw('DROP TRIGGER IF EXISTS update_timestamp_steri_cycle')
        .dropTableIfExists('steri_cycle')
}

