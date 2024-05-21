const pool = require('./conexion');

const router = (app) => {
    // Ruta de bienvenida
    app.get('/', (request, response) => {
        response.json({
            message: '¡Bienvenido a la API REST de Node.js Express!'
        });
    });

    app.pool = pool;

    // Crear un nuevo departamento
    app.post('/departamentos', async (request, response) => {
        const { nombre } = request.body;
        try {
            await pool.query('INSERT INTO Departamento (Nombre) VALUES (?)', [nombre]);
            response.status(201).send(`Departamento creado correctamente: ${nombre}`);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al crear departamento' });
        }
    });

    // Actualizar un departamento existente
    app.put('/departamentos/:id', async (request, response) => {
        const id = request.params.id;
        const { nombre } = request.body;
        try {
            await pool.query('UPDATE Departamento SET Nombre = ? WHERE id = ?', [nombre, id]);
            response.status(200).send(`Departamento actualizado correctamente: ${id}`);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al actualizar departamento' });
        }
    });

    // Eliminar un departamento
    app.delete('/departamentos/:id', async (request, response) => {
        const id = request.params.id;
        try {
            await pool.query('DELETE FROM Departamento WHERE id = ?', [id]);
            response.status(200).send(`Departamento eliminado correctamente: ${id}`);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al eliminar departamento' });
        }
    });

    // Obtener todos los departamentos
    app.get('/departamentos', async (request, response) => {
        try {
            const [results] = await pool.query('SELECT * FROM Departamento');
            response.status(200).json(results);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Crear un nuevo plan de estudio
    app.post('/planesestudio', async (request, response) => {
        const { nombrePlan, cicloEscolar } = request.body;
        try {
            await pool.query('INSERT INTO PlanEstudio (NombrePlan, CicloEscolar) VALUES (?, ?)', [nombrePlan, cicloEscolar]);
            response.status(201).send('Plan de estudio creado correctamente');
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al crear plan de estudio' });
        }
    });

    // Actualizar un plan de estudio existente
    app.put('/planesestudio/:id', async (request, response) => {
        const id = request.params.id;
        const { nombrePlan, cicloEscolar } = request.body;
        try {
            await pool.query('UPDATE PlanEstudio SET NombrePlan = ?, CicloEscolar = ? WHERE id = ?', [nombrePlan, cicloEscolar, id]);
            response.status(200).send(`Plan de estudio actualizado correctamente: ${id}`);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al actualizar plan de estudio' });
        }
    });

    // Eliminar un plan de estudio
    app.delete('/planesestudio/:id', async (request, response) => {
        const id = request.params.id;
        try {
            await pool.query('DELETE FROM PlanEstudio WHERE id = ?', [id]);
            response.status(200).send(`Plan de estudio eliminado correctamente: ${id}`);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al eliminar plan de estudio' });
        }
    });

    // Obtener todos los planes de estudio
    app.get('/planesestudio', async (req, res) => {
        try {
            const [results] = await pool.query('SELECT * FROM PlanEstudio');
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener planes de estudio' });
        }
    });

    // Obtener un plan de estudio por su ID
    app.get('/planesestudio/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const [results] = await pool.query('SELECT * FROM PlanEstudio WHERE id = ?', [id]);
            if (results.length === 0) {
                return res.status(404).json({ error: 'Plan de estudio no encontrado' });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener plan de estudio' });
        }
    });

    // Crear una nueva materia
    app.post('/materias', async (request, response) => {
        const { ClaveMateria, NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl, aula } = request.body;
        try {
            await pool.query('INSERT INTO Materia (ClaveMateria, NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl, aula) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                [ClaveMateria, NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl, aula]);
            response.status(201).json({ message: 'Materia creada correctamente' });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al crear materia' });
        }
    });

    // Actualizar una materia existente
    app.put('/materias/:ClaveMateria', async (request, response) => {
        const ClaveMateria = request.params.ClaveMateria;
        const { NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl } = request.body;
        try {
            await pool.query('UPDATE Materia SET NombreMateria = ?, Semestre = ?, PlanEstudioId = ?, HoraInicio = ?, ProfesorRFC = ?, NumeroControl = ? WHERE ClaveMateria = ?', 
                [NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl, ClaveMateria]);
            response.status(200).json({ message: 'Materia actualizada correctamente' });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al actualizar materia' });
        }
    });

    // Eliminar una materia
    app.delete('/materias/:ClaveMateria', async (request, response) => {
        const ClaveMateria = request.params.ClaveMateria;
        try {
            await pool.query('DELETE FROM Materia WHERE ClaveMateria = ?', [ClaveMateria]);
            response.status(200).json({ message: 'Materia eliminada correctamente' });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al eliminar materia' });
        }
    });

    // Obtener todas las materias
    app.get('/materias', async (req, res) => {
        try {
            const [results] = await pool.query('SELECT * FROM Materia');
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener materias' });
        }
    });

    // Obtener una materia por su clave
    app.get('/materias/:ClaveMateria', async (req, res) => {
        const ClaveMateria = req.params.ClaveMateria;
        try {
            const [results] = await pool.query('SELECT * FROM Materia WHERE ClaveMateria = ?', [ClaveMateria]);
            if (results.length === 0) {
                return res.status(404).json({ error: 'Materia no encontrada' });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener materia' });
        }
    });

   // Crear una nueva materia
   app.post('/aulas', async (request, response) => {
    const { ClaveAula, nombre } = request.body;
    try {
        await pool.query('INSERT INTO Materia (ClaveAula, Nombre) VALUES (?, ?)', 
            [ClaveAula, nombre]);
        response.status(201).json({ message: 'Aula creada correctamente' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Error al crear Aula' });
    }
});

}

module.exports = router;
