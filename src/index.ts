import { configDotenv } from 'dotenv';
configDotenv()

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import Express, { json } from 'express';
import { readFileSync } from 'fs';
import morgan from 'morgan';
import { resolvers } from './resolvers';
import steriItemHandler, { SteriItemHandler } from './data/steriItemHandler';
import userHandler, { UserHandler } from './data/userHandler';
import steriHandler, { SteriHandler } from './data/steriHandler';
import steriLabelHandler, { SteriLabelHandler } from './data/steriLabelHandler';
import steriCycleHandler, { SteriCycleHandler } from './data/steriCycleHandler';

const app = Express()
const port = 8080

export interface MyContext {
    authorization: string | undefined
    datasources: {
        steriItemHandler: SteriItemHandler
        userHandler: UserHandler
        steriHandler: SteriHandler
        steriLabelHandler: SteriLabelHandler
        steriCycleHandler: SteriCycleHandler
    }
}

const server = new ApolloServer<MyContext>({
    typeDefs: readFileSync('./schema.graphql', { encoding: 'utf-8' }),
    resolvers,
})

app.use(morgan('tiny'))
app.use(Express.static('public'))

try {
    server.start()
        .then(() => {
            app.use('/graphql',
                cors<cors.CorsRequest>(),
                json(),
                expressMiddleware(server, {
                    context: async ({ req }) => ({ 
                        authorization: req.headers.authorization,
                        datasources: {
                            steriItemHandler: steriItemHandler.create(),
                            userHandler: userHandler.create(),
                            steriHandler: steriHandler.create(),
                            steriLabelHandler: steriLabelHandler.create(),
                            steriCycleHandler: steriCycleHandler.create(),
                        }
                    })
                })
            )
            app.listen(port, () => {
                console.log(`Server running on http://localhost:${port}`)
            })
        })
} catch (error: any) {
    console.log(`Error occurred: ${error.message}`)
}