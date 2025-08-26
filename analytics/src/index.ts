import { createClient } from '@clickhouse/client'
import { CLICKHOUSE_PASSWORD, CLICKHOUSE_URL, CLICKHOUSE_USERNAME } from './config'

void (async () => {
  const client = createClient({
    url:CLICKHOUSE_URL,
    username: CLICKHOUSE_USERNAME,
    password: CLICKHOUSE_PASSWORD,
  })
  const rows = await client.query({
    query: 'SELECT 1',
    format: 'JSONEachRow',
  })
  console.log('Result: ', await rows.json())
})()