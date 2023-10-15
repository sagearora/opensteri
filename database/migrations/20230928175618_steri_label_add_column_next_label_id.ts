import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('steri_label', table => {
        table.integer('next_label_id').nullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('steri_label', table => {
        table.dropColumn('next_label_id')
    })
}

