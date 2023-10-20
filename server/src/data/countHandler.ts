import { Knex } from 'knex'
import { Count, Count_Insert_Input } from '../__generated__/resolver-types'
import knexConnection from "../db-config"
import { ListArgs } from './types'


export interface CountHandler {
    get: ReturnType<typeof get>,
    list: ReturnType<typeof list>,
    insert: ReturnType<typeof insert>,
    update: ReturnType<typeof update>,
    raw: () => Knex.QueryBuilder,
}

const get = (tbl: () => Knex.QueryBuilder) =>
    async (id: number) => {
        const item = (
            await tbl().select()
                .where({
                    id,
                })
        )[0]
        return item ? {
            ...item,
            countable_items: JSON.parse(item.countable_items)
        } as Count : null
    }

export interface CountListArgs extends ListArgs {
    where?: {
    } | null
}

const list = (tbl: () => Knex.QueryBuilder) =>
    async (args?: CountListArgs) => {
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
        ).map((item: any) => ({
            ...item,
            countable_items: JSON.parse(item.countable_items),
        })) as Count[]
    }

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: {
        user_id: number
        countable_items: any[]
    }[]) => {
        const items = await tbl().insert(attributes.map(att => ({
            ...att,
            countable_items: JSON.stringify(att.countable_items || [])
        })), ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Partial<Count_Insert_Input>) => {
        return (
            await tbl()
                .update(attributes, '*')
                .where({
                    id,
                })
        )[0]
    }

function create(): CountHandler {
    const tbl = () => knexConnection
        .table('count')

    return {
        get: get(tbl),
        list: list(tbl),
        insert: insert(tbl),
        update: update(tbl),
        raw: tbl,
    }
}

export default { create }