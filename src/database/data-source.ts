import 'dotenv/config'
import { join } from 'path'
import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, 'entities', '*.{ts,js}')],
  synchronize: false,
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  logging: process.env.DB_LOGGING === 'true' ? 'all' : false
})
