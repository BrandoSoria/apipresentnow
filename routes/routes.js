const pool = require('./conexion');

const router = (app) => {
    // Ruta de bienvenida
    app.get('/', (request, response) => {
        response.json({
            message: '¡Bienvenido a la API REST de Node.js Express!'
        });
    });

    app.pool = pool;

        

// Crear un nuevo departamento 4
app.post('/departamentos', (request, response) => {
    const { nombre } = request.body;
    pool.query('INSERT INTO Departamento (Nombre) VALUES (?)', [nombre], (error, result) => {
        if (error) throw error;
        response.send('Departamento creado correctamente ${nombre}');
    });
});

// Actualizar un departamento existente 3
app.put('/departamentos/:id', (request, response) => {
    const id = request.params.id;
    const { nombre } = request.body;
    pool.query('UPDATE Departamento SET Nombre = ? WHERE id = ?', [nombre, id], (error, result) => {
        if (error) throw error;
        response.send('Departamento actualizado correctamente ${id}');
    });
});

// Eliminar un departamento2
app.delete('/departamentos/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM Departamento WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('Departamento eliminado correctamente ${id}');
    });
});


// Crear un nuevo plan de estudio
app.post('/planesestudio', (request, response) => {
    const {  nombrePlan, cicloEscolar } = request.body;
    pool.query('INSERT INTO PlanEstudio ( NombrePlan, CicloEscolar) VALUES (?, ?)', [ nombrePlan, cicloEscolar], (error, result) => {
        if (error) throw error;
        response.send('Plan de estudio creado correctamente ${id}');
    });
});

// Actualizar un plan de estudio existente
app.put('/planesestudio/:id', (request, response) => {
    const id = request.params.id;
    const { nombrePlan, cicloEscolar } = request.body;
    pool.query('UPDATE PlanEstudio SET NombrePlan = ?, CicloEscolar = ? WHERE id = ?', [nombrePlan, cicloEscolar], (error, result) => {
        if (error) throw error;
        response.send('Plan de estudio actualizado correctamente ${id}');
    });
});

// Eliminar un plan de estudio
app.delete('/planesestudio/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM PlanEstudio WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('plan de estudio eliminado correctamente ${id}');
    });
});




// los get


    // Ruta para obtener todos los departamentos s
    app.get('/departamentos', (req, res) => {
        pool.query('SELECT * FROM Departamento', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener departamentos' });
            }
            res.status(200).json(results);
            req.log.info(results);
            console.log(results);
        });
    });

    // Ruta para obtener todos los planes de estudio
    app.get('/planesestudio', (req, res) => {
        pool.query('SELECT * FROM PlanEstudio', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener planes de estudio' });
            }
            res.status(200).json(results);
            console.log(results);
        });
    });


    
   

// Crear una nueva materia
app.post('/materias', (request, response) => {
    const { ClaveMateria, NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl, aula } = request.body;
    pool.query('INSERT INTO Materia (ClaveMateria, NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl, aula) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [ClaveMateria, NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl, aula], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Error al crear materia' });
        }
        response.status(201).json({ message: 'Materia creada correctamente' });
        console.log('se agrego registro en la base de datos con clave materia ${ClaveMateria}');
    });
});

// Actualizar una materia existente
app.put('/materias/:ClaveMateria', (request, response) => {
    const ClaveMateria = request.params.ClaveMateria;
    const { NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl } = request.body;
    pool.query('UPDATE Materia SET NombreMateria = ?, Semestre = ?, PlanEstudioId = ?, HoraInicio = ?, ProfesorRFC = ?, NumeroControl = ? WHERE ClaveMateria = ?', 
        [NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl, ClaveMateria], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Error al actualizar materia' });
        }
        response.status(200).json({ message: 'Materia actualizada correctamente' });
        console.log('se actualizo registro en la base de datos con clave materia ${ClaveMateria}');
    });
});

// Eliminar una materia
app.delete('/materias/:ClaveMateria', (request, response) => {
    const ClaveMateria = request.params.ClaveMateria;
    pool.query('DELETE FROM Materia WHERE ClaveMateria = ?', ClaveMateria, (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Error al eliminar materia' });
        }
        response.status(200).json({ message: 'Materia eliminada correctamente' });
        console.log('se elimino registro en la base de datos con clave materia ${ClaveMateria}');
    });
});

// Obtener todas las materias
app.get('/materias', (req, res) => {
    pool.query('SELECT * FROM Materia', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener materias' });
        }
        res.status(200).json(results);
    });
});

// Obtener una materia por su clave
app.get('/materias/:ClaveMateria', (req, res) => {
    const ClaveMateria = req.params.ClaveMateria;
    pool.query('SELECT * FROM Materia WHERE ClaveMateria = ?', ClaveMateria, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener materia' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }
        res.status(200).json(results[0]);
        
    });
});

    // Obtener un plan de estudio por su ID
    app.get('/planesestudio/:id', (req, res) => {
        const id = req.params.id;
        pool.query('SELECT * FROM PlanEstudio WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener plan de estudio' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Plan de estudio no encontrado' });
            }
            res.status(200).json(results[0]);
            console.log('se obtuvo registro en la base de datos con id ${id}');
        });
    });
}


module.exports = router;