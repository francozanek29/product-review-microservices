/*
* The return model to show the information needed for the average rating for a product
*/

export interface IProductReviewResume{
    product_id: string,
    average_review_score: number;
    number_reviews: number;
}