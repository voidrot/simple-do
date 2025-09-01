import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

const client = createClient({ url: 'file:' + (process.env.DB_FILE_NAME || 'simple-do.db') })
const db = drizzle(client)

export { db }
