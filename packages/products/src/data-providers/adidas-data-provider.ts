/**
 * All the methods needed to access Adidas public API to get the information about the products are defined 
 * in this file.
 * 
 * To avoid timeout and unneccesary call if the API is down, the Circuit Breaker policy will be applied.
 */

import { requestGet } from '../utils/gateaway-handler'
import * as CircuitBreaker from 'opossum'
import logger from '../utils/logger';
import * as dotenv from 'dotenv';

dotenv.config();

async function GetInformationFromDataSource(product_id:string){
    
    return requestGet( `${process.env.PRODUCTBASEURL}/${process.env.PRODUCTACTIONURL}/${product_id}`);
}

export async function GetProductInformationById(product_id:string){

    const options = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 30000 // After 30 seconds, try again.
      }

      const breaker = new CircuitBreaker(GetInformationFromDataSource, options)

      breaker.on('fallback', () => {
        logger.error("The Product API is not available at this moment, retry again in a couple of minutes");

        throw new Error('The Product API is not available at this moment, retry again in a couple of minutes');
      })

      return await breaker.fire(product_id)
}