![image](https://user-images.githubusercontent.com/69249556/222299723-3ebd9826-34c1-4d2b-bc7d-1b86f22086c6.png)

# Product Review Modeling
Using microservices, define a structure to return products information and its reviews. The product information will be returned from some public API while the review information will be returned from the database. 
The idea is to have two microservices running and collaborating with each other in order to get the functionality working.
These are my notes on  how to set up the under listed service, technology for testing, my microservice architecture comprises the below microservice services.

# Table of Contents :thought_balloon:
1. [Introduction and technology list](#Introduction-and-technology-list)
2. [Manual Set-up Guide](#Manual-Set-up-Guide)
3. [Microservice architecture diagram](#Microservice-architecture-diagram)
5. [Jenkins Pipeline Sketch](#Jenkins-Pipeline-Sketch)
6. [Application Request Screenshot](#Application-Request-Screenshot)
7. [Improvements to be worked on if i had an extra 2days for the task](#Improvements-to-be-worked-on-if-i-had-an-extra-2days-for-the-task)
8. [Task Mission Statement](#Task-Mission-Statement)
9. [Thank you](#Thank-you)

## Introduction and technology list :thought_balloon:
[NPM](https://www.npmjs.com/)
Version 6.14.14

[Typescript]
Version 4.9.5

[MongoDB](https://www.mongodb.com/)

[Docker](http://docker.com).

Containerization Application 

[GIT](http://git.com).

Source code repository

[Visual Studio Code](https://code.visualstudio.com/)
Code Editor

**Other artifacts would have implemented if time permits**

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
3. Go inside of each sub-project folder (./packages/products and ./packages/reviews) and install all the dependencies (`` npm install``)
4. Go to the project root folder and execute the command ``npm run start:docker``. This will create the docker images and will export them into docker. Take into account the first time might take some time to build and export the images. If you don´t have the mongoDB image download, the process will take a couple of minutes to download and install it.
5. As a result from step 4, you will have running on your docker 3 containers:
     1. ms_commercial-db: In which the database is running. This is running on port 5000.
     2. ms_review-service: In which the code to access the database and handle the review information is running. This is running on port 4000.
     3. ms_product-service: In which the code to access public API and connect to the second container is running. This is running on port 3000.
6. Go to the root folder and run this command ``docker-compose exec commercial_db sh -c 'chmod u+x /database/seed-db.sh && /database/seed-db.sh' `` this will populate the database with some test data.
7. Test the functionality using the providers enpoints and architecture.

## Microservice architecture diagram :thought_balloon:
![image](https://user-images.githubusercontent.com/69249556/222305405-e5d99a9f-3259-4025-8873-2027e991cf67.png)

For this project two microservices were defined:

1.**Product Service**: Which is charge of connect to the Public API (https://www.adidas.co.uk/api/products/{product_id}) and aggregate to this response an object with contains the information of Number of Review received by the product and the Average Score of those reviews (information received from the other service).

![image](https://user-images.githubusercontent.com/69249556/222306020-041f7f1a-2333-4df7-a5aa-4b15087657b9.png)


In the service the endpoint available is:
_product/{product_id}_: For which no authentication or authorization is needed, and the responses according to the possible http status code will be:

  a. **Status Code = 200**  This case represents the success of the request, the response will be the one shown above.
  b. **Status Code = 404**  This case represents an exception thrown by the API to show the Product sent in the request was not found in the public API, however if the product is found in the API but not in the Product Review Service, this will not be an issue because this mean that there are not reviews for the product, so default values are shown. An example of this status code is shown below:
 
 ![image](https://user-images.githubusercontent.com/69249556/222307645-cb6ea450-f139-44aa-9f84-13e8b2907e3e.png)

  c. **Status Code = 500** This case represent an internal error during the execution of the request. An example for this response is shown below:
  ![image](https://user-images.githubusercontent.com/69249556/222307754-7d7d535a-bbee-4523-87fe-9a79f0aa6f8e.png)


2. 
