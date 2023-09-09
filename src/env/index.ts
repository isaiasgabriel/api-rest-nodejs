import { config } from 'dotenv'
import { z } from 'zod'

// Quando usamos uma ferramenta de teste como o vitest
// Ela automaticamente preenche o NODE_ENV como test

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config()
}

// envSchema -> um tipo de dado
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment format', _env.error.format())

  throw new Error('Invalid Environment variables')
}

export const env = _env.data
