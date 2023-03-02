export const productId_incorrect = "HQ890";
export const productId_correct = "HQ8901";

//The idea for this return model is to have it partial, the idea for the test is not validate the all content
export const return_product_model ={
    id: productId_correct,
    model_number: 'LZW44',
}
  
export const default_review_model ={
    product_id: productId_correct,
    average_review_score: 0,
    number_reviews: 0
}
  
export const review_model ={
    product_id: productId_correct,
    average_review_score: 3.4,
    number_reviews: 3
}
  