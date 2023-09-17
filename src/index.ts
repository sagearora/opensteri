import { configDotenv } from 'dotenv';
configDotenv()

import express, { Application } from 'express';
import morgan from 'morgan';
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";

const app: Application = express()
const port = 8080

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'))
app.use(express.static('public'))

const router = express.Router();
RegisterRoutes(router);
app.use('/api', router);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: '/swagger.json'
        }
    })
)

try {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    })
} catch (error: any) {
    console.log(`Error occurred: ${error.message}`)
}