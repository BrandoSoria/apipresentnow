const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./Conexion'); // Importa el pool de conexiones

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para analizar cuerpos de solicitud JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para marcar asistencia
app.post('/api/asistencias', (req, res) => {
  const { alumno_id, fecha_hora, asistio, observaciones } = req.body;
  const sql = `INSERT INTO asistencias (alumno_id, fecha_hora, asistio, observaciones) VALUES (?, ?, ?, ?)`;
  const values = [alumno_id, fecha_hora, asistio, observaciones];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al marcar la asistencia: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.status(201).send('Asistencia registrada correctamente');
  });
});

// Endpoint para obtener todas las asistencias
app.get('/api/asistencias', (req, res) => {
  pool.query('SELECT * FROM asistencias', (err, rows) => {
    if (err) {
      console.error('Error al obtener las asistencias: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(rows);
  });
});


// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
