import * as test_helper from "../utils/helper";
const request = require("supertest");
const expressServer = require("../../src/index");
const dotenv = require("dotenv");
dotenv.config();
import { User } from "../../src/entities/user-models/user-model";
import { ProductReview } from "../../src/entities/product-review-models/product-review";
import { InternalServerError } from "routing-controllers";
import logger from "../../src/utils/logger";

/**
 * All the tests were written using the AAA pattern.
 */


describe("Tests to validate the endpoints uses are ok", () => {

  test("When the get route is not found returns 404 status code", async () => {
    
    const response = await request(expressServer).get("/revie");
    expect(response.statusCode).toBe(404);
  });

  test("When the post route is not found returns 404 status code", async () => {
    const response = await request(expressServer)
      .post("/revie")
      .send({});

    expect(response.statusCode).toBe(404);
  });

  test("When the put route is not found returns 404 status code", async () => {
    const response = await request(expressServer)
      .put("/revie")
      .send({});

    expect(response.statusCode).toBe(404);
  });

  test("When the delete route is not found returns 404 status code", async () => {
    const response = await request(expressServer).delete("/revie")

    expect(response.statusCode).toBe(404);
  });
});

const user_mock = jest.spyOn(User, "findOne");
user_mock.mockResolvedValue(test_helper.user_to_be_returned);

describe("Tests to validate authorization header is handled correctly", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("When the header is sent, return Unauthorized", async () => {
    const response = await request(expressServer).delete("/review/:review_id");

    expect(response.statusCode).toBe(401);
  });

  test("When the format for the username:password is wrong, throws Unauthorized", async()=>{
    const response = await request(expressServer)
      .delete("/review/:review_id")
      .set('Authorization',"fzanekggg")

    expect(response.statusCode).toBe(401);
  })
  
  test("When the credentials are incorrect, throws Unauthorized", async()=>{
    const response = await request(expressServer)
      .delete("/review/:review_id")
      .set('Authorization',"fzanek:ggg")

    expect(response.statusCode).toBe(401);
  })

});

const product_review_find_one_mock = jest.spyOn(ProductReview,"findOne");
const product_reviews_mock = jest.spyOn(ProductReview,"find");
const review_id = "review_id";
const product_id = "HQ8901";

describe("Tests to validate Get verbs",()=>{
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("When the Review does not exist, Get By Id throws Model Not Found Exception", async ()=>{
    product_review_find_one_mock.mockResolvedValue(null);

    const response = await request(expressServer).get("/review/id/"+review_id);

    expect(response.statusCode).toBe(404);
  });

  test("When there was an error getting a review by id, throws Internal Server Error", async () =>{
    product_review_find_one_mock.mockRejectedValue(new InternalServerError("Unknown issue"));
    logger.error = jest.fn();

    const response = await request(expressServer).get("/review/id/"+review_id);

    expect(response.statusCode).toBe(500);
    expect(logger.error).toHaveBeenCalledWith("Unknown issue");
  })

  test("When everything is ok, return the review model", async () =>{
    product_review_find_one_mock.mockResolvedValue(test_helper.product_review_model);
    
    const response = await request(expressServer).get("/review/id/"+review_id);
    expect(response.statusCode).toBe(200);

    var body = response.body;
    expect(body).toHaveProperty("review_product_id");
    expect(body).toHaveProperty("review_product_title");
    expect(body).toHaveProperty("review_product_description");
    expect(body).toHaveProperty("review_product_score");
    expect(body).toHaveProperty("review_product_product_id");

    expect(body.review_product_id).toBe("someId");
    expect(body.review_product_title).toBe("someTitle");
    expect(body.review_product_description).toBe("someDescription");
    expect(body.review_product_score).toBe(0);
    expect(body.review_product_product_id).toBe("productId");
  });

  test("When there was an error getting all reviews associated to a product, throws Internal Server Error", async () =>{
    product_reviews_mock.mockRejectedValue(new InternalServerError("Unknown issue"));
    logger.error = jest.fn();

    const response = await request(expressServer).get("/review/"+product_id);

    expect(response.statusCode).toBe(500);
    expect(logger.error).toHaveBeenCalledWith("Unknown issue");

  });

  test("When there was not any review for a product, return default product review model", async () =>{
    product_reviews_mock.mockResolvedValue([]);
    logger.info = jest.fn();

    const response = await request(expressServer).get("/review/"+product_id);

    expect(response.statusCode).toBe(200);
    expect(logger.info).toHaveBeenCalledWith(`There were not reviews for the product ${product_id}. Default values will be returned`);

    var body = response.body;
    expect(body).toHaveProperty("product_id");
    expect(body).toHaveProperty("average_review_score");
    expect(body).toHaveProperty("number_reviews");

    expect(body.product_id).toBe(product_id);
    expect(body.average_review_score).toBe(0);
    expect(body.number_reviews).toBe(0);
  });

  test("When there are some reviews for a product, return the correct product review model", async () =>{
    product_reviews_mock.mockResolvedValue([
      test_helper.first_products_review_models,
      test_helper.second_products_review_models
    ]);

    const response = await request(expressServer).get("/review/"+product_id);

    expect(response.statusCode).toBe(200);
    
    var body = response.body;
    expect(body).toHaveProperty("product_id");
    expect(body).toHaveProperty("average_review_score");
    expect(body).toHaveProperty("number_reviews");

    expect(body.product_id).toBe(product_id);
    expect(body.average_review_score).toBe(3.5);
    expect(body.number_reviews).toBe(2);
  });
});

const product_review_find_one_and_update_mock = jest.spyOn(ProductReview,"findOneAndUpdate");
describe("Tests for Put verb",()=>{
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("When there was an error updating a review, throws Internal Server Error", async () =>{
    product_review_find_one_and_update_mock.mockRejectedValue(new InternalServerError("Unknown issue"));
    logger.error = jest.fn();

    const response = await request(expressServer)
        .put("/review/ff")
        .send({})
        .set('Authorization', 'fzanek:gggg') 

    expect(response.statusCode).toBe(500);
    expect(logger.error).toHaveBeenCalledWith("Unknown issue");
  });

  test("When the update operation was sucessful, returns http status code 200", async () =>{
    product_review_find_one_and_update_mock.mockResolvedValue(true);

    const response = await request(expressServer)
        .put("/review/ff")
        .send({ 
          "review_product_username": "fzanek",
          "review_product_product_id": "dcgh",
          "review_product_title":"sometitle",
          "review_product_description": "somedescfffsfsafsfriptionfffff",
          "review_product_score":4
        })
        .set('Authorization', 'fzanek:gggg') 

    expect(response.statusCode).toBe(200);
    expect(product_review_find_one_and_update_mock).toHaveBeenCalled();
  });

});

const product_review_model_save_mock = jest.spyOn(ProductReview.prototype, "save");

describe("Tests for Post verb",()=>{
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("When there was an error adding a review, throws Internal Server Error", async () =>{
    product_review_model_save_mock.mockRejectedValue(new InternalServerError("Unknown issue"));
    logger.error = jest.fn();

    const response = await request(expressServer)
        .post("/review")
        .send({})
        .set('Authorization', 'fzanek:gggg') 

    expect(response.statusCode).toBe(500);
    expect(logger.error).toHaveBeenCalledWith("Unknown issue");
  });

  test("When the add operation was sucessful, returns http status code 200", async () =>{
    product_review_model_save_mock.mockResolvedValue([]);

    const response = await request(expressServer)
        .post("/review")
        .send({ 
          "review_product_username": "fzanek",
          "review_product_product_id": "dcgh",
          "review_product_title":"sometitle",
          "review_product_description": "somedescfffsfsafsfriptionfffff",
          "review_product_score":4
        })
        .set('Authorization', 'fzanek:gggg') 

    expect(response.statusCode).toBe(200);
    expect(product_review_model_save_mock).toHaveBeenCalled();
  });
});


const product_review_model_fine_one_delete_mock = jest.spyOn(ProductReview,"findOneAndDelete");

describe("Tests for Delete verb",()=>{

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("When there was an error deleting a review, throws Internal Server Error", async () =>{
    product_review_model_fine_one_delete_mock.mockRejectedValue(new InternalServerError("Unknown issue"));
    logger.error = jest.fn();

    const response = await request(expressServer)
      .delete("/review/:review_id")
      .set('Authorization', 'fzanek:gggg');

    expect(response.statusCode).toBe(500);
    expect(logger.error).toHaveBeenCalledWith("Unknown issue");
  });

  test("When the add operation was sucessful, returns http status code 200", async () =>{
    product_review_model_fine_one_delete_mock.mockResolvedValue(true);

    const response = await request(expressServer)
      .delete("/review/:review_id")
      .set('Authorization', 'fzanek:gggg');

    expect(response.statusCode).toBe(200);
    expect(product_review_model_fine_one_delete_mock).toHaveBeenCalled();
  });
});