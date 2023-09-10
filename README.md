# Features:
## Functional Requirements

- [X] User must be able to create a transaction
- [X] User must be able to list all transactions
- [X] User must be able to view a transaction
- [X] User must be able to obtain an account summary

## Business Rules

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

# Usage
`https://api-nodejs-a88n.onrender.com/transactions`
## Creating Transactions:
First you need to create your transactions here with **POST** method:
`https://api-nodejs-a88n.onrender.com/transactions`
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
`https://api-nodejs-a88n.onrender.com/transactions`
## Listing Transactions By Id:
**GET** method:
`https://api-nodejs-a88n.onrender.com/transactions/:id`
## Summary
**GET** method:
`https://api-nodejs-a88n.onrender.com/transactions/summary`