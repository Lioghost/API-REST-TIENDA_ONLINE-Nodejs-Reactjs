const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const clientesSchema = new Schema({
    nombre: {
        type: String,
        trim: true
    },
    apellido: {
        type: String,
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,  //De esta forma cada cliente debe tener un email diferente
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    }
});

//Enviar alerta cuando un usuario ya esta registrado
/*
//Se ha comentado con la finalidad de detectar el error en React
clientesSchema.post('save', function(error, doc, next) {
    if(error.name === 'MongoServerError' && error.code === 11000) {
        next('El correo ingresado ya esta registrado')
    } else {
        next(error); //Es importante colocar next(error) porque pueden pasar muchos errores y tal vez el error que sucede no corresponde a este codigo
        //y no se quiere que se detenga la ejecucion del programa, se da next() a este error para que se siga ejecutando el middleware con los errores que sucedan
    }
})
*/

module.exports = mongoose.model('Clientes', clientesSchema)