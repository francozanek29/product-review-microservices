import "reflect-metadata";
import {createExpressServer } from "routing-controllers";
import {ProductController} from "../src/controllers/products-controller";
import {HttpErrorHandler} from "./middleware/error-handler";
import logger from "./utils/logger";
import * as dotenv from 'dotenv';

const expressApp = createExpressServer({
    middlewares: [
        // custom middlewares
        HttpErrorHandler
      ],
    controllers: [
        ProductController,
    ],
    defaultErrorHandler: false,
});


dotenv.config();
const port = process.env.PORT;
expressApp.listen(port);

logger.info(`⚡️ Server listening on http://localhost:${port}`);

module.exports = expressApp;