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
// Registrar asistencia de alumno a cada materia
app.post('/asistencias', async (req, res) => {
    const { numeroControl, id_materia, presente } = req.body;
    const Fecha = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    
    try {
        // Consultar las materias del alumno para validar
        const query = `
            SELECT Materias.ClaveMateria, Materias.NombreMateria
            FROM AlxGpo
            JOIN Grupo ON AlxGpo.IdGrupo = Grupo.IdGrupo
            JOIN Materias ON Grupo.Id_Materia = Materias.ClaveMateria
            WHERE AlxGpo.NumeroControl = ?
        `;
        const [results] = await pool.query(query, [numeroControl]);

        // Verificar que la materia proporcionada está asignada al alumno
        const materiaValida = results.find(row => row.ClaveMateria === id_materia);
        if (!materiaValida) {
            return res.status(400).json({ error: 'La materia especificada no está asignada al alumno' });
        }

        // Registrar la asistencia para la materia especificada
        await pool.query('INSERT INTO Asistencia (AlumnoID, Fecha, Presente, MateriaID) VALUES (?, ?, ?, ?)', [numeroControl, Fecha, presente, id_materia]);

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


    // Obtener asistencias por fecha (como parámetro de consulta)
    app.get('/asistencias/fecha', async (req, res) => {
        const fecha = req.query.fecha;
        if (!fecha || !moment(fecha, 'YYYY-MM-DD', true).isValid()) {
            res.status(400).json({ error: 'La fecha proporcionada no es válida. Asegúrate de que esté en el formato YYYY-MM-DD.' });
            

        }
        try {
            const [results] = await pool.query('SELECT *, DATE_FORMAT(Fecha, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM Asistencia WHERE DATE(Fecha) = ?', 
            [fecha]
        );
          // Verificar si se encontraron resultados
        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron entradas de profesores para la fecha especificada.' });
        }

        const formattedDates = results.map(result => {
            const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD');
            return { ...result, fechaConHora };
        });
        res.status(200).json(formattedDates);
    } catch (error) {
        console.error('Error al obtener las asistencias de alumnos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Obtener asistencias por nombre de grupo y materia (como parámetro de consulta)
    app.get('/asistencias/materiagrupo', async (req, res) => {
        const nombreGrupo = req.query.nombreGrupo;
        const idMateria = req.query.idMateria;
    
        if (!nombreGrupo || !idMateria) {
            return res.status(400).json({ error: 'Los parámetros nombreGrupo e idMateria son obligatorios' });
        }
    
        try {
            const query = `
                SELECT a.*, DATE_FORMAT(a.Fecha, "%Y-%m-%d %H:%i:%s") AS fechaConHora
                FROM Asistencia a
                JOIN Grupo g ON a.materiaId = g.Id_Materia
                WHERE g.NombreGrupo = ? AND g.Id_Materia = ?
            `;
    
            const [results] = await pool.query(query, [nombreGrupo, idMateria]);
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
app.get('/asistencias/materia', async (req, res) => {
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
