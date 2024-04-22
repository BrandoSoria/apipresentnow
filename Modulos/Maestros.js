const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./Conexion'); // Importa el pool de conexiones desde conexionPool.js

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware para analizar cuerpos de solicitud JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Obtener todos los maestros
app.get('/api/maestros', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión del pool: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    connection.query('SELECT * FROM Maestros', (err, rows) => {
      connection.release(); // Liberar la conexión cuando hayamos terminado con ella
      if (err) {
        console.error('Error al obtener los maestros: ' + err.message);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.json(rows);
    });
  });
});

// Agregar un nuevo maestro
app.post('/api/maestros', (req, res) => {
  const { rfc, nombre } = req.body;
  const sql = `INSERT INTO Maestros (rfc, nombre) VALUES (?, ?)`;
  const values = [rfc, nombre];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión del pool: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    connection.query(sql, values, (err, result) => {
      connection.release(); // Liberar la conexión cuando hayamos terminado con ella
      if (err) {
        console.error('Error al agregar un nuevo maestro: ' + err.message);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.status(201).send('Maestro agregado correctamente');
    });
  });
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
