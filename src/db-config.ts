import knex from 'knex'
import path from 'path'

const knexConnection = knex({
    client: 'better-sqlite3',
    connection: {
        filename: path.join(__dirname, '..', process.env.DB_PATH || ''),
    }
})

export default knexConnection