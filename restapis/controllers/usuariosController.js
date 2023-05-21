const Usuarios = require('../models/Usuarios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.registrarUsuario = async (req, res) => {
    //leer los datos del usuario y colocarlos en Usuario
    const usuario = new Usuarios(req.body) //Lo que pongamos en el formulario se pasa automaticamente y se mapea automaticamente tambien
    usuario.password = await bcrypt.hash(req.body.password, 10) //Se hashea el passwrod antes de ser almacenada
    try {
        await usuario.save(); //Se coloca un trycatch para estar seguro de que se almaceno, quizas hubo un error con el email y ya existia
        res.json({mensaje: 'Usuario Creado Correctamente'}) //Son los usuario que le dan mantenimiento al sistema, es decir,
                                                            //quines dan de alta productos, pedidos y clientes, distinto a los clientes
    } catch (error) {
        console.error(error);
        res.json({mensaje: 'Hubo un error'})
    }
}

exports.autenticarUsuario = async (req, res, next) => { //Se pone next, para que en caso de que un usuario no exista, se deje de ejecutar

    //buscar el usuario
    const { password } = req.body
    const usuario = await Usuarios.findOne({email: req.body.email}); //Se busca se exite el usuario

    if(!usuario) {
        //Si el usuario no existe
        await res.status(401).json({mensaje: 'Ese usuario no existe'}); //401: mensaje de no autorizado
        next(); //Para que se vaya al siguiente middleware y se deje de ejecutar
    } else {
        //El usuario existe, verificar si el password es correcto o incorrecto
        if(!bcrypt.compareSync(password, usuario.password)){ //Se compara el passwrod del body con el del usuario extraido
            //si el password es incorrecto 
            await res.status(401).json({mensaje: 'Password incorrecto'})
            next()
        } else {
            //Password correcto, firmar el token
            const token = jwt.sign({    //Se le pasa lo que se le conoce como payload, datos con los que forma el token
                email: usuario.email,
                nombre: usuario.nombre,
                id: usuario._id
            }, 
            'LLAVESECRETA',  //Esta palabra ayuda a firmar el token, es como un extra
            {
                expiresIn: '1h'
            });

            //Retornar el token al lado de cliente o vista en React para que sea validado
            res.json(token)
        }
    }
}