import { GraphQLError } from 'graphql';
import { Order_Direction, Printer_Status, Resolvers, Steri_Event_Failure, Steri_Label, Steri_Label_Event_Type } from './__generated__/resolver-types';
import { Setting_Clinic_Key } from './constants';
import { PrintHandler } from './data/printHandler';

const throwIfPrinterNotReady = (printHandler: PrintHandler) => {
    if (!printHandler.checkStatus()) {
        throw new Error('Printer is not ready')
    }
}

export const resolvers: Resolvers = {
    Query: {
        clinic: async (p, args, context) => {
            const handler = context.datasources.settingHandler
            return await handler.get(Setting_Clinic_Key)
        },
        printer: async (p, args, context) => {
            const handler = context.datasources.printHandler
            return {
                status: handler.checkStatus() ? Printer_Status.Ready : Printer_Status.NotReady
            }
        },
        user: (p, args, context) => {
            return context.datasources.userHandler
                .list()
        },
        user_by_pk: (p, args, context) => {
            return context.datasources.userHandler
                .get(args.id)
        },
        user_by_pin: async (p, args, context) => {
            return (await context.datasources.userHandler
                .where({
                    pin: args.pin
                }))[0]
        },
        steri: (p, args, context) => {
            return context.datasources.steriHandler
                .list()
        },
        steri_by_pk: (p, args, context) => {
            return context.datasources.steriHandler
                .get(args.id)
        },
        steri_label: (p, args, context) => {
            return context.datasources.steriLabelHandler
                .list(args)
        },
        steri_item: (p, args, context) => {
            return context.datasources.steriItemHandler
                .list()
        },
        steri_item_by_pk: (p, args, context) => {
            return context.datasources.steriItemHandler
                .get(args.id)
        },
        steri_item_category: async (p, args, context) => {
            return (await context.datasources.steriItemHandler
                .distinct('category')).map(item => ({
                    name: item as string
                }))
            return []
        },
        steri_cycle: (p, args, context) => {
            return context.datasources.steriCycleHandler
                .list(args)
        },
        steri_cycle_count: async (p, args, context) => {
            const steriCycleHandler = context.datasources.steriCycleHandler
            return steriCycleHandler.count(args.steri_id)
        },
        steri_cycle_by_pk: (p, args, context) => {
            return context.datasources.steriCycleHandler
                .get(args.id)
        },
        pending_spore_test: async (p, args, context) => {
            return context.datasources.steriCycleHandler
                .raw()
                .andWhere({
                    spore_test_recorded_at: null,
                    is_spore_test_enabled: true,
                })
                .orderBy('start_at', 'asc')
        },
        count_by_pk: (p, args, context) => {
            const countHandler = context.datasources.countHandler
            return countHandler.get(args.id)
        },
        count: (p, args, context) => {
            return context.datasources.countHandler
                .list(args)
        },
    },
    Mutation: {
        update_clinic: async (p, args, context) => {
            const handler = context.datasources.settingHandler
            try {
                const result = await handler.insert([{
                    id: Setting_Clinic_Key,
                    value: args.set,
                }])
                return (await handler.get(result[0])).value
            } catch (e) {
                if ((e as any).code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
                    return await handler.update(Setting_Clinic_Key, {
                        value: args.set,
                    })
                } else {
                    throw new Error('failed to save clinic')
                }
            }
        },
        insert_user: async (p, args, context) => {
            const handler = context.datasources.userHandler
            const ids = (await handler.insert(args.objects))
            return handler.bulkGet(ids)
        },
        insert_user_one: async (p, args, context) => {
            const handler = context.datasources.userHandler
            const id = (await handler.insert([args.object]))[0]
            return handler.get(id)
        },
        update_user: async (p, args, context) => {
            const handler = context.datasources.userHandler
            await handler.update(args.id, args.set)
            return handler.get(args.id)
        },
        insert_steri_one: async (p, args, context) => {
            const handler = context.datasources.steriHandler
            const id = (await handler.insert([args.object]))[0]
            return handler.get(id)
        },
        update_steri: async (p, args, context) => {
            const handler = context.datasources.steriHandler
            await handler.update(args.id, args.set)
            return handler.get(args.id)
        },
        insert_steri_label: async (p, args, context) => {
            const handler = context.datasources.steriLabelHandler
            const printHandler = context.datasources.printHandler
            throwIfPrinterNotReady(printHandler)
            const ids = await handler.insert(args.objects)
            const labels = await Promise.all(ids.map(id => handler.get(id)))
            try {
                const processed_labels: Steri_Label[] = await printHandler
                    .printLabels(
                        context.datasources,
                        labels.filter(l => !l.skip_print))
                const returning = labels.map(label => processed_labels
                    .find(pl => pl.id === label.id) || label)
                return {
                    affected_rows: ids.length,
                    returning,
                }
            } catch (e) {
                throw new GraphQLError('Failed to print labels')
            }

        },
        insert_steri_item_one: async (p, args, context) => {
            const handler = context.datasources.steriItemHandler
            const id = (await handler.insert([args.object]))[0]
            return handler.get(id)
        },
        update_steri_item: async (p, args, context) => {
            const handler = context.datasources.steriItemHandler
            await handler.update(args.id, args.set)
            return handler.get(args.id)
        },
        insert_steri_cycle_one: async (p, args, context) => {
            const handler = context.datasources.steriCycleHandler
            const id = (await handler.insert([args.object]))[0]
            return handler.get(id)
        },
        update_steri_cycle_by_pk: async (p, args, context) => {
            const handler = context.datasources.steriCycleHandler
            handler.update(args.id, args.set)
            return handler.get(args.id)
        },
        insert_steri_label_event: async (p, args, context) => {
            // update the steri_label
            const handler = context.datasources.steriLabelHandler
            const printHandler = context.datasources.printHandler
            let affected_rows = 0
            const steri_labels: Steri_Label[] = []
            const to_print: Steri_Label[] = []
            const failures: Steri_Event_Failure[] = []
            for (let i = 0; i < args.objects.length; i++) {
                const item = args.objects[i]
                switch (item.type) {
                    case Steri_Label_Event_Type.AddSteriItem: {
                        const data = JSON.parse(item.data)
                        if (!data.steri_cycle_id) {
                            failures.push({
                                id: item.steri_label_id,
                                reason: 'Steri Cycle Id not provided'
                            })
                            continue
                        }
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            steri_cycle_id: data.steri_cycle_id,
                            steri_cycle_user_id: item.user_id,
                            loaded_at: new Date().toISOString(),
                        }))
                        break
                    }
                    case Steri_Label_Event_Type.RemoveSteriItem: {
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            steri_cycle_id: null,
                            steri_cycle_user_id: null,
                            loaded_at: null,
                        }))
                        break
                    }
                    case Steri_Label_Event_Type.Reprint: {
                        throwIfPrinterNotReady(printHandler)
                        const label = await handler.get(item.steri_label_id)
                        if (label) {
                            to_print.push(label)
                            steri_labels.push(label)
                        }
                        break
                    }
                    case Steri_Label_Event_Type.UpdateSteriItemId: {
                        throwIfPrinterNotReady(printHandler)
                        const data = JSON.parse(item.data)
                        if (!data.steri_item_id) {
                            failures.push({
                                id: item.steri_label_id,
                                reason: 'New Steri Item Id not provided'
                            })
                            continue
                        }
                        const label = await handler.update(item.steri_label_id, {
                            steri_item_id: data.steri_item_id,
                        })
                        steri_labels.push(label)
                        to_print.push(label)
                        break
                    }
                    case Steri_Label_Event_Type.CheckoutSteriItem: {
                        const data = JSON.parse(item.data)
                        if (!data.appointment_id) {
                            failures.push({
                                id: item.steri_label_id,
                                reason: 'Appointment Id not provided'
                            })
                            continue
                        }
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            appointment_id: data.appointment_id,
                            checkout_at: new Date().toISOString(),
                            count_id: null,
                        }))
                        break
                    }
                    case Steri_Label_Event_Type.UndoCheckout: {
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            appointment_id: null,
                            checkout_at: null,
                        }))
                        break
                    }
                    case Steri_Label_Event_Type.PrintReplacement: {
                        throwIfPrinterNotReady(printHandler)
                        const data = JSON.parse(item.data)
                        if (!data.expiry_at) {
                            failures.push({
                                id: item.steri_label_id,
                                reason: 'Expiry At not provided'
                            })
                            continue
                        }
                        const current_label = await handler.get(item.steri_label_id)
                        if (!current_label) {
                            failures.push({
                                id: item.steri_label_id,
                                reason: 'Steri Label does not exist'
                            })
                            continue
                        }
                        const [new_label_id] = await handler.insert([{
                            steri_item_id: current_label.steri_item_id,
                            clinic_user_id: item.user_id,
                            expiry_at: data.expiry_at,
                            skip_print: false,
                        }])
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            next_label_id: new_label_id,
                        }))
                        to_print.push(await handler.get(new_label_id))
                        break;
                    }
                    case Steri_Label_Event_Type.CountSteriItem: {
                        const data = JSON.parse(item.data)
                        if (!data.count_id) {
                            failures.push({
                                id: item.steri_label_id,
                                reason: 'Count Id not provided'
                            })
                            continue
                        }
                        const current_label = await handler.get(item.steri_label_id)
                        if (current_label?.appointment_id) {
                            failures.push({
                                id: item.steri_label_id,
                                reason: `Steri Label is Checked Out. Appointment ID: ${current_label.appointment_id}. Cannot count.`
                            })
                            continue
                        }
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            count_id: data.count_id,
                        }))
                        break;
                    }
                    case Steri_Label_Event_Type.UndoCount: {
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            count_id: null,
                        }))
                        break
                    }
                    default: {
                        throw new Error('Invalid event')
                    }

                }
            }
            if (to_print.length > 0) {
                await printHandler.printLabels(context.datasources, to_print)
            }
            return {
                affected_rows,
                returning: steri_labels,
                failures,
            }
        },
        insert_count_one: async (p, args, context) => {
            const countHandler = context.datasources.countHandler
            const last_unfinished_count = await countHandler.list({
                limit: 1,
                order_by: [{
                    column: 'id',
                    direction: Order_Direction.Desc,
                }],
                where: {
                    is_locked: false,
                }
            })
            if (last_unfinished_count.length > 0) {
                return last_unfinished_count[0]
            }
            const steriItemHandler = context.datasources.steriItemHandler
            const countable_items = (await steriItemHandler.list())
                .filter(item => item.is_count_enabled && (item.total_count || 0) > 0)
                .map(item => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    total_count: item.total_count,
                }))

            const id = (await countHandler.insert([{
                ...args.object,
                countable_items,
            }]))[0]
            return countHandler.get(id)
        },
        finish_count: async (p, args, context) => {
            const countHandler = context.datasources.countHandler
            const count = await countHandler.get(args.id)
            if (!count || count.is_locked_at) {
                return count
            }
            const steri_labels = await context.datasources.steriLabelHandler
                .raw()
                .where({
                    count_id: args.id
                }) as Steri_Label[]
            
            const item_count = (steri_labels || []).reduce((obj, item) => ({
                ...obj,
                [item.steri_item_id]: (obj[item.steri_item_id] || 0) + 1
            }), {} as { [id: number]: number })
            const final_count = count.countable_items.map(item => ({
                ...item,
                total_scanned: item_count[item.id] || 0,
            }))
            const updated_count = await countHandler.update(args.id, {
                final_count,
                is_locked_at: new Date().toISOString(),
            })
            return {
                ...updated_count,
                countable_items: JSON.parse(updated_count?.countable_items || '[]'),
                final_count: JSON.parse(updated_count?.final_count || '[]'),
            }
        }
    },
    clinic: {
        user: async (p, args, context) => {
            const userHandler = context.datasources.userHandler
            return userHandler.list()
        }
    },
    steri_label: {
        steri_item: (p, args, context) => {
            if (!!p.steri_item) {
                return p.steri_item
            }
            return context.datasources.steriItemHandler
                .get(p.steri_item_id)
        },
        clinic_user: (p, args, context) => {
            if (!!p.clinic_user) {
                return p.clinic_user
            }
            return context.datasources.userHandler
                .get(p.clinic_user_id)
        },
        steri_cycle: (p, args, context) => {
            if (!!p.steri_cycle || !p.steri_cycle_id) {
                return null
            }
            return context.datasources.steriCycleHandler
                .get(p.steri_cycle_id)
        },
        steri_cycle_user: (p, args, context) => {
            if (!!p.steri_cycle_user || !p.steri_cycle_user_id) {
                return null
            }
            return context.datasources.userHandler
                .get(p.steri_cycle_user_id)
        }
    },
    steri_cycle: {
        steri: (p, args, context) => {
            return context.datasources.steriHandler
                .get(p.steri_id)
        },
        steri_labels: (p, args, context) => {
            return context.datasources.steriLabelHandler
                .raw()
                .where({
                    steri_cycle_id: p.id
                })
                .modify(qb => {
                    if (args.order_by) {
                        qb.orderBy(args.order_by.column, args.order_by.direction)
                    }
                })
        },
        start_user: (p, args, context) => {
            if (p.start_user) {
                return p.start_user
            }
            if (!p.start_user_id) {
                return null
            }
            return context.datasources.userHandler
                .get(p.start_user_id)
        },
        finish_user: (p, args, context) => {
            if (p.finish_user) {
                return p.finish_user
            }
            if (!p.finish_user_id) {
                return null
            }
            return context.datasources.userHandler
                .get(p.finish_user_id)
        }
    },
    count: {
        user: async (p, args, context) => {
            if (p.user) {
                return p.user
            }
            const userHandler = context.datasources.userHandler
            const user = userHandler.get(p.user_id)
            return user
        },
        steri_labels: (p, args, context) => {
            return context.datasources.steriLabelHandler
                .raw()
                .where({
                    count_id: p.id
                })
                .modify(qb => {
                    if (args.order_by) {
                        qb.orderBy(args.order_by.column, args.order_by.direction)
                    }
                })
        },
    },
};