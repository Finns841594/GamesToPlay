# A database-driven Cart API

In this exercise, you will create storage for carts in MongoDb and read data from a product database in PostGres SQL. All of the application functionality will be exposed through an API with 4 endpoints.

Here are the endpoints you need to implement:

* POST `/api/carts/` - to create a new cart. To help you get a better understanding of the code structure this has been partially implemented but is still missing the connection to MongoDb.
When this endpoint is invoked you should:
  * Create a new cart in MongoDb
    * create it in a MongoDb database called `saltcarts`, in a collection called `carts` (these are set up in the container config)
  * return suitable status codes (implemented)
  * return the cart with the default cart structure initialised. (implemented)
  * return a location header `/api/cart/:cartId` where the id is the id of the cart. (implemented)
  * There is no request body in this request. An _empty_ cart is always created. (implemented)

* GET `/api/carts/:cartId` - returns the cart data
  * Return the data in the following format, with the appropriate content type. This cart has two example products, but there might be 0.

  ```json
  {
    "cartid" : "82479462-af95-4b88-bcef-4bf8f4261a4a",
    "products": [
      { "productId": "3a9f1a05-390e-4109-8072-ac7a1caa7001", "name": "A key ring", "price": 0.85, "quantity": 2},
      { "productId": "fe3e8d33-a0bc-4606-b1b3-eb59b645b94b", "name": "Playing cards", "price": 4.85, "quantity": 4}
    ],
    "totalNumberOfItems" : 6,
    "totalPrice" : 21.1
  }
  ```

  * use suitable status codes for success and failure
    * for failure - return a body like this `{ message: 'A description of the error'}`

* POST `/api/carts/:cartId/products/` - add a product to the given cart
  * Post the id of the product and the quantity to the endpoint:

  ```json
  { "productId": "fe3e8d33-a0bc-4606-b1b3-eb59b645b94b", "quantity": 123 }
  ```

  * Get the cart from MongoDb, using the `:cartId` parameter
  * Get the product information (name, description, price) from PostGres SQL using the product `id` in the posted body.
    * The valid product ids are initialized through a script (`./containerConfig/initSql.sql`), so you can pick up valid ids from that script. Or by opening the pgAdmin tool, and check the `public.salt_products` table.
  * Add the products to the cart products, with the quantity.
  * Re-calculate the `totalPrice` and `totalNumberOfItems`
  * Store the updated cart to MongoDb
  * Return the updated cart data, using correct REST principles

* DELETE `/api/carts/:cartId` - delete the cart
  * Use the cartId in the request to remove the cart.
  * Apply proper rest principles.

## Get started

* Get and clone this repo.
* `npm i`
* Make sure to start Docker in your machine
* In a new terminal window run: `npm run docker:init` (this configures the setup)
* Then run `docker compose up` or `npm run docker:start`
* If you want to restart the database, but not destroy the data you have created `npm run docker:start`
* If you want to shut down `npm run docker:close`
* Run tests `npm t` which will `npm run lint` for you
* Run the API for testing via PostMan or Curl - `npm start`

If you are interested in the docker setup for this test you can read more about that [here](./dockerSetup.md)

## Handing in the solution

Upload the solution files (`index.ts` , the `carts`and `products` folders and all other ts files you are importing (or requiring)) in a folder called `dbCartApi`. Do not upload `node_modules`, `package*.json`, `containerConfig`, tests etc...

## Test and evaluation

We have supplied you with many tests which we will run against your API.

You can use the [instructions here to ensure](https://appliedtechnology.github.io/protips/failOnlyOneTest) that you don't get many failing tests at once.

You are more than welcome to write your own tests - but remember that when you are working with tests that intereact with a database you need to think about cleaning up the data.

As an example, look in the tests.ts how we use a `before` to make sure we create test data when needed and make sure that is `deleted` after the test has completed.

### FAQ

> How do I know how many items are in stock so I dont add too many to the cart? 

The Salt products are made on demand so you can add as many items as you'd like.
# GamesToPlay-Backend
