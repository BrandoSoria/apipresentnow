const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../Modulos/Conexion'); // Importa el pool de conexiones desde conexionPool.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar cuerpos de solicitud JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de Alumnos
app.get('/api/alumnos', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión del pool: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    connection.query('SELECT * FROM Alumnos', (err, rows) => {
      connection.release(); // Liberar la conexión cuando hayamos terminado con ella
      if (err) {
        console.error('Error al obtener los alumnos: ' + err.message);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.json(rows);
    });
  });
});

app.post('/api/alumnos', (req, res) => {
  // Código para agregar un nuevo alumno
});

app.delete('/api/alumnos/:id', (req, res) => {
  // Código para eliminar un alumno
});

app.put('/api/alumnos/:id', (req, res) => {
  // Código para actualizar un alumno
});

// Rutas de Maestros
app.get('/api/maestros', (req, res) => {
  // Código para obtener todos los maestros
});

app.post('/api/maestros', (req, res) => {
  // Código para agregar un nuevo maestro
});

// Rutas para el registro de entrada de maestros
app.post('/api/entrada-maestro', (req, res) => {
  // Código para registrar la entrada de un maestro
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
