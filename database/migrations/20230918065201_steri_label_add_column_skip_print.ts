import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('steri_label', table => {
        table.boolean('skip_print').notNullable().defaultTo(false)
    })
}


export async function down(knex: Knex): Promise<void> {
}

