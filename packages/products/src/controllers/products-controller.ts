/*
* Entry point for all the processes run in the micro-services
* The service class is used to separate the controller from the data manipulation.
*/

import { JsonController, Get, Param } from "routing-controllers";
import * as productService from '../service/product-service'

@JsonController()
export class ProductController{

    @Get('/product/:product_id')
	async GetProductId(@Param("product_id") product_id: string){
        return await productService.HandleData(product_id);
    }

    @Get('/health')
    async CheckHealthEndpoint(){
        return await "Everything looks good";
    }
    
}