import axios from 'axios';
import { InternalServerError, NotFoundError } from 'routing-controllers';
import * as test_helper from "../utils/helpers";
const request = require("supertest");
const expressServer = require("../../src/index");
const dotenv = require("dotenv");
dotenv.config();

const mock_get = jest.spyOn(axios, 'get');

/**
 * The tests will be grouped by the goal for the tests.
 * First group: Test to validate the url and endpoints are correct and if they are incorrect the code returns the correct error.
 * Second group: Tests to validate the error handling during the execution of the application.
 * Third group: Tests to validate the responses are ok, when all the information sent is ok.
 */

describe("Test correct use of the endpoints", () => {
   
    afterEach(() => {    
      jest.clearAllMocks();
    });

    test("When the route is not found returns 404 status code", async () => {
      const response = await request(expressServer).get("/produc");
      expect(response.statusCode).toBe(404);
    });
});

describe("Test error handler during the application execution", () => {
  afterEach(() => {    
    jest.clearAllMocks();
  });
  
  test("When Product does not exist in the Adidas API, throws Model Not Found Exception", async () => {
    mock_get.mockRejectedValueOnce(new NotFoundError("Product Not found"));

    const response = await request(expressServer).get("/product/" + test_helper.productId_incorrect);
    expect(response.statusCode).toBe(404);
    expect(axios.get).toBeCalledWith(
      `${process.env.PRODUCTBASEURL}/${process.env.PRODUCTACTIONURL}/${test_helper.productId_incorrect}`
    )
  });

  test("When there is an error during the request API execution, throws Internal Server Exception", async () => {
    mock_get.mockRejectedValueOnce(new InternalServerError("Unknown issue"));
    
    const response = await request(expressServer).get("/product/h"); //Incorrect product id
    expect(response.statusCode).toBe(500);
    expect(axios.get).toBeCalledWith(
      `${process.env.PRODUCTBASEURL}/${process.env.PRODUCTACTIONURL}/h`
    )
  });

  test("When Product API returns data, but review throws exception returns Internal Server Exception", async () =>{
    mock_get.mockImplementation((url) => {
      switch (url) {
        case `${process.env.PRODUCTBASEURL}/${process.env.PRODUCTACTIONURL}/${test_helper.productId_correct}`:
          return Promise.resolve({ data: test_helper.return_product_model });
        case `${process.env.REVIEWBASEURL}/${process.env.REVIEWACTIONURL}/${test_helper.productId_correct}`:
          throw new InternalServerError("Unknow error");
      }
    });

    const response = await request(expressServer).get("/product/"+test_helper.productId_correct); 
    expect(response.statusCode).toBe(500);
  })
})

describe("Tests to validate the requests content are ok", () =>{
  afterEach(() => {    
    jest.clearAllMocks();
  });

  test("When the model exists but there is not review for it, return model information and default values for the review object", async () => {      
    mock_get.mockImplementation((url) => {
      switch (url) {
        case `${process.env.PRODUCTBASEURL}/${process.env.PRODUCTACTIONURL}/${test_helper.productId_correct}`:
          return Promise.resolve({ data: test_helper.return_product_model });
        case `${process.env.REVIEWBASEURL}/${process.env.REVIEWACTIONURL}/${test_helper.productId_correct}`:
          return Promise.resolve({ data: test_helper.default_review_model });
      }
    });

    const response = await request(expressServer).get("/product/"+test_helper.productId_correct); 
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("product_information");
    expect(response.body).toHaveProperty("review_summary");

    let product_information = response.body.product_information;
    expect(product_information).toHaveProperty("id");
    expect(product_information).toHaveProperty("model_number");

    expect(product_information.id).toBe(test_helper.productId_correct);
    expect(product_information.model_number).toBe("LZW44");

    let review_summary = response.body.review_summary;
    expect(review_summary).toHaveProperty("product_id");
    expect(review_summary).toHaveProperty("average_review_score");
    expect(review_summary).toHaveProperty("number_reviews");

    expect(review_summary.product_id).toBe(test_helper.productId_correct);
    expect(review_summary.average_review_score).toBe(0);
    expect(review_summary.number_reviews).toBe(0);
  });
  
  test("When the model exists but there is  review for it, return model information and the review object", async () => {
    const mockGet = jest.spyOn(axios, 'get');
    
    mockGet.mockImplementation((url) => {
      switch (url) {
        case `${process.env.PRODUCTBASEURL}/${process.env.PRODUCTACTIONURL}/${test_helper.productId_correct}`:
          return Promise.resolve({ data: test_helper.return_product_model });
        case `${process.env.REVIEWBASEURL}/${process.env.REVIEWACTIONURL}/${test_helper.productId_correct}`:
          return Promise.resolve({ data: test_helper.review_model });
      }
    });

    const response = await request(expressServer).get("/product/"+test_helper.productId_correct); 
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("product_information");
    expect(response.body).toHaveProperty("review_summary");

    let product_information = response.body.product_information;
    expect(product_information).toHaveProperty("id");
    expect(product_information).toHaveProperty("model_number");

    expect(product_information.id).toBe(test_helper.productId_correct);
    expect(product_information.model_number).toBe("LZW44");

    let review_summary = response.body.review_summary;
    expect(review_summary).toHaveProperty("product_id");
    expect(review_summary).toHaveProperty("average_review_score");
    expect(review_summary).toHaveProperty("number_reviews");

    expect(review_summary.product_id).toBe(test_helper.productId_correct);
    expect(review_summary.average_review_score).toBe(3.4);
    expect(review_summary.number_reviews).toBe(3);
  });
})

