const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configurar el pool de conexiones a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar al pool de la base de datos:', err);
    } else {
        console.log('Conectado al pool de la base de datos');
        connection.release(); // Liberar la conexión de vuelta al pool
    }
});

module.exports = pool;
