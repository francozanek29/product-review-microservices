/**
 * This class will be in charge of comunicate the controller and the database
 * If there is any calculation of there is anything else needed to add the return model
 * this class will be in charge of doing it and return the object with all the information
 * populated correctly.
 * 
 */
import { MongooseError } from "mongoose";
import { NotFoundError } from "routing-controllers";
import { ProductReview } from "../entities/product-review-models/product-review";
import { IProductReviewModel } from "../entities/product-review-models/product-review-model";
import { IProductReviewResume } from "../entities/product-review-models/product-review-resume";
import logger from '../utils/logger';


export async function GetReviewById(review_id:string){
    let reviewProductModel;

    try{
        
        reviewProductModel = await ProductReview.findOne({ review_product_id: review_id },null,{lean: true});

    }catch(error){
        LogMongooseError(error);
    }  
    
    if(!reviewProductModel){
        throw new NotFoundError(`The review ${review_id} does not exist`);
    }

    return reviewProductModel;
}

export async function DeleteProductReviewById(review_id:string){ 
    try{

        return await ProductReview.findOneAndDelete({review_product_id: review_id});

    }catch(error){
        LogMongooseError(error);
    }
}

export async function AddNewProductReview(product_review_to_be_added:IProductReviewModel){
    var newProductReview = new ProductReview({
        review_product_id : Buffer.from(product_review_to_be_added.review_product_username+"_"+product_review_to_be_added.review_product_product_id).toString('base64'),
        review_product_description : product_review_to_be_added.review_product_description,
        review_product_product_id : product_review_to_be_added.review_product_product_id,
        review_product_score : product_review_to_be_added.review_product_score,
        review_product_title : product_review_to_be_added.review_product_title
    });

    try{

       await newProductReview.save();

    }catch(error){
        LogMongooseError(error);
    }
}

export async function UpdateProductReview(product_review_to_be_updated:IProductReviewModel, review_product_id: string){
    try{
        await ProductReview.findOneAndUpdate({review_product_id: review_product_id},
        {
            review_product_title : product_review_to_be_updated.review_product_title,
            review_product_description : product_review_to_be_updated.review_product_description,
            review_product_score : product_review_to_be_updated.review_product_score
        },
        {new: true})

    }catch(error){
        LogMongooseError(error);
    }
}


export async function GetAllReviewsByProductId(product_id:string){
    try{

        return await ProductReview.find({review_product_product_id:product_id},null,{lean: true});

    }catch(error){
        LogMongooseError(error);
    }
    
}

export async function GetSummaryReviewsByProductId(product_id:string) {
    
    //All the reviews for the product are recovered and taking into account this the information is calculated

    let products_reviews = await GetAllReviewsByProductId(product_id);
       
    let average_review_score = 0;
    let number_reviews = 0;

    if(products_reviews != null && products_reviews.length > 0){

        //we only do the maths if only there are some reviews for the product
        number_reviews = products_reviews.length;
        average_review_score = products_reviews.reduce((a,u) => a + u.review_product_score,0)/products_reviews.length;
    }else{
        logger.info(`There were not reviews for the product ${product_id}. Default values will be returned`)
    }
    
    let product_review_summary: IProductReviewResume={
        product_id: product_id,
        average_review_score: average_review_score,
        number_reviews: number_reviews
    }
   
    return product_review_summary;
}

function LogMongooseError(error:any){

    logger.error((error as MongooseError).message);

    throw new Error("There was an error during the operation execution, look at the logs for more information");
}