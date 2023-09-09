import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Transaction Routes', () => {
  // vai carregar todos os plugins da aplicação
  beforeAll(async () => {
    await app.ready()
  })

  // depois de rodar o teste vai fechar a aplicação
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    // o supertest sempre precisa receber o servidor do node:
    await request(app.server)
      // não esquecer do /
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 1500,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    // salvar essa request em uma const pra puxar os cookies
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'my transaction',
        amount: 1500,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // lembrar de importar no vitest
    // esse expect e o expect da request são pacotes diferentes
    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'my transaction',
        amount: 1500,
      }),
    ])
  })

  it('should be able to get a transaction by ID', async () => {
    // salvar essa request em uma const pra puxar os cookies
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'my transaction',
        amount: 1500,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    // não esquecer de deixar o transaction no singular
    // porque na rota ele retorna somente transaction
    // lembrar de tirar o array também porque o transacion é só um objeto
    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'my transaction',
        amount: 1500,
      }),
    )
  })

  it.only('should be able get a summary', async () => {
    // salvar essa request em uma const pra puxar os cookies
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'my first',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'my second transaction',
        amount: 2000,
        type: 'debit',
      })
      .expect(201)

    const listTransactionResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    // lembrar de importar no vitest
    // esse expect e o expect da request são pacotes diferentes
    expect(listTransactionResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
