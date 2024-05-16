const pool = require('../conexion');


const router = (app) => {

//alumnos


    // Ruta para obtener todos los alumnos
    app.get('/alumnos', (req, res) => {
        pool.query('SELECT * FROM Alumno', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener alumnos' });
            }
            res.status(200).json(results);
        });
    });
    
    // Obtener un alumno por su número de control
    app.get('/alumnos/:numerocontrol', (req, res) => {
        const numerocontrol = req.params.numerocontrol;
        pool.query('SELECT * FROM Alumno WHERE NumeroControl = ?', [numerocontrol], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener alumno' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Alumno no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });


 // Actualizar un alumno existente
app.put('/alumnos/:numerocontrol', (request, response) => {
    const numerocontrol = request.params.numerocontrol;
    const { nombre, carrera } = request.body;
    pool.query('UPDATE Alumno SET Nombre = ?, Carrera = ? WHERE NumeroControl = ?', [nombre, carrera, numerocontrol], (error, result) => {
        if (error) throw error;
        response.send('Alumno actualizado correctamente');
    });
});
    // Eliminar un alumno
    app.delete('/alumnos/:numerocontrol', (request, response) => {
        const numerocontrol = request.params.numerocontrol;
        pool.query('DELETE FROM Alumno WHERE NumeroControl = ?', numerocontrol, (error, result) => {
            if (error) throw error;
            response.send('Alumno eliminado correctamente');
        });
    });
    

}


module.exports = router;