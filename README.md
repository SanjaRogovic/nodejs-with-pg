# Connecting NodeJS application to PostgreSQL

Creating a small RESTful API using Node + Express + a PostgreSQL database that will serve the client with some data about users and their orders.


*** EXTRA ***

- Validate all the data coming from the users/orders for the Post/Put routes (https://express-validator.github.io/docs/index.html)
- Create a separate module for your pool object (https://node-postgres.com/guides/async-express)
  
- Create a user route that will return all the orders of a user
GET /:id/orders : To get all orders linked to a specific user

- Create another user route that will set a user as inactive if he has never ordered anything:
PUT /:id/check-inactive : If a user has never ordered, he should be set as inactive

- Separate routes in 2 router files. One for Users, one for Orders: https://expressjs.com/en/guide/routing.html


