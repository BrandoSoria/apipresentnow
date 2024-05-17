const moment = require('moment-timezone');
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
            console.log("con id ${numerocontrol}");
        });
    });


 // Actualizar un alumno existente
app.put('/alumnos/:numerocontrol', (request, response) => {
    const numerocontrol = request.params.numerocontrol;
    const { nombre, carrera } = request.body;
    pool.query('UPDATE Alumno SET Nombre = ?, Carrera = ? WHERE NumeroControl = ?', [nombre, carrera, numerocontrol], (error, result) => {
        if (error) throw error;
        response.send('Alumno actualizado correctamente ${numerocontrol}');
    });
});
    // Eliminar un alumno
    app.delete('/alumnos/:numerocontrol', (request, response) => {
        const numerocontrol = request.params.numerocontrol;
        pool.query('DELETE FROM Alumno WHERE NumeroControl = ?', numerocontrol, (error, result) => {
            if (error) throw error;
            response.send('Alumno eliminado correctamente ${numerocontrol}');
        });
    });


  
     
  app.post('/asistencias', (request, response) => {
      const { numeroControl, presente, materiaId } = request.body;
     const Fecha = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss'); 
      pool.query('INSERT INTO Asistencia (AlumnoID, Fecha, Presente, materiaId) VALUES (?, ?, ?, ?)', [numeroControl, Fecha, presente, materiaId], (error, result) => {
          if (error) {
              console.error('Error al registrar la asistencia:', error);
              return response.status(500).json({ error: 'Error interno del servidor' });
          }
          response.status(201).json({ message: 'Asistencia registrada correctamente a las ${Fecha}' });
      });
 });


app.get('/asistencias', (request, response) => {
    pool.query('SELECT DATE_FORMAT(Fecha, "%Y-%m-%dT%H:%i:%s") AS fechaConHora FROM Asistencia', (error, results) => {
        if (error) {
            console.error('Error al obtener las asistencias:', error);
            return response.status(500).json({ error: 'Error interno del servidor' });
        }
        const fechasFormateadas = results.map(asistencia => {
            const fecha = moment.tz(asistencia.fechaConHora, 'America/Mexico_City').format();
            return { fecha };
        });
        response.status(200).json(fechasFormateadas);
    });
});

}
module.exports = router;
