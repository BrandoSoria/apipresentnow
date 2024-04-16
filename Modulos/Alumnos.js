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


// Endpoint para obtener todos los alumnos
app.get('/api/alumnos', (req, res) => {
  connection.query('SELECT * FROM alumnos', (err, rows) => {
    if (err) {
      console.error('Error al obtener los alumnos: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(rows);
  });
});

// Endpoint para agregar un nuevo alumno
app.post('/api/alumnos', (req, res) => {
  const { numero_de_control, nombre_completo, grupo, carrera, semestre, materia, horario } = req.body;
  const sql = `INSERT INTO alumnos (numero_de_control, nombre_completo, grupo, carrera, semestre, materia, horario) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [numero_de_control, nombre_completo, grupo, carrera, semestre, materia, horario];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al agregar un nuevo alumno: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.status(201).send('Alumno agregado correctamente');
  });
});

// Endpoint para eliminar un alumno
app.delete('/api/alumnos/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM alumnos WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error al eliminar el alumno: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.send('Alumno eliminado correctamente');
  });
});

// Endpoint para actualizar un alumno
app.put('/api/alumnos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre_completo, grupo, carrera, semestre, materia, horario } = req.body;
  const sql = `UPDATE alumnos SET nombre_completo = ?, grupo = ?, carrera = ?, semestre = ?, materia = ?, horario = ? WHERE id = ?`;
  const values = [nombre_completo, grupo, carrera, semestre, materia, horario, id];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar el alumno: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.send('Alumno actualizado correctamente');
  });
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
