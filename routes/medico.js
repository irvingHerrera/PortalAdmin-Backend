var express = require('express');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Medico = require('../models/medico');

// ==============================
// Obtener todos los medicos
// ==============================

app.get('/', (req, res, next) => {
    Medico.find({}, 'nombre img')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    medicos: medicos
                });
            });
});

// ==============================
// Crear un nuevo medico
// ==============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospitalID
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        });
    });
});

module.exports = app;