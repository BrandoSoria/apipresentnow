const moment = require('moment-timezone');
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
            console.log("con id ${rfc}");
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
            response.json({ message: 'Profesor actualizado correctamente con RFC ${rfc}' });
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
            response.json({ message: 'Profesor eliminado correctamente con RFC ${rfc}' });
        });
    });

    //entrada de profesor
    app.post('/entrada/profesor', (request, response) => {
        const { profesorRfc, entro } = request.body;
       const FechaHora = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss'); 
        pool.query('INSERT INTO EntradaMaestro (ProfesorRFC, FechaHora, Entro) VALUES (?, ?, ?)', [profesorRfc, FechaHora, entro], (error, result) => {
            if (error) {
                console.error('Error al registrar la asistencia:', error);
                return response.status(500).json({ error: 'Error interno del servidor' });
            }
            response.status(201).json({ message: 'Asistencia registrada correctamente a las' });
        });
   });
  
  // Obtener todas las asistencias
  app.get('/entrada/profesor', (request, response) => {
      pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM EntradaMaestro', (error, results) => {
          if (error) {
              console.error('Error al obtener las Entradas de maestros:', error);
              return response.status(500).json({ error: 'Error interno del servidor' });
          }
          const formattedDates = results.map(result => {
              const FechaHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
              return { ...result, FechaHora };
          });
          response.status(200).json(formattedDates);
      });
  });
  //obtener entrada por rfc
  app.get('/entrada/profesor/:rfc', (request, response) => {
      const rfc = request.params.rfc;
      pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM EntradaMaestro WHERE ProfesorRFC = ?', [rfc], (error, results) => {
          if (error) {
              console.error('Error al obtener las Entradas de maestros:', error);
              return response.status(500).json({ error: 'Error interno del servidor' });
          }
          const formattedDates = results.map(result => {
              const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
              return { ...result, fechaConHora };
          });
          response.status(200).json(formattedDates);
      });
  });

//salida de profesor
app.post('/salida/profesor', (request, response) => {
    const { profesorRfc, salida } = request.body;
    const fecha = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    pool.query('INSERT INTO SalidaMaestro (ProfesorRFC, FechaHora, Salio) VALUES (?, ?, ?)', [profesorRfc, fecha, salida], (error, result) => {
        if (error) {
            console.error('Error al registrar la asistencia:', error);
            return response.status(500).json({ error: 'Error interno del servidor' });
        }
        response.status(201).json({ message: 'Asistencia registrada correctamente a las' });
    });
});

app.get('/salida/profesor', (request, response) => {
    pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM SalidaMaestro', (error, results) => {
        if (error) {
            console.error('Error al obtener las Entradas de maestros:', error);
            return response.status(500).json({ error: 'Error interno del servidor' });
        }
        const formattedDates = results.map(result => {
            const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
            return { ...result, fechaConHora };
        });
        response.status(200).json(formattedDates);
    });
});

app.get('/salida/profesor/:rfc', (request, response) => {
    const rfc = request.params.rfc;
    pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM SalidaMaestro WHERE ProfesorRFC = ?', [rfc], (error, results) => {
        if (error) {
            console.error('Error al obtener las Entradas de maestros:', error);
            return response.status(500).json({ error: 'Error interno del servidor' });
        }
        const formattedDates = results.map(result => {
            const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
            return { ...result, fechaConHora };
        });
        response.status(200).json(formattedDates);
    });
});  


}



module.exports = router;