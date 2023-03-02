/**
 * All the services defined in this microservices are using connection to external API, so the method in charge to make the calls
 * and return the data is defined and used where it´s needed.
 */

import { AxiosError } from "axios";
import { NotFoundError } from "routing-controllers";
import logger from "./logger";

var axios = require('axios');

export async function requestGet (url: string){
    try {

        const result = await axios.get(url);
        
        return result.data as Object;

      } catch(error) {
        let err = error as AxiosError;
        logger.error("There was an error during the request execution",err);

        if(err.response?.status == 404){
            //The idea is to distinguish between 404 and the other errors
            throw new NotFoundError(err.response.statusText);
        }

        throw error;
    }
}