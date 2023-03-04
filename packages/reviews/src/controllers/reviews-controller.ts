/*
* Entry point for all the processes run in the micro-services
* The service class is used to separate the controller from the data manipulation.
*/

import { JsonController, Get, Param, UseBefore, Req, Post, Body, Delete, Put } from "routing-controllers";
import * as productReviewService from "../services/product-review-service";
import { IProductReviewModel } from "../entities/product-review-models/product-review-model";
import { AuthenticationHandler } from "../middleware/authentication-middleware";

const succesMessage = "The requested operation was executed successfully."

@JsonController()
export class ReviewsController{

    @Get('/health')
    async CheckHealthEndpoint(){
        return await "Everything looks good";
    }
    
    @Get('/review/:product_id')
	async GetProductReviewSummary(@Param("product_id") product_id: string){
        return await productReviewService.GetSummaryReviewsByProductId(product_id);
    }

    @Get('/review/id/:review_id')
    async GetReviewById(@Param("review_id") review_id: string){
        return await productReviewService.GetReviewById(review_id);
    }

    @Get('/review/all/:product_id')
    async GetAllProductReviews(@Param("product_id") product_id: string){
        return await productReviewService.GetAllReviewsByProductId(product_id);
    }

    @Delete('/review/:review_id')
    @UseBefore(AuthenticationHandler)
    async DeleteReviewById(@Param("review_id") review_id: string){
        await productReviewService.DeleteProductReviewById(review_id);

        return succesMessage; 
    }

    @Post('/review')
    @UseBefore(AuthenticationHandler)
    async AddNewReview(@Body() data: IProductReviewModel){
        await productReviewService.AddNewProductReview(data);

        return succesMessage; 
    }

    @Put('/review/:review_id')
    @UseBefore(AuthenticationHandler)
    async UpdateReview(@Body() data: IProductReviewModel,@Param("review_id") review_id: string){
        await productReviewService.UpdateProductReview(data,review_id);

        return succesMessage; 
    }
}