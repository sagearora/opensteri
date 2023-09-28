import { GraphQLError } from 'graphql';
import { Resolvers, Steri_Label, Steri_Label_Event_Type } from './__generated__/resolver-types';

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers: Resolvers = {
    Query: {
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
                .list()
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
        }
    },
    Mutation: {
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
            const ids = await handler.insert(args.objects)
            const labels = await Promise.all(ids.map(id => handler.get(id)))
            try {
                const processed_labels: Steri_Label[] = await context.datasources.printHandler
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
            for (let i = 0; i < args.objects.length; i++) {
                const item = args.objects[i]
                switch(item.type) {
                    case Steri_Label_Event_Type.AddSteriItem:
                        const data = JSON.parse(item.data)
                        if (!data.steri_cycle_id) {
                            continue
                        }
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            steri_cycle_id: data.steri_cycle_id,
                            steri_cycle_user_id: item.user_id,
                            loaded_at: new Date().toISOString(),
                            skip_print: !item.force_reprint,
                        }))
                        break
                    case Steri_Label_Event_Type.RemoveSteriItem:
                        steri_labels.push(await handler.update(item.steri_label_id, {
                            steri_cycle_id: null,
                            steri_cycle_user_id: null,
                            loaded_at: null,
                            skip_print: !item.force_reprint,
                        }))
                        break
                }
            }
            const to_print = steri_labels.filter(l => !Boolean(l.skip_print))
            printHandler.printLabels(context.datasources, to_print)
            return {
                affected_rows,
                returning: steri_labels
            }
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
    }
};