import { config } from '../../config'
import { Pool } from 'pg';

export default new Pool ({
    max: config.postgresMax,
    connectionTimeoutMillis: config.postgresConnectionTimeoutMillis,
    host: config.postgresHost,
    user: config.postgresUser,
    password: config.postgresPassword,
    port: config.postgresPort
});