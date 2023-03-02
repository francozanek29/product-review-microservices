import {Action, createExpressServer, UnauthorizedError} from "routing-controllers";
import connectDB from "./utils/database/connect-db";
import {ReviewsController} from "../src/controllers/reviews-controller";
import "reflect-metadata";
import logger from "./utils/logger";
import * as dotenv from 'dotenv';
import { AuthenticationHandler } from "./middleware/authentication-middleware";
import { HttpErrorHandler } from "./middleware/error-handler";

connectDB();

const expressApp = createExpressServer({
    middlewares: [
        AuthenticationHandler,
        HttpErrorHandler
    ],
    controllers: [
        ReviewsController,
    ],
    defaultErrorHandler: false
});


dotenv.config();
const port = process.env.PORT;
expressApp.listen(port);

logger.info(`⚡️ Server listening on http://localhost:${port}`);

module.exports = expressApp;