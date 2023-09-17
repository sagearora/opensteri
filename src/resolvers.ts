import { Resolvers } from './__generated__/resolver-types';
import steriItemHandler from './data/steriItemHandler';

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers: Resolvers = {
    Query: {
        steri_item: () => {
            return steriItemHandler.create()
                .list()
        },
        steri_item_by_pk: (parent, args, context) => {
            console.log(args.id, context.authorization)
            return steriItemHandler.create()
                .get(args.id)
        }
    },
};