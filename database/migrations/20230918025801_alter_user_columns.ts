import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('user', table => {
        table.boolean('is_admin').notNullable().defaultTo(false)
        table.boolean('is_spore_tester').notNullable().defaultTo(false)
    })
}


export async function down(knex: Knex): Promise<void> {
}

