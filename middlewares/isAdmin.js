const jwt = require('jsonwebtoken');
const prefix = require('array-prefix')
const jwt_decode = require("jwt-decode");

function isAdmin(req, res, next) {  
let arraytoken = req.rawHeaders;
let tokenminiprev = prefix('authentic', arraytoken);
let tokenmini = tokenminiprev[0];
let token = `${tokenmini.slice(21)}`;
let decoded = jwt_decode(tokenmini);
	let Admin = decoded.tipo
    if (Admin.slice(0, 2)  === 'ad') {
        next();
    } else {
        res.redirect('/salas/salas_varias')
    }
}

module.exports = isAdmin;
