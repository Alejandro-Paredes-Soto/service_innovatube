require("dotenv").config();
const Pool = require("pg-pool")

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DB
});

exports.queryAsync = async (query) => {
    try {
        const connection = await pool.connect();
        const result = await connection.query(query);
        connection.release();
        return result;
    } catch (error) {
        throw error;
    }
}
