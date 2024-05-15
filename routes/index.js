const express = require('express');
const router = express.Router();
const port = process.env.PORT || 3000;



// Definir rutas aquí
router.get('/', (req, res) => {
    res.json({ message: '¡Bienvenido a la API REST de Node.js Express!' });
});

// Resto de tus rutas...

// Middleware de manejo de errores para métodos no definidos
router.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicia el servidor
router.use(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = router;