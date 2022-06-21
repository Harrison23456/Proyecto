const jwt = require('jsonwebtoken')

module.exports = async function(req, res, next){
    const tokenmini = req.rawHeaders[33];
    if(!tokenmini){
        return res.redirect('/');
    }
    console.log(tokenmini)
    let token = `${tokenmini.slice(21)}`;

    try {
        const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET)
        req.user = verified;
        next()
    } catch (error) {
        res.status(400).send('Token no válido.')
        console.log(error)
    }
    
}
