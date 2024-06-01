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


    app.get('/profesor/:rfc', async (req, res) => {
  try {
    const profesorRFC = req.params.rfc;
    const query = `
      SELECT 
        p.RFC, 
        p.Nombre AS ProfesorNombre, 
        g.NombreGrupo, 
        m.NombreMateria, 
        a.Nombre AS AulaNombre
      FROM 
        Profesores p
      JOIN 
        Grupo g ON p.RFC = g.RfcDocente
      JOIN 
        Materias m ON g.Id_Materia = m.ClaveMateria
      JOIN 
        Aulas a ON g.Aula = a.ClaveAula
      WHERE 
        p.RFC = ?
    `;
    const [results] = await pool.query(query, [profesorRFC]);
    res.json(results);
  } catch (error) {
    console.error('Error al realizar la consulta:', error);
    res.status(500).send('Error al realizar la consulta');
  }
});
//obtener en que materias y aulas esta cada profesor Y LA HORA
app.get('/profesor/materias/aulas', async (req, res) => {
    try {
      const { rfc } = req.query;
  
      // Verificar si el RFC está presente en la consulta
      if (!rfc) {
        return res.status(400).json({ error: 'El RFC es requerido como parámetro de consulta (rfc=)' });
      }
  
      const query = `
      SELECT 
      p.RFC, 
      p.Nombre AS ProfesorNombre, 
      g.NombreGrupo, 
      m.NombreMateria, 
      a.Nombre AS AulaNombre,
      g.Hora
  FROM 
      Profesores p
  JOIN 
      Grupo g ON p.RFC = g.RfcDocente
  JOIN 
      Materias m ON g.Id_Materia = m.ClaveMateria
  JOIN 
      Aulas a ON g.Aula = a.ClaveAula
  WHERE 
      p.RFC = ?
      `;
      const [results] = await pool.query(query, [rfc]);
      
      // Verificar si se encontraron resultados
      if (results.length === 0) {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
  
      res.json(results);
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).send('Error al realizar la consulta');
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
        // Verificar si el profesor existe
        const [profesor] = await pool.query('SELECT * FROM Profesores WHERE RFC = ?', [profesorRfc]);
        if (profesor.length === 0) {
            return res.status(404).json({ error: 'El profesor no está registrado' });
        }

        // Registrar la entrada del profesor
        await pool.query('INSERT INTO EntradaMaestro (ProfesorRFC, FechaHora, Entro, aula) VALUES (?, ?, ?, ?)', [profesorRfc, FechaHora, entro, aula]);
        
        // Obtener las materias y aulas asociadas al profesor
        const query = `
            SELECT 
                p.RFC, 
                p.Nombre AS ProfesorNombre, 
                g.NombreGrupo, 
                m.NombreMateria, 
                a.Nombre AS AulaNombre
            FROM 
                Profesores p
            JOIN 
                Grupo g ON p.RFC = g.RfcDocente
            JOIN 
                Materias m ON g.Id_Materia = m.ClaveMateria
            JOIN 
                Aulas a ON g.Aula = a.ClaveAula
            WHERE 
                p.RFC = ?
        `;
        const [results] = await pool.query(query, [profesorRfc]);
        
        // Devolver las materias y aulas asociadas al profesor
        res.status(201).json({ message: 'Asistencia registrada correctamente', materiasYaulas: results });
    } catch (error) {
        console.error('Error al registrar la asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Actualizar asistencia de profesor por fecha
app.put('/entrada/profesor/fecha/:fecha', async (req, res) => {
    const fecha = req.params.fecha; // Se espera que la fecha sea en formato 'YYYY-MM-DD'
    const { asistio } = req.body;
    try {
        // Actualizar la columna 'asistio' en la tabla 'EntradaMaestro' para la fecha especificada
        const [results] = await pool.query(
            'UPDATE EntradaMaestro SET asistio = ? WHERE DATE(FechaHora) = ?', 
            [asistio, fecha]
        );

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontraron entradas del profesor para actualizar en la fecha especificada' });
        }

        res.json({ message: `Asistencia actualizada correctamente para la fecha ${fecha}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar asistencia' });
    }
});


//entradas

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

  // Obtener entrada por fecha

app.get('/entrada/profesor/fecha/:fecha', async (req, res) => {
    const fecha = req.params.fecha; // Se espera que la fecha sea en formato 'YYYY-MM-DD'
    try {
        const [results] = await pool.query(
            'SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d") AS fechaSinHora FROM EntradaMaestro WHERE DATE(FechaHora) = ?', 
            [fecha]
        );
        const formattedDates = results.map(result => {
            const fechaSinHora = moment.tz(result.fechaSinHora, 'America/Mexico_City').format('YYYY-MM-DD');
            return { ...result, fechaSinHora };
        });
        res.status(200).json(formattedDates);
    } catch (error) {
        console.error('Error al obtener las Entradas de maestros:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


 // Obtener entrada por aula

app.get('/entrada/profesor/aula/:aula', async (req, res) => { // Asegúrate de que la ruta comience con una barra
    const aula = req.params.aula;
    try {
        const [results] = await pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM EntradaMaestro WHERE aula = ?', [aula]);
        const formattedDates = results.map(result => {
            const fechaConHora = moment.tz(result.FechaHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
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

//salidas 

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

    // Obtener salida por aula

    app.get('/salida/profesor/aula/:aula', async (req, res) => {
        const aula = req.params.aula;
        try {
            const [results] = await pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM SalidaMaestro WHERE aula = ?', [aula]);
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

    app.get('/salida/profesor/fecha/:fecha', async (req, res) => {
        const fecha = req.params.fecha; // Se espera que la fecha sea en formato 'YYYY-MM-DD'
        try {
            const [results] = await pool.query(
                'SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d") AS fechaSinHora FROM SalidaMaestro WHERE DATE(FechaHora) = ?', 
                [fecha]
            );
            const formattedDates = results.map(result => {
                const fechaSinHora = moment.tz(result.fechaSinHora, 'America/Mexico_City').format('YYYY-MM-DD');
                return { ...result, fechaSinHora };
            });
            res.status(200).json(formattedDates);
        } catch (error) {
            console.error('Error al obtener las Entradas de maestros:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });


};

module.exports = router;
