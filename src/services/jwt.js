'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = "qwerty";

exports.createToken = (user) => {
    var payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    }
    return jwt.encode(payload, secret);
};