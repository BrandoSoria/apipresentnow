const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./Conexion'); // Importa el pool de conexiones desde conexionPool.js

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware para analizar cuerpos de solicitud JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registrar la entrada de un maestro
app.post('/api/entrada-maestro', (req, res) => {
  const { maestro_rfc } = req.body;
  const fecha_hora_entrada = new Date(); // Obtener la fecha y hora actual

  const sql = `INSERT INTO Entrada_Salida_Maestros (maestro_rfc, fecha_hora_entrada) VALUES (?, ?)`;
  const values = [maestro_rfc, fecha_hora_entrada];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión del pool: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }

    connection.query(sql, values, (err, result) => {
      connection.release(); // Liberar la conexión cuando hayamos terminado con ella
      if (err) {
        console.error('Error al registrar la entrada del maestro: ' + err.message);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.status(201).send('Entrada del maestro registrada correctamente');
    });
  });
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
