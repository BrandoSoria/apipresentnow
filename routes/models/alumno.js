const moment = require('moment-timezone');
const pool = require('../conexion');

const router = (app) => {
    // Ruta para obtener todos los alumnos
    app.get('/alumnos', async (req, res) => {
        try {
            const [results] = await pool.query('SELECT * FROM Alumno');
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener alumnos' });
        }
    });

    // Obtener un alumno por su número de control
    app.get('/alumnos/:numerocontrol', async (req, res) => {
        const numerocontrol = req.params.numerocontrol;
        try {
            const [results] = await pool.query('SELECT * FROM Alumno WHERE NumeroControl = ?', [numerocontrol]);
            if (results.length === 0) {
                return res.status(404).json({ error: 'Alumno no encontrado' });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener alumno' });
        }
    });

    // Actualizar un alumno existente
    app.put('/alumnos/:numerocontrol', async (req, res) => {
        const numerocontrol = req.params.numerocontrol;
        const { nombre, carrera } = req.body;
        try {
            await pool.query('UPDATE Alumno SET Nombre = ?, Carrera = ? WHERE NumeroControl = ?', [nombre, carrera, numerocontrol]);
            res.json({ message: `Alumno actualizado correctamente con Numero de Control ${numerocontrol}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar alumno' });
        }
    });

    // Eliminar un alumno
    app.delete('/alumnos/:numerocontrol', async (req, res) => {
        const numerocontrol = req.params.numerocontrol;
        try {
            await pool.query('DELETE FROM Alumno WHERE NumeroControl = ?', [numerocontrol]);
            res.json({ message: `Alumno eliminado correctamente con Numero de Control ${numerocontrol}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar alumno' });
        }
    });

// Registrar asistencia de alumno a cada maateria
app.post('/asistencias', async (req, res) => {
    const { numeroControl, presente } = req.body;
    const Fecha = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    
    try {
        // Consultar las materias del alumno
        const query = `
            SELECT Materias.ClaveMateria, Materias.NombreMateria
            FROM AlxGpo
            JOIN Grupo ON AlxGpo.IdGrupo = Grupo.IdGrupo
            JOIN Materias ON Grupo.Id_Materia = Materias.ClaveMateria
            WHERE AlxGpo.NumeroControl = ?
        `;
        const [results] = await pool.query(query, [numeroControl]);

        // Registrar la asistencia para cada materia del alumno
        await Promise.all(results.map(async (row) => {
            const { ClaveMateria, NombreMateria } = row;
            const materiaId = ClaveMateria; // Usar la ClaveMateria como ID de materia
            await pool.query('INSERT INTO Asistencia (AlumnoID, Fecha, Presente, materiaId) VALUES (?, ?, ?, ?)', [numeroControl, Fecha, presente, materiaId]);
        }));

        res.status(201).json({ message: 'Asistencia registrada correctamente' });
    } catch (error) {
        console.error('Error al registrar la asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

    // Obtener todas las asistencias
    app.get('/asistencias', async (req, res) => {
        try {
            const [results] = await pool.query('SELECT *, DATE_FORMAT(Fecha, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM Asistencia');
            const formattedDates = results.map(result => {
                const fecha = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, fecha };
            });
            res.status(200).json(formattedDates);
        } catch (error) {
            console.error('Error al obtener las asistencias:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Obtener asistencias por materiaID (como parámetro de consulta)
app.get('/asistencias', async (req, res) => {
    const materiaID = req.query.materiaID;
    if (!materiaID) {
        return res.status(400).json({ error: 'El parámetro materiaID es obligatorio' });
    }

    try {
        const [results] = await pool.query('SELECT *, DATE_FORMAT(Fecha, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM Asistencia WHERE materiaId = ?', [materiaID]);
        const formattedDates = results.map(result => {
            const fecha = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
            return { ...result, fecha };
        });
        res.status(200).json(formattedDates);
    } catch (error) {
        console.error('Error al obtener las asistencias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


    
};

module.exports = router;
