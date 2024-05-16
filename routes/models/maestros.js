const pool = require('../conexion');


const router = (app) => {

    
    // Ruta para obtener todos los profesores
    app.get('/profesores', (req, res) => {
        pool.query('SELECT * FROM Profesores', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener profesores' });
            }
            res.status(200).json(results);
        });
    });

     
    // Obtener un profesor por su RFC
    app.get('/profesores/:rfc', (req, res) => {
        const rfc = req.params.rfc;
        pool.query('SELECT * FROM Profesores WHERE RFC = ?', [rfc], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener profesor' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Profesor no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });
    
    // Actualizar un profesor existente
    app.put('/profesores/:rfc', (request, response) => {
        const rfc = request.params.rfc;
        const { nombre, departamento } = request.body;
        pool.query('UPDATE Profesores SET Nombre = ?, Departamento = ? WHERE RFC = ?', [nombre, departamento, rfc], (error, result) => {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: 'Error al actualizar profesor' });
            }
            response.json({ message: 'Profesor actualizado correctamente' });
        });
    });

    // Eliminar un profesor
    app.delete('/profesores/:rfc', (request, response) => {
        const rfc = request.params.rfc;
        pool.query('DELETE FROM Profesores WHERE RFC = ?', [rfc], (error, result) => {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: 'Error al eliminar profesor' });
            }
            response.json({ message: 'Profesor eliminado correctamente' });
        });
    });




}


module.exports = router;