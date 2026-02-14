import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'postgres_db_lowkey',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'pass',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> {
    const start = Date.now();
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
        console.log('[DB]', { text: text.substring(0, 80), duration, rows: result.rowCount });
    }
    return result;
}

export async function getOne<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<T | null> {
    const result = await query<T>(text, params);
    return result.rows[0] || null;
}

export async function getMany<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<T[]> {
    const result = await query<T>(text, params);
    return result.rows;
}

export default pool;
