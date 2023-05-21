const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    //Autorizacion por el header
    const authHeader = req.get('Authorization'); /*Permite acceder a lo que es la autorización, tiene que ser de esa forma, ya sea que se este utilizando axios en fetch, se tiene que pasar una autorización, si solo se abre el endpoint, no hay forma de enviarlo*/ 
    //console.log(authHeader)
    //Se esta cachando lo que se esta pasando como HEADER en la parte de Clientes .get('/clientes') como ejemplo, ahi es donde estrae el token
    //de localstorage y se verifica para verificar si la existe alguna autorizacion  
    if(!authHeader) {   //Si no se pasa ese header
        const error = new Error('No autenticado, no hay JWT');
        error.statusCode = 401;
        throw error;    //Cuando se mando un "throw error" el código deja de ejecutarse, no se ocupa un next()
    }

    //obtener el token y verificarlo si ya se esta mandando la autorización
    //Authorization: Bearer 65456545645646  <-- posicion 1
    const token = authHeader.split(' ')[1];
    let revisarToken
    try {
        revisarToken = jwt.verify(token, 'LLAVESECRETA');   //Tiene que ser la llave que se uso para firmar el token
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    //Si es un token valido, pero hay algún error, expiro o cualquier otro error
    if(!revisarToken) {
        const error = new Error('No Autenticado');
        error.statusCode = 401;  //No esta autorizado
        throw error;
    }

    next();     //Si pasa la verificación, entonces next() para que se pueda ir al siguiente middleware y el usuario pueda ver la información

}