import {config} from 'dotenv'
config()
export const CLICKHOUSE_USERNAME = String(process.env.CLICKHOUSE_USERNAME || '');
export const CLICKHOUSE_PASSWORD = String(process.env.CLICKHOUSE_PASSWORD || '');
export const CLICKHOUSE_URL = String(process.env.CLICKHOUSE_URL || '');
export const PORT = Number(process.env.PORT || 5000);