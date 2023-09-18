import { Knex } from 'knex'
import { Steri_Label, Steri_Label_Insert_Input } from '../__generated__/resolver-types'
import knexConnection from "../db-config"


export interface SteriLabelHandler {
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
                }) as Steri_Label[]
        )[0]
    }

const list = (tbl: () => Knex.QueryBuilder) =>
    async () => {
        return (
            await tbl().select()
        ) as Steri_Label[]
    }

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: Steri_Label_Insert_Input[]) => {
        const items = await tbl().insert(attributes, ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Partial<Steri_Label_Insert_Input>) => {
        return (
            await tbl()
                .update(attributes, '*')
                .where({
                    id,
                })
        )[0]
    }

function create(): SteriLabelHandler {
    const tbl = () => knexConnection
        .table('steri_label')

    return {
        get: get(tbl),
        list: list(tbl),
        insert: insert(tbl),
        update: update(tbl),
    }
}

export default { create }