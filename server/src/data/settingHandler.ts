import { Knex } from 'knex'
import knexConnection from "../db-config"
import { ListArgs } from './types'


export interface SettingHandler {
    get: ReturnType<typeof get>,
    bulkGet: ReturnType<typeof bulkGet>,
    list: ReturnType<typeof list>,
    insert: ReturnType<typeof insert>,
    update: ReturnType<typeof update>,
}

export type Setting = {
    id: string
    value: any
}


const settingToValue = (setting: Setting) => {
    return {
        ...JSON.parse(setting.value),
        id: setting.id,
    }
}

const get = (tbl: () => Knex.QueryBuilder) =>
    async (id: string) => {
        const data = (await tbl().select()
                .where({
                    id,
                }) as Setting[])[0]
        if (data) {
            return settingToValue(data)
        }
        return null
    }

const bulkGet = (tbl: () => Knex.QueryBuilder) =>
    async (ids: number[]) => {
        return (
            await tbl().select()
                .whereIn('id', ids) as Setting[]
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
        ) as Setting[]
    }

const insert = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: Setting[]) => {
        const items = await tbl().insert(attributes, ['id'])
        return items.map(item => item.id)
    }

const update = (tbl: () => Knex.QueryBuilder) =>
    async (id: string, attributes: { value: any }) => {
        return (
            await tbl()
                .update(attributes, '*')
                .where({
                    id,
                })
        )[0]
    }

function create(): SettingHandler {
    const tbl = () => knexConnection
        .table('setting')

    return {
        get: get(tbl),
        bulkGet: bulkGet(tbl),
        list: list(tbl),
        insert: insert(tbl),
        update: update(tbl),
    }
}

export default { create }