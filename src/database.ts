import { knex as knexSetup, Knex } from 'knex'
// Knex maiúsculo = interface
import { env } from './env'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
    // ./ se refere à raiz do projeto
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}
// knex = instância do knex configurada
export const knex = knexSetup(config)
