var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

var mdAutenticacion = require('../middlewares/autenticacion');

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// ======================================
// Renueva token
// ======================================

app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas

    res.status(200).json({
        ok: true,
        token: token
    });

});

// ======================================
// Autenticación google
// ======================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '683132020559-ocl3c3q2hoqgcfrqrpl6bisp7htg38qg.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    try {
        var googleUser = await verify(token)
    } catch (err) {
        res.status(403).json({
            ok: false,
            mensaje: 'Token de google no valido',
            errors: { menssage: "Token de google no valido" }
        });

        return;
    }

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usuar su autenticación normal',
                    errors: err
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                    mensaje: 'Login post correcto',
                    menu: obtenerMenu(usuarioDB.role)
                });
            }
        } else {
            // El usuario no existe... hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                    mensaje: 'Login post correcto',
                    menu: obtenerMenu(usuarioDB.role)
                });
            });
        }

    });


    /*return res.status(200).json({
        ok: true,
        mensaje: 'OK!!!',
        googleUser: googleUser
    })*/
});

// ======================================
// Autenticación normal
// ======================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //crear toquen
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            mensaje: 'Login post correcto',
            menu: obtenerMenu(usuarioDB.role)
        });


    });

});

function obtenerMenu(role) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Tablero', url: '/dashboard' },
                { titulo: 'Barra de progreso', url: '/progress' },
                { titulo: 'Gráficas', url: '/grafica1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'rxjs', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Médicos', url: '/medicos' },
            ]
        }
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' }, );
    }

    return menu;

}

module.exports = app;