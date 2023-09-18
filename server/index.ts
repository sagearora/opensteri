import { configDotenv } from 'dotenv';
configDotenv()

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import Express, { json } from 'express';
import { readFileSync } from 'fs';
import morgan from 'morgan';
import { ApolloContext } from './ApolloContext';
import printHandler from './src/data/printHandler';
import steriCycleHandler from './src/data/steriCycleHandler';
import steriHandler from './src/data/steriHandler';
import steriItemHandler from './src/data/steriItemHandler';
import steriLabelHandler from './src/data/steriLabelHandler';
import userHandler from './src/data/userHandler';
import { resolvers } from './src/resolvers';

const app = Express()
const port = 8080

const server = new ApolloServer<ApolloContext>({
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
                            printHandler: printHandler.create(),
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