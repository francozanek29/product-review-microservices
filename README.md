![image](https://user-images.githubusercontent.com/69249556/222299723-3ebd9826-34c1-4d2b-bc7d-1b86f22086c6.png)

# Product Review Modeling
Using microservices, define a structure to return products information and its reviews. The product information will be returned from some public API while the review information will be returned from the database. 
The idea is to have two microservices running and collaborating with each other in order to get the functionality working.
These are my notes on  how to set up the under listed service, technology for testing, my microservice architecture comprises the below microservice services.

# Table of Contents :thought_balloon:
1. [Technology list](#Introduction-and-technology-list)
2. [Manual Set-up Guide](#Manual-Set-up-Guide)
3. [Microservice architecture](#Microservice-architecture)
4. [Authorization Process](#Authorization-process)
5. [Task Mission Statement](#Task-Mission-Statement)
6. [Thank you](#Thank-you)

## Technology list :thought_balloon:
NPM (9.5.0) Node.js(18.14.2) 

Typescript
Version 4.9.5

[MongoDB](https://www.mongodb.com/)

[Docker](http://docker.com).

[GIT](http://git.com).

[Visual Studio Code](https://code.visualstudio.com/)

**Other artifacts would have used if time permits**

[ELK].

*Elastic Search*

*Kibana*

To implement Distributed logging.

[AWS]

Use some resources 
  --> For data handling (AWS Data Streams like Amazon Kinesis or Firehose to get the data from the reviews).
  --> For data storage (S3 or DynamoDB)
  --> ECS to deploy the microservices so they are accesible in the web.
 
 
## Manual Set-up Guide :thought_balloon:

1. Clone The master branch  using the below command  `` git clone https://github.com/francozanek29/product-review-microservices.git ``
2. Make sure you have docker run on your machine [Docker website](https://www.docker.com/)
3. Run the powershell script ``startproyect.sh`` to run all the commands and mount the docker images needed.
4. When the 3 containers are up and running --> run the powershell script ``docker-compose exec commercial_db sh -c 'chmod u+x /database/seed-db.sh && /database/seed-db.sh' `` this will populate the database with some test data.
5. As a result from steps 3 y 4, you will have running on your docker 3 containers:
     1. ms_commercial-db: In which the database is running. This is running on port 5000.
     2. ms_review-service: In which the code to access the database and handle the review information is running. This is running on port 4000.
     3. ms_product-service: In which the code to access public API and connect to the second container is running. This is running on port 3000.
6. Test the functionality using the providers enpoints and architecture, you can use Postman to do. Taking into account the documentation described below.

## Microservice architecture diagram :thought_balloon:
![image](https://user-images.githubusercontent.com/69249556/222305405-e5d99a9f-3259-4025-8873-2027e991cf67.png)

For this project two microservices were defined:

1.**Product Service**: Which is charge of connect to the Public API (https://www.adidas.co.uk/api/products/{product_id}) and aggregate to this response an object with contains the information of Number of Review received by the product and the Average Score of those reviews (information received from the other service).

**The documentation for this API is [here](https://app.swaggerhub.com/apis/ZANEKFRANCO_1/ProductService/1.0.0).**


2. **Product Review Service**: Which is charge on handling all the reviews for all the products and storage them on some database (in this case in a local mongoDB database). 

**The dcoumentation for this API is [here](https://app.swaggerhub.com/apis/ZANEKFRANCO_1/ReviewService/1.0.0).**
        
 ## Authorization Process :thought_balloon:
 
 As it was mentioned above some requests demand to have an Authorization header sent. This is because the written operation should be protected for unexpected behaviours. So for this case the format needed to make sure this validation is passed, is: user_name:user_password. The password is encoded and then storage in the database. 
 After running the database script from section 2, you will have some test users in the database:
 1. fzanek:gggg
 2. testuser:test
 
 So make sure that one of this combination is attached in the header for the requests mentioned above.

## Task Mission Statement :thought_balloon:

At adidas we care about serving our customers by making use of our data and services. Those services need to cope with high volume and low latency. In general, the topic of high availability is very important to be ready for the future and deal with the current state with confidence. Additionally following aspects are playing crucial role when designing solution architectures: reusability, data & information security, infrastructure resource usage efficiency, resiliency.

Assignments:
With the information given and additional assumptions of yours, you should
develop* 2 micro-services:
1) Product Review Service: implement CRUD operations for the resource /review/{product_id}, (e. g. AB1234), and the response is a JSON with following data: Product ID, Average Review Score, Number of Reviews. In order to protect the service, authentication is needed to protect write operations. Choose any datastore for data persistence that can be easily deployed or installed with the application. The datastore should contain seeded data for a few products.

2) Product Service: The service will expose the resource /product/{product_id}, only supporting GET. The response should be an aggregation of our live Product API, (https://www.adidas.co.uk/api/products/{product_id} e.g. product_id = C77124), and the reviews retrieved from the Product Review Service for the same product_id.

Expectations:
Please use following primary tools: Typescript, NodeJS, REST API, Database
Please develop this application with a microservice approach, all services should run independently.
Please write API tests for your service endpoints.
Every person having npm and some standard tools should be able to check out the code, build and run the app locally.
Please, use English as a documentation language. Please comment complex and interesting parts of your code, so that one can follow the and understand the
implementation logic.
Upon completion, please check your solution into any public GIT repo (e.g. GitHub or Bitbucket) and share the respective link with us.

Bonus Assignments:
Please dockerize the component services and create config files for deploying them.
Please create a CI/CD pipeline proposal for the app.

## Thank you :thought_balloon:

**Thank you!!** :blush:
