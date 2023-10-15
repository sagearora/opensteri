import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('steri_label', table => {
        table.string('appointment_id').nullable()
        table.dateTime('checkout_at').nullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('steri_label', table => {
        table.dropColumn('appointment_id')
        table.dropColumn('checkout_at')
    })
}

