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

// Obtener todos los maestros
app.get('/api/maestros', (req, res) => {
  connection.query('SELECT * FROM Maestros', (err, rows) => {
    if (err) {
      console.error('Error al obtener los maestros: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(rows);
  });
});

// Agregar un nuevo maestro
app.post('/api/maestros', (req, res) => {
  const { rfc, nombre } = req.body;
  const sql = `INSERT INTO Maestros (rfc, nombre) VALUES (?, ?)`;
  const values = [rfc, nombre];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al agregar un nuevo maestro: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.status(201).send('Maestro agregado correctamente');
  });
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
