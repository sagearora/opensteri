import { Knex } from 'knex'
import { Steri_Label, Steri_Label_Insert_Input, Steri_Label_Set_Input } from '../__generated__/resolver-types'
import knexConnection from "../db-config"
import { ListArgs } from './types'


export interface SteriLabelHandler {
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
                }) as Steri_Label[]
        )[0]
    }

export interface SteriLabelListArgs extends ListArgs {
    where?: {
        appointment_id?: string | null
    } | null
}

const list = (tbl: () => Knex.QueryBuilder) =>
    async (args?: SteriLabelListArgs) => {
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
                    console.log(args?.where)
                    const where = args?.where
                    if (where?.appointment_id) {
                        qb.where('appointment_id', '=', where.appointment_id)
                    }
                })
        ) as Steri_Label[]
    }

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: Steri_Label_Insert_Input[]) => {
        const items = await tbl().insert(attributes, ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Steri_Label_Set_Input) => {
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
        raw: tbl,
    }
}

export default { create }