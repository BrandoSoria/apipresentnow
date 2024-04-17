const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./Conexion');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de bodyParser para analizar cuerpos de solicitud JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para obtener todos los alumnos
app.get('/api/alumnos', (req, res) => {
  pool.query('SELECT * FROM alumnos', (err, rows) => {
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

  pool.query(sql, values, (err, result) => {
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
  pool.query('DELETE FROM alumnos WHERE id = ?', id, (err, result) => {
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

  pool.query(sql, values, (err, result) => {
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
