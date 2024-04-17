const mysql = require('mysql');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dbpn',
  connectionLimit: 10 // Configura el límite máximo de conexiones en el pool
});

module.exports = pool;