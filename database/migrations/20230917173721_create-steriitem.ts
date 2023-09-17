import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('steri_item', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('category').notNullable()
        table.integer('total_count').notNullable().defaultTo(0)
        table.boolean('is_count_enabled').notNullable().defaultTo(false)
        table.boolean('is_active').notNullable().defaultTo(true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('steri_item')
}

