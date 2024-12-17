import mysql, { Pool, PoolOptions } from "mysql2";

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "travel_srilanka",
  waitForConnections: true,
  //connectionLimit: 10, // Number of concurrent connections
  //queueLimit: 0,
};

const pool: Pool = mysql.createPool(poolConfig);

/*  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the MySQL database.');
      connection.release();
    }
  }); */

export default pool.promise();
