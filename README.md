## Routes

__Table 1.__ Summary of routes

Verb | Endpoint | Controller | Method | Description
---|---|---|---|---
POST | /newuser | user | registerUser | Creates new user in database
POST | /login | user | loginSuccess | Authenticates email and password, returns JWT if successful

# Packages used

## In production
- Express
- dotenv
- jsonwebtoken
- mongoose
- mongoose-bcrypt
- passport
- passport-local
- passport-jwt

## In development
- nodemon
- forever
- mocha
- chai
- supertest