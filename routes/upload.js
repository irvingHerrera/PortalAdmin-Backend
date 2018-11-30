var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    // tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El tipo de coleccion no es valida',
            errors: { message: 'El tipo de coleccion no es valida' }
        });
    }


    if (!req.files) {
        return res.status(500).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var arrayNombre = archivo.name.split('.');
    var extension = arrayNombre[arrayNombre.length - 1]

    //solo estas extenciones son aceptadas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son' + extensionesValidas.join(', ') }
        });
    }


    //nombre archivo
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;

    //mover el archivo 
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    console.log(nombreArchivo);
    console.log(path);
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
    })

    subirPorTipo(tipo, id, path, res);

    /*res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente',
        extension: extension
    });*/

});

function subirPorTipo(tipo, id, path, res) {

    if (tipo === 'usuarios') {


    } else if (tipo === 'medicos') {

    } else if (tipo === 'hospitales') {

    }
}

module.exports = app;