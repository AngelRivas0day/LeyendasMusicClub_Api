'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'qwerty';

exports.ensureAuth = (req, res, next) => {
    const token = req.headers.token.replace(/['"]+/g, '');
    var payload = [];
    if(!req.headers.token){
        return res.stauts(403).send({
            message: "No hay token en el header"
        })
    }
    try{
        payload = jwt.decode(token, secret);
        console.log(payload);
        if(payload.exp <= moment().unix()){
            return res.status(500).send({
                message: "El token expiro"
            })
        }
    }catch(ex){
        console.log(ex);
        return res.status(500).send({
            message: "La petición no tiene la cabecera con el token"
        })
    }
    req.user = payload;
    next();
};