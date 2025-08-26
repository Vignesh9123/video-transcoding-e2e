import { createClient } from '@clickhouse/client'
import { CLICKHOUSE_PASSWORD, CLICKHOUSE_URL, CLICKHOUSE_USERNAME } from './env'

export const clickhouseClient = createClient({
  url:CLICKHOUSE_URL,
  username: CLICKHOUSE_USERNAME,
  password: CLICKHOUSE_PASSWORD,
})

