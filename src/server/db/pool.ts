import InternalServerError from '../errors/internal-server';
import { Pool } from 'pg';

const port = process.env.POSTGRES_PORT
const password = process.env.POSTGRES_PASSWORD
const user = process.env.POSTGRES_USER
const host = process.env.POSTGRES_HOST

if (!port || !password || !user || !host) {
    throw new InternalServerError('Missing port, password, user, or host.')
}

export default new Pool ({
    max: 20,
    connectionString: process.env.POSTGRES_URI,
    connectionTimeoutMillis: 30000,
    host: host,
    user: user,
    password: password,
    port: Number(port)
});