const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dbpn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000, // Tiempo de espera en milisegundos (por ejemplo, 60 segundos)

});

// Manejar errores de conexión
pool.getConnection()
  .then(connection => {
    console.log('Conexión exitosa a la base de datos.');

    // Realiza tus operaciones con la base de datos aquí.

    connection.release(); // Devuelve la conexión a la pool cuando hayas terminado.
  })
  .catch(error => {
    console.error('Error de conexión:', error.message);
  });

module.exports = pool;


// Rutas de tu aplicación Express...
// Por ejemplo:
app.get('/', (req, res) => {
  // Aquí puedes ejecutar consultas a la base de datos utilizando `connection.query`
  // y enviar la respuesta a tu cliente HTTP
  res.send('¡Hola mundo!');
});

// Inicia el servidor Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
