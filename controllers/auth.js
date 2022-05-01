const bcrypt = require('bcryptjs/dist/bcrypt');
const { response } = require ('express');
const { validationResult } = require('express-validator');
const { json } = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');


const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if ( existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'EL correo ya está registrado'
            })
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar mi JasonWebToken
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
}


const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'Email no encontrado'
            });
        }

        //Validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if ( !validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Contraseña no válida'
            });
        }

        // Generar el JWT
        const token = await generarJWT (usuarioDB.id);
        res.json({
            ok: true,
            usuario: usuarioDB,
            token 
        });

    } catch (error) {
        console.log(error);
        return res.status (500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        })
    }

}

    const renewToken = async (req, res = response) => {

        const uid = req.uid;

        const token = await generarJWT( uid );

        const usuario = await Usuario.findById( uid );

        res.json({
            ok: true,
            usuario,
            token
        })

}

    

module.exports = {
    crearUsuario,
    login,
    renewToken
}