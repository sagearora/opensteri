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
    count: ReturnType<typeof count>,
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

const count = (tbl: () => Knex.QueryBuilder) =>
    async (steri_id?: number | null) => {
        return (
            await tbl().count('id as Count')
                .modify((qb) => {
                    if (steri_id) {
                        qb.where('steri_id', '=', steri_id)
                    }
                })
        )[0].Count as number
    }

interface SteriCycleListArgs extends ListArgs {
    steri_id?: number | null
}

const list = (tbl: () => Knex.QueryBuilder) =>
    async (args?: SteriCycleListArgs) => {
        return (
            await tbl().select()
                .modify((qb) => {
                    if (args?.steri_id) {
                        qb.where('steri_id', '=', args.steri_id)
                    }
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
        count: count(tbl),
        raw: tbl,
    }
}

export default { create }