import { Knex } from 'knex'
import { Steri, Steri_Insert_Input } from '../__generated__/resolver-types'
import knexConnection from "../db-config"


export interface SteriHandler {
    get: ReturnType<typeof get>,
    list: ReturnType<typeof list>,
    insert: ReturnType<typeof insert>,
    update: ReturnType<typeof update>,
}

const get = (tbl: () => Knex.QueryBuilder) =>
    async (id: number) => {
        return (
            await tbl().select()
                .where({
                    id,
                }) as Steri[]
        )[0]
    }

const list = (tbl: () => Knex.QueryBuilder) =>
    async () => {
        return (
            await tbl().select()
        ) as Steri[]
    }

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: Steri_Insert_Input[]) => {
        const items = await tbl().insert(attributes, ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Partial<Steri_Insert_Input>) => {
        return (
            await tbl()
                .update(attributes, '*')
                .where({
                    id,
                })
        )[0]
    }

function create(): SteriHandler {
    const tbl = () => knexConnection
        .table('steri')

    return {
        get: get(tbl),
        list: list(tbl),
        insert: insert(tbl),
        update: update(tbl),
    }
}

export default { create }