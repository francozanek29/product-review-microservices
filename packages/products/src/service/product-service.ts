/**
 * This class will be in charge of comunicate the controller and the database
 * If there is any calculation of there is anything else needed to add the return model
 * this class will be in charge of doing it and return the object with all the information
 * populated correctly.
 *
 */

import * as adidasDataProvider from '../data-providers/adidas-data-provider';
import * as reviewDataProvider from '../data-providers/review-data-provider';
  

export async function HandleData(productId:string){

    let [product_information,review_summary] = await Promise.all([adidasDataProvider.GetProductInformationById(productId),
        reviewDataProvider.GetReviewInformationByProductId(productId)]);

    const product_information_review = {
        product_information: product_information,
        review_summary: review_summary
    }

    return product_information_review;
}