import { configDotenv } from 'dotenv';
configDotenv()

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import Express, { json } from 'express';
import morgan from 'morgan';
import { resolvers } from './resolvers';
import { readFileSync } from 'fs';
import { SteriItemOutput } from './data/steriItemHandler';
import { startStandaloneServer } from '@apollo/server/dist/esm/standalone';

const app = Express()
const port = 8080

export interface MyContext {
    authorization: string | undefined
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
                    context: async ({ req }) => ({ authorization: req.headers.authorization })
                })
            )
            app.listen(port, () => {
                console.log(`Server running on http://localhost:${port}`)
            })
        })
} catch (error: any) {
    console.log(`Error occurred: ${error.message}`)
}