# Features:
# Functional Requirements

- [X] User must be able to create a transaction
- [X] User must be able to list all transactions
- [X] User must be able to view a transaction
- [X] User must be able to obtain an account summary

# Business Rules

- [X] The transaction can be credit or debit
- [X] It must be possible to identify users between transactions
- [X] Users can only see their own transactions

# Frameworks
- Fastify -> HTTP routes
- Knex  -> SQL query builder
- Vitest -> tests creation
- Supertest -> HTTP requests with vitest
- Zod -> validation for data structures
- Dotenv -> environment variables

# Installation
First you need to clone the project:
`git clone https://github.com/isaiasgabriel/api-rest-nodejs`

1. `npm install` inside the project to install all dependencies

2. `npm run knex -- migrate:latest` to create DB migrations

3. `npm run build` to build the project

After these steps you can run the server by:
`node build/server.js`

# Usage
## Creating Transactions:
First you need to create your transactions here with **POST** method:
`http://localhost:3333/transactions`
JSON:
```json
{
	"title":"your transaction",
	"amount":33,
	"type":"credit"
}
```
## Listing Transactions:
**GET** method:
`http://localhost:3333/transactions`
## Listing Transactions By Id:
**GET** method:
`http://localhost:3333/transactions/:id`
## Summary
**GET** method:
`http://localhost:3333/transactions/summary`