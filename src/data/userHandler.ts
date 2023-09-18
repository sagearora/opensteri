import { Knex } from 'knex'
import { User, User_Insert_Input } from '../__generated__/resolver-types'
import knexConnection from "../db-config"


export interface UserHandler {
    get: ReturnType<typeof get>,
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

const where = (tbl: () => Knex.QueryBuilder) =>
    async (where: Partial<User>) => {
        return (
            await tbl().select()
                .where(where) as User[]
        )
    }

const list = (tbl: () => Knex.QueryBuilder) =>
    async () => {
        return (
            await tbl().select()
        ) as User[]
    }

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: User_Insert_Input[]) => {
        const items = await tbl().insert(attributes, ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Partial<User_Insert_Input>) => {
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
        list: list(tbl),
        insert: insert(tbl),
        update: update(tbl),
        where: where(tbl),
    }
}

export default { create }