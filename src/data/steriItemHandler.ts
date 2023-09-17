import { Knex } from 'knex'
import knexConnection from "../db-config"

export interface SteriItemAttributes {
    id: number,
    name: string,
    category: string,
    total_count: number,
    is_count_enabled: boolean,
    is_active: boolean,
}

export interface SteriItemInput extends Omit<SteriItemAttributes, 'id'> { }
export interface SteriItemOutput extends Required<SteriItemAttributes> { }


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
                }) as SteriItemOutput[]
        )[0]
    }

export const listSteriItems = (tbl: () => Knex.QueryBuilder) =>
    async () => {
        return (
            await tbl().select()
        ) as SteriItemOutput[]
    }

export const insertSteriItem = (tbl: () => Knex.QueryBuilder) =>
    async (attributes: SteriItemInput) => {
        return (
            await tbl().insert(attributes)
        )[0]
    }

export const updateSteriItem = (tbl: () => Knex.QueryBuilder) =>
    async (id: number, attributes: Partial<SteriItemAttributes>) => {
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