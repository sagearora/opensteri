import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('count', table => {
        table.jsonb('countable_items')
            .notNullable()
        table.integer('user_id')
            .notNullable()
            .references('id').inTable('user')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('count', table => {
        table.dropColumn('countable_items')
        table.dropColumn('user_id')
    })
}

