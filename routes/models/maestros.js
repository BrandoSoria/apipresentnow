const { body, validationResult } = require('express-validator');
const moment = require('moment-timezone');
const pool = require('../conexion');

const router = (app) => {
    // Obtener todos los profesores
    app.get('/profesores', async (req, res) => {
        try {
            const [results] = await pool.query('SELECT * FROM Profesores');
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener profesores' });
        }
    });

    // Obtener un profesor por su RFC
    app.get('/profesores/:rfc', async (req, res) => {
        const rfc = req.params.rfc;
        try {
            const [results] = await pool.query('SELECT * FROM Profesores WHERE RFC = ?', [rfc]);
            if (results.length === 0) {
                return res.status(404).json({ error: 'Profesor no encontrado' });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener profesor' });
        }
    });

    // Actualizar un profesor existente
    app.put('/profesores/:rfc', async (req, res) => {
        const rfc = req.params.rfc;
        const { nombre, departamento } = req.body;
        try {
            await pool.query('UPDATE Profesores SET Nombre = ?, Departamento = ? WHERE RFC = ?', [nombre, departamento, rfc]);
            res.json({ message: `Profesor actualizado correctamente con RFC ${rfc}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar profesor' });
        }
    });

    // Eliminar un profesor
    app.delete('/profesores/:rfc', async (req, res) => {
        const rfc = req.params.rfc;
        try {
            await pool.query('DELETE FROM Profesores WHERE RFC = ?', [rfc]);
            res.json({ message: `Profesor eliminado correctamente con RFC ${rfc}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar profesor' });
        }
    });

    // Registrar entrada de profesor
    app.post('/entrada/profesor', [
        body('profesorRfc').notEmpty().withMessage('El RFC del profesor es obligatorio'),
        body('entro').notEmpty().withMessage('El campo "entro" es obligatorio'),
        body('aula').notEmpty().withMessage('El aula es obligatoria')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { profesorRfc, entro, aula } = req.body;
        const FechaHora = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        try {
            await pool.query('INSERT INTO EntradaMaestro (ProfesorRFC, FechaHora, Entro, aula) VALUES (?, ?, ?, ?)', [profesorRfc, FechaHora, entro, aula]);
            res.status(201).json({ message: 'Asistencia registrada correctamente' });
        } catch (error) {
            console.error('Error al registrar la asistencia:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Obtener todas las asistencias
    app.get('/entrada/profesor', async (req, res) => {
        try {
            const [results] = await pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM EntradaMaestro');
            const formattedDates = results.map(result => {
                const FechaHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, FechaHora };
            });
            res.status(200).json(formattedDates);
        } catch (error) {
            console.error('Error al obtener las Entradas de maestros:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Obtener entrada por RFC
    app.get('/entrada/profesor/:rfc', async (req, res) => {
        const rfc = req.params.rfc;
        try {
            const [results] = await pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM EntradaMaestro WHERE ProfesorRFC = ?', [rfc]);
            const formattedDates = results.map(result => {
                const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, fechaConHora };
            });
            res.status(200).json(formattedDates);
        } catch (error) {
            console.error('Error al obtener las Entradas de maestros:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Registrar salida de profesor
    app.post('/salida/profesor', [
        body('profesorRfc').notEmpty().withMessage('El RFC del profesor es obligatorio'),
        body('salida').notEmpty().withMessage('El campo "salida" es obligatorio')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { profesorRfc, salida } = req.body;
        const fecha = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        try {
            await pool.query('INSERT INTO SalidaMaestro (ProfesorRFC, FechaHora, Salio) VALUES (?, ?, ?)', [profesorRfc, fecha, salida]);
            res.status(201).json({ message: 'Asistencia registrada correctamente' });
        } catch (error) {
            console.error('Error al registrar la asistencia:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Obtener todas las salidas
    app.get('/salida/profesor', async (req, res) => {
        try {
            const [results] = await pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM SalidaMaestro');
            const formattedDates = results.map(result => {
                const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, fechaConHora };
            });
            res.status(200).json(formattedDates);
        } catch (error) {
            console.error('Error al obtener las Salidas de maestros:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Obtener salida por RFC
    app.get('/salida/profesor/:rfc', async (req, res) => {
        const rfc = req.params.rfc;
        try {
            const [results] = await pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM SalidaMaestro WHERE ProfesorRFC = ?', [rfc]);
            const formattedDates = results.map(result => {
                const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, fechaConHora };
            });
            res.status(200).json(formattedDates);
        } catch (error) {
            console.error('Error al obtener las Salidas de maestros:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
};

module.exports = router;
