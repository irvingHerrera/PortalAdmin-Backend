// Requies
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if (err) {
        throw err;
    }

    console.log("Base de datos: online");
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3001, () => {
    console.log("Express server purto 3001 online");
});