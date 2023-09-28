import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('steri_label_event', table => {
            table.increments('id').primary()
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            table.integer('steri_label_id').notNullable().references('id').inTable('steri_label')
            table.integer('user_id').notNullable().references('id').inTable('user')
            table.string('type').notNullable()
            table.jsonb('data').nullable()
        })
}


export async function down(knex: Knex): Promise<void> {
    return knex
        .schema
        .dropTableIfExists('steri_label_event')
}

