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

    app.get('/materias', (req, res) => {
        const numeroControl = req.query.numero_control;
        if (!numeroControl) {
            return res.status(400).json({ error: 'NumeroControl es requerido' });
        }
    
        const query = `
            SELECT Materias.ClaveMateria, Materias.NombreMateria
            FROM AlxGpo
            JOIN Grupo ON AlxGpo.IdGrupo = Grupo.IdGrupo
            JOIN Materias ON Grupo.Id_Materia = Materias.ClaveMateria
            WHERE AlxGpo.NumeroControl = ?
        `;
    
        db.query(query, [numeroControl], (err, results) => {
            if (err) {
                console.error('Error ejecutando la consulta:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
    
            const materias = results.map(row => ({
                ClaveMateria: row.ClaveMateria,
                NombreMateria: row.NombreMateria
            }));
    
            res.json(materias);
        });
    });

    app.get('/materias', (req, res) => {    
        const query = 'SELECT * FROM Materias';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error ejecutando la consulta:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.json(results);
        });
    });

    // Eliminar una materia
    app.delete('/materias/:ClaveMateria', async (request, response) => {
        const ClaveMateria = request.params.ClaveMateria;
        try {
            await pool.query('DELETE FROM Materias WHERE ClaveMateria = ?', [ClaveMateria]);
            response.status(200).json({ message: 'Materia eliminada correctamente' });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al eliminar materia' });
        }
    });

    // Obtener todas las materias
    app.get('/materias', async (req, res) => {
        try {
            const [results] = await pool.query('SELECT * FROM Materias');
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
            const [results] = await pool.query('SELECT * FROM Materias WHERE ClaveMateria = ?', [ClaveMateria]);
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
        if (!nombre) {
            return response.status(400).json({ error: 'El nombre de la aula es obligatorio' });
        }
        try {
            const [existingAula] = await pool.query('SELECT * FROM Aulas WHERE ClaveAula = ?', [ClaveAula]);
            if (existingAula.length > 0) {
                return res.status(400).json({ error: 'La Clave de Aula ya está en uso' });
            }
            await pool.query('INSERT INTO Aulas (ClaveAula, Nombre) VALUES (?, ?)', 
                [ClaveAula, nombre]);
            response.status(201).json({ message: 'Aula creada correctamente' });
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Error al crear Aula' });
        }
    });
app.get('/aulas', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM Aulas');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener Aulas' });
    }
});


//nuevo grupos

app.post('/grupo', async (request, response) =>
{
    const { idGrupo, Id_Materia, Hora, Aula, RFCDocente, NombreGrupo } = request.body;
    if (!Id_Materia || !Hora || !Aula || !RFCDocente || !NombreGrupo) {
        return response.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
        const [existingGroup] = await pool.query('SELECT * FROM Grupo WHERE idGrupo = ?', [idGrupo]);
        if (existingGroup.length > 0) {
            return res.status(400).json({ error: 'El grupo ya existe' });
        }
        await pool.query('INSERT INTO Grupo (IdGrupo, Id_Materia, Hora, Aula, RFCDocente, NombreGrupo) VALUES (?, ?, ?, ?, ?, ?)', [ idGrupo, Id_Materia, Hora, Aula, RFCDocente, NombreGrupo]);
        response.status(201).json({ message: 'Grupo creado correctamente' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Error al crear grupo' });
    }
});

app.get('/grupo', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM Grupo');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener grupos' });
    }
}); 
//materia por id
app.get('/grupo/:idGrupo', async (req, res) => {
    const idGrupo = req.params.idGrupo;
    try {
        const [results] = await pool.query('SELECT * FROM Grupo WHERE idGrupo = ?', [idGrupo]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener grupo' });
    }
});

// Actualizar un grupo existente
app.put('/grupo/:idGrupo', async (req, res) => {
    const idGrupo = req.params.idGrupo;
    const { Id_Materia, Hora, Aula, RFCDocente, NombreGrupo } = req.body;
    try {
        const [existingGroup] = await pool.query('SELECT * FROM Grupo WHERE idGrupo = ?', [idGrupo]);
        if (existingGroup.length === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        await pool.query('UPDATE Grupo SET Id_Materia = ?, Hora = ?, Aula = ?, RFCDocente = ?, NombreGrupo = ? WHERE idGrupo = ?', [Id_Materia, Hora, Aula, RFCDocente, NombreGrupo, idGrupo]);
        res.status(200).json({ message: 'Grupo actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar grupo' });
    }
});

// Eliminar un grupo existente
app.delete('/grupo/:idGrupo', async (req, res) => {
    const idGrupo = req.params.idGrupo;
    try {
        const [existingGroup] = await pool.query('SELECT * FROM Grupo WHERE idGrupo = ?', [idGrupo]);
        if (existingGroup.length === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        await pool.query('DELETE FROM Grupo WHERE idGrupo = ?', [idGrupo]);
        res.status(200).json({ message: 'Grupo eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar grupo' });
    }
}); 

//alumnos x grupos

app.get('/alumnogrupo', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM AlxGpo');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener grupos' });
    }
});

app.post('/alumnogrupo', async (req, res) => {
    const { idGrupo, numeroControl } = req.body;
    if (!idGrupo || !numeroControl) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
        const [existingGroup] = await pool.query('SELECT * FROM AlxGpo WHERE idGrupo = ? AND NumeroControl = ?', [idGrupo, numeroControl]);
        if (existingGroup.length > 0) {
            return res.status(400).json({ error: 'El grupo ya existe' });
        }
        await pool.query('INSERT INTO AlxGpo (idGrupo, NumeroControl) VALUES (?, ?)', [idGrupo, numeroControl]);
        res.status(201).json({ message: 'Alumno creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear grupo' });
    }
});

app.get('/alumnogrupo/:idGrupo', async (req, res) => {
    const idGrupo = req.params.idGrupo;
    try {
        const [results] = await pool.query('SELECT * FROM AlxGpo WHERE idGrupo = ?', [idGrupo]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener grupo' });
    }
});

app.delete('/alumnogrupo/:idGrupo', async (req, res) => {
    const idGrupo = req.params.idGrupo;
    try {
        const [existingGroup] = await pool.query('SELECT * FROM AlxGpo WHERE idGrupo = ?', [idGrupo]);
        if (existingGroup.length === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        await pool.query('DELETE FROM AlxGpo WHERE idGrupo = ?', [idGrupo]);
        res.status(200).json({ message: 'Alumno eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar grupo' });
    }
}); 


app.get('/alumnogrupo', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM AlxGpo');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener grupos' });
    }
});

app.put('/alumnogrupo/:idGrupo', async (req, res) => {
    const idGrupo = req.params.idGrupo;
    const { numeroControl } = req.body;
    try {
        const [existingGroup] = await pool.query('SELECT * FROM AlxGpo WHERE idGrupo = ?', [idGrupo]);
        if (existingGroup.length === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        await pool.query('UPDATE AlxGpo SET numeroControl = ? WHERE idGrupo = ?', [numeroControl, idGrupo]);
        res.status(200).json({ message: 'Alumno actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar grupo' });
    }
});

    
}

module.exports = router;
