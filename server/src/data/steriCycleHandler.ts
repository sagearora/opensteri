import { Knex } from 'knex'
import { Steri_Cycle, Steri_Cycle_Insert_Input, Steri_Cycle_Set_Input } from '../__generated__/resolver-types'
import knexConnection from "../db-config"
import { ListArgs } from './types'


export interface SteriCycleHandler {
    get: ReturnType<typeof get>,
    list: ReturnType<typeof list>,
    insert: ReturnType<typeof insert>,
    update: ReturnType<typeof update>,
    raw: () => Knex.QueryBuilder,
}

const get = (tbl: () => Knex.QueryBuilder) =>
    async (id: number) => {
        return (
            await tbl().select()
                .where({
                    id,
                }) as Steri_Cycle[]
        )[0]
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
    ) as Steri_Cycle[]
}

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: Steri_Cycle_Insert_Input[]) => {
        const items = await tbl().insert(attributes, ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Steri_Cycle_Set_Input) => {
        return (
            await tbl()
                .update(attributes, '*')
                .where({
                    id,
                })
        )[0]
    }

function create(): SteriCycleHandler {
    const tbl = () => knexConnection
        .table('steri_cycle')

    return {
        get: get(tbl),
        list: list(tbl),
        insert: insert(tbl),
        update: update(tbl),
        raw: tbl,
    }
}

export default { create }