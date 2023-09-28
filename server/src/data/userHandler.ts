import { Knex } from 'knex'
import { User, User_Insert_Input, User_Set_Input } from '../__generated__/resolver-types'
import knexConnection from "../db-config"
import { ListArgs } from './types'


export interface UserHandler {
    get: ReturnType<typeof get>,
    bulkGet: ReturnType<typeof bulkGet>,
    list: ReturnType<typeof list>,
    insert: ReturnType<typeof insert>,
    update: ReturnType<typeof update>,
    where: ReturnType<typeof where>,
}

const get = (tbl: () => Knex.QueryBuilder) =>
    async (id: number) => {
        return (
            await tbl().select()
                .where({
                    id,
                }) as User[]
        )[0]
    }

const bulkGet = (tbl: () => Knex.QueryBuilder) =>
    async (ids: number[]) => {
        return (
            await tbl().select()
                .whereIn('id', ids) as User[]
        )
    }
const where = (tbl: () => Knex.QueryBuilder) =>
    async (where: Partial<User>) => {
        return (
            await tbl().select()
                .where(where) as User[]
        )
    }

const list = (tbl: () => Knex.QueryBuilder) =>
    async (args?: ListArgs) => {
        return (
            await tbl()
                .select()
                .modify((qb) => {
                    if (args?.order_by) {
                        args.order_by.forEach(order => {
                            qb.orderBy(order.column, order.direction)
                        })
                    }
                    if (args?.limit) qb.limit(args.limit)
                    if (args?.offset) qb.offset(args.offset)
                })
        ) as User[]
    }

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: User_Insert_Input[]) => {
        const items = await tbl().insert(attributes, ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: User_Set_Input) => {
        return (
            await tbl()
                .update(attributes, '*')
                .where({
                    id,
                })
        )[0]
    }

function create(): UserHandler {
    const tbl = () => knexConnection
        .table('user')

    return {
        get: get(tbl),
        bulkGet: bulkGet(tbl),
        list: list(tbl),
        insert: insert(tbl),
        update: update(tbl),
        where: where(tbl),
    }
}

export default { create }