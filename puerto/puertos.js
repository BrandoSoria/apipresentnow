const express = require('express');
const bodyParser = require('body-parser');
const alumnosRoutes = require('./alumnos');
const asistenciaRoutes = require('./asistencia');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar cuerpos de solicitud JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de alumnos
app.use('/api/alumnos', alumnosRoutes);

// Rutas de asistencia
app.use('/api/asistencias', asistenciaRoutes);

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
