import { Resolvers, Steri_Label } from './__generated__/resolver-types';

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers: Resolvers = {
    Query: {
        steri_item: (p, args, context) => {
            return context.datasources.steriItemHandler
                .list()
        },
        steri_item_by_pk: (p, args, context) => {
            console.log(args.id, context.authorization)
            return context.datasources.steriItemHandler
                .get(args.id)
        },
        user: (p, args, context) => {
            return context.datasources.userHandler
                .list()
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
        steri_label: (p, args, context) => {
            return context.datasources.steriLabelHandler
                .list()
        },
    },
    Mutation: {
        insert_steri_item_one: async (p, args, context) => {
            const handler = context.datasources.steriItemHandler
            const id = (await handler.insert([args.object]))[0]
            return handler.get(id)
        },
        insert_user_one: async (p, args, context) => {
            const handler = context.datasources.userHandler
            const id = (await handler.insert([args.object]))[0]
            return handler.get(id)
        },
        insert_steri_one: async (p, args, context) => {
            const handler = context.datasources.steriHandler
            const id = (await handler.insert([args.object]))[0]
            return handler.get(id)
        },
        insert_steri_label: async (p, args, context) => {
            const handler = context.datasources.steriLabelHandler
            const ids = await handler.insert(args.objects)
            const labels = await Promise.all(ids.map(id => handler.get(id)))

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
        },
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
    }
};