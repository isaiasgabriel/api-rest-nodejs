import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // { title , amount , type : credit or debit}

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // puxando caso haja sessionId
    let sessionId = request.cookies.sessionId

    // se não houver vamos criar
    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions').where(
        'session_id',
        sessionId,
      )
      return { transactions }
      // coloco dentro do objeto pra em caso de necessidade
      // poder retornar mais valores junto de transactions
    },
  )

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const getTransactionsParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamSchema.parse(request.params)

    // não esquecer do await ao usar knex
    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return { transaction }
  })

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return { summary }
    },
  )
}
