import { Knex } from 'knex'
import knexConnection from "../db-config"
import { Steri_Item, Steri_Item_Insert_Input } from '../__generated__/resolver-types'


export interface SteriItemHandler {
    get: ReturnType<typeof getSteriItem>,
    list: ReturnType<typeof listSteriItems>,
    insert: ReturnType<typeof insertSteriItem>,
    update: ReturnType<typeof updateSteriItem>,
}

export const getSteriItem = (tbl: () => Knex.QueryBuilder) =>
    async (id: number) => {
        return (
            await tbl().select()
                .where({
                    id,
                }) as Steri_Item[]
        )[0]
    }

export const listSteriItems = (tbl: () => Knex.QueryBuilder) =>
    async () => {
        return (
            await tbl().select()
        ) as Steri_Item[]
    }

export const insertSteriItem = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: Steri_Item_Insert_Input) => {
        return (
            await tbl().insert(attributes)
        )[0]
    }

export const updateSteriItem = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Partial<Steri_Item_Insert_Input>) => {
        return (
            await tbl()
                .update(attributes, '*')
                .where({
                    id,
                })
        )[0]
    }

export function create(): SteriItemHandler {
    const tbl = () => knexConnection
        .table('steri_item')

    return {
        get: getSteriItem(tbl),
        list: listSteriItems(tbl),
        insert: insertSteriItem(tbl),
        update: updateSteriItem(tbl),
    }
}

export default { create }