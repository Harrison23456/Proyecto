const jwt = require('jsonwebtoken');
const prefix = require('array-prefix')
const jwt_decode = require("jwt-decode");


module.exports = async function(req, res, next){


    let arraytoken = req.rawHeaders;
    let tokenminiprev = prefix('authentic', arraytoken);
    let tokenmini = tokenminiprev[0];
    if(!tokenmini){
        return res.redirect('/');
    }
    let token = `${tokenmini.slice(21)}`;
    let decoded = jwt_decode(tokenmini);

    try {
        const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET)
        req.user = verified;
        next()
    } catch (error) {
        res.status(400).send('Token no válido.')
        console.log(error)
    }
    
}
