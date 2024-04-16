var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Agregar el middleware CORS

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configuración del motor de vistas como Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Establecer el entorno de la aplicación como producción
app.set('env', 'production');

// Middleware para el registro simplificado (comentar para desactivar)
// app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware CORS
app.use(cors());

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Middleware para manejar errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware para manejar errores generales
app.use(function(err, req, res, next) {
  // Renderizar página de error con un mensaje genérico
  res.status(err.status || 500);
  res.render('error', {
    message: 'Ha ocurrido un error en el servidor',
    error: {}
  });
});

module.exports = app;
