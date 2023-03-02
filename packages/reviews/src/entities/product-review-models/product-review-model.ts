/*
* The intention of this model is to handle the information that is coming to the controller, so it´s 
* separated from the model used to handle the data inside the service.
*/


export interface IProductReviewModel{
    review_product_username: string,
    review_product_product_id: string,
    review_product_title: string,
    review_product_description: string,
    review_product_score:number
}