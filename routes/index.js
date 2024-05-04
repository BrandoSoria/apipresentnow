const express = require('express');
const app = express();
const router = require('./conexion');

const port = process.env.PORT || 3000;

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Configura las rutas
router(app);

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
