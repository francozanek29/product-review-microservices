/*
* The definition adopted for the ProductReview data structure is as described below:
*  - review_product_id: is a base64 enconded value for the combination (userName+"_"+productId). 
      This is based on the assumption that each user can make a single review per product.
   - review_product_title: is a tittle given by the user. It´s a short description of the product review.
   - review_product_description: is a more descriptive description of the review.
   - review_product_score: is the valoration given by the user
   - review_product_product_id: is the product for which the review has been written
*/

import { Document, Schema, Model, model } from "mongoose";

export const productReviewSchema = new Schema({
  review_product_id:{
    type: String,
    required:true,
    unique:true
  },
  review_product_title: String,
  review_product_description: String,
  review_product_score: Number,
  review_product_product_id: String
});

export interface IProductReview extends Document {
  review_product_id: string;
  review_product_title: string;
  review_product_description: string;
  review_product_score: number;
  review_product_product_id: string
}

export const ProductReview: Model<IProductReview> = model<IProductReview>("productreview", productReviewSchema);