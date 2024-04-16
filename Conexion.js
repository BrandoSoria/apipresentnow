const express = require('express');
const mysql = require('mysql');

const app = express();

// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'asis'
});

// Conecta a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida con el ID ' + connection.threadId);
});

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
