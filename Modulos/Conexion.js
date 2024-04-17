const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'asis',
  connectionLimit: 10 // Configura el límite máximo de conexiones en el pool
});

module.exports = pool;
