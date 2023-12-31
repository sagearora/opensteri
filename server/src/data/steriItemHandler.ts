import { Knex } from 'knex'
import { Steri_Item, Steri_Item_Insert_Input, Steri_Item_Set_Input } from '../__generated__/resolver-types'
import knexConnection from "../db-config"
import { ListArgs } from './types'


export interface SteriItemHandler {
    get: ReturnType<typeof get>,
    bulkGet: ReturnType<typeof bulkGet>,
    list: ReturnType<typeof list>,
    insert: ReturnType<typeof insert>,
    update: ReturnType<typeof update>,
    distinct: ReturnType<typeof distinct>,
}

const get = (tbl: () => Knex.QueryBuilder) =>
    async (id: number) => {
        return (
            await tbl().select()
                .where({
                    id,
                }) as Steri_Item[]
        )[0]
    }

const bulkGet = (tbl: () => Knex.QueryBuilder) =>
    async (ids: number[]) => {
        return (
            await tbl().select()
                .whereIn('id', ids) as Steri_Item[]
        )
    }

const list = (tbl: () => Knex.QueryBuilder) =>
    async (args?: ListArgs) => {
        return (
            await tbl().select()
                .modify((qb) => {
                    if (args?.order_by) {
                        args.order_by.forEach(order => {
                            qb.orderBy(order.column, order.direction)
                        })
                    }
                    if (args?.limit) qb.limit(args.limit)
                    if (args?.offset) qb.offset(args.offset)
                })
        ) as Steri_Item[]
    }

const distinct = (tbl: () => Knex.QueryBuilder) =>
    async (on: string) => {
        return (
            await tbl()
                .distinct()
                .pluck(on)
        ) as string[]
    }

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: Steri_Item_Insert_Input[]) => {
        const items = await tbl().insert(attributes, ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Steri_Item_Set_Input) => {
        return (
            await tbl()
                .update(attributes, '*')
                .where({
                    id,
                })
        )[0]
    }

    
function create(): SteriItemHandler {
    const tbl = () => knexConnection
        .table('steri_item')

    return {
        get: get(tbl),
        bulkGet: bulkGet(tbl),
        list: list(tbl),
        insert: insert(tbl),
        update: update(tbl),
        distinct: distinct(tbl),
    }
}

export default { create }