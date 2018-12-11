// Requies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
    next();
});

// bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoute = require('./routes/usuario');
var loginRoute = require('./routes/login');
var hospitalRoute = require('./routes/hospital');
var medicoRoute = require('./routes/medico');
var busquedaRoute = require('./routes/busqueda');
var uploadRoute = require('./routes/upload');
var imagenesRoute = require('./routes/imagenes');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', {
        useCreateIndex: true,
        useNewUrlParser: true
    },
    (err, res) => {
        if (err) {
            throw err;
        }

        console.log("Base de datos: online");
    });

//Serve index config
/*var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));*/

// Rutas
app.use('/usuario', usuarioRoute);
app.use('/login', loginRoute);
app.use('/hospital', hospitalRoute);
app.use('/medico', medicoRoute);
app.use('/busqueda', busquedaRoute);
app.use('/upload', uploadRoute);
app.use('/img', imagenesRoute);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3001, () => {
    console.log("Express server purto 3001 online");
});