import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('steri_label', table => {
        table.integer('appointment_user_id').nullable()
            .references('id').inTable('user')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('steri_label', table => {
        table.dropColumn('appointment_user_id')
    })
}

