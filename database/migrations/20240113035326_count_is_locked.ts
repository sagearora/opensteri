import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('count', table => {
        table.dateTime('is_locked_at')
            .nullable()
        table.jsonb('final_count')
            .nullable()
    })
    await knex('count').update({
        is_locked_at: knex.fn.now(),
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('count', table => {
        table.dropColumn('is_locked_at')
        table.dropColumn('final_count')
    })
}

