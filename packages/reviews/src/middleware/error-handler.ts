/**
 * This class is defined to have a better error handler and show prettiest message to the user.
 * So they only see the information that matter and if it´s needed we look at the logs to determinate 
 * what happened.
 */

import { Middleware, NotFoundError, ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'after' })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err: any) => any) {
        let http_status_code;
        let error_to_show;

        if (error instanceof NotFoundError) {
            http_status_code = 404;
            error_to_show = {
                message: "The requested product does not exist"
            }
        }else{
            http_status_code = 500;
            error_to_show = {
                message: "There was an internal issue, please contact support"
            }
        }

        response.status(http_status_code).json(error_to_show);

        next(error);
    }
}


