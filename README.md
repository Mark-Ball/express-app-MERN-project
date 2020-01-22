## Routes

__Table 1.__ Summary of routes

Verb | Endpoint | Controller | Method | Description
---|---|---|---|---
POST | /newuser | user | registerUser | Creates new user in database
POST | /login | user | loginSuccess | Authenticates email and password, returns JWT if successful

# Packages used

## In production
- Express: a fast unopinionated, minimalist framework for node. Express is the web server within our application, with the role of routing incoming HTTP requests and using middleware to modify those requests before they arrive at the controllers.
- dotenv: allows variables declared in an environment (.env) file to be read. This is important because the application may connect to a different database, or be hosted on a different port depending on environments. 
- jsonwebtoken: creates a json web token (JWT) by hashing information related to the user (in our case we used the document id from MongoDB) and a secret string we save in our .env file. JWTs are a way to securely transmit information between parties as a JSON object. The information can be verified because it is digitally signed.
- mongoose: a MongoDB object modeling tool designed to work in asychronous environments. Allows the creation of schemas to control the information being written to the database, and the creation of models with methods to create, read, update, or delete documents in the relevant collection.
- mongoose-bcrypt: a mongoose plugin to encrypt information being saved into MongoDB and verify that incoming data is the same as the encrypted version. Used in this application to encrypt passwords when users register, and verify that passwords when the user attempts to login is correct. 
- Passport: express-compatible authentication middleware for Node.js. Passport authenticates requests using strategies which are defined in the two packages below and allows access to the route protected by the middleware if authentication succeeds, or returning a 400-series status code if authentication fails.
- passport-local: integrates into passport to authenticate users with a username and password. In this application, the email a user provides when they log in is used to find the corresponding document in the users collection. If there is no user or the password they provide fails verification, the passport middleware prevents the user from accessing the route.
- passport-jwt: integrates into passport to authenticate users with JSON web tokens. 

## In development
- nodemon: automatically restarts the node application when file changes are detected. Helpful in development because of the frequent file changes which we want to be able to observe the effect of immediately. Not used in production because we do not expect to be making frequent changes to code in the production environment.
- forever
- mocha
- chai
- supertest