const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar cuerpos de solicitud JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'asis'
});

// Conexión a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida con el ID ' + connection.threadId);
});

// Endpoint para marcar asistencia
app.post('/api/asistencias', (req, res) => {
  const { alumno_id, fecha_hora, asistio, observaciones } = req.body;
  const sql = `INSERT INTO asistencias (alumno_id, fecha_hora, asistio, observaciones) VALUES (?, ?, ?, ?)`;
  const values = [alumno_id, fecha_hora, asistio, observaciones];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al marcar la asistencia: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.status(201).send('Asistencia registrada correctamente');
  });
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
