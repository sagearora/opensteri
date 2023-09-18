import knex from 'knex'

const knexConnection = knex({
    client: 'better-sqlite3',
    connection: {
        filename: process.env.DB_PATH || '',
    }
})

export default knexConnection