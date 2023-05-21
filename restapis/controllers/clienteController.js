const Clientes = require('../models/Cliente')

//Agrega un nuevo cliente
exports.nuevoCliente = async (req, res, next) => {

    const cliente = new Clientes(req.body)      //Cada uno de los registros enviado son mapeados automaticamente en cada uno de los campos del modelo

    try {
        //Almacenar el registro
        await cliente.save();
        res.json({mensaje: 'Se agrego un nuevo cliente'})
    } catch (error) {
        //si hay un error, console y next()
        //console.error(error)   //El error recibido provendrá de la BD, debido a que se agrego codigo extra para tratar los errores
        res.send(error)     //Se coloca un res.send() para que se pueda debbuguear por el lado del cliente (React), eso seria lo ideal en un ambiente de producción
        next();  //No queremos que la aplicacion se detenga, por lo tanto que se vaya al siguiente middleware
    }
}

//Mostar todos los clientes
exports.mostrarClientes = async (req, res, next) => {

    try {
        const clientes = await Clientes.find({});
        res.json(clientes)
    } catch (error) {
        console.error(error)
        next();
    }
}

//Muestra un cliente por su ID
exports.mostrarCliente = async (req, res, next) => {

    const cliente = await Clientes.findById(req.params.idCliente);

    if(!cliente) {
        res.json({mensaje: 'Ese cliente no existe'})
        next();
    }

    //Mostrar el cliente
    res.json(cliente)
}

//Actualiza un cliente por su ID
exports.actualizarCliente = async (req, res, next) => {

    try {   //El primer parametro hace referencia al elemento a buscar, el segundo es con que se va a actualizar, y el tercero representa un callback
        const cliente = await Clientes.findOneAndUpdate({ _id: req.params.idCliente },
            req.body, {
                new: true   //mongoose almacena el valor previo a la actualizacion y el valor nuevo, con esta instruccion se le dice que traiga el nuevo
            });
        res.json(cliente)
    } catch (error) {
        console.error(error);
        next()
    }
}

//Elimina un cliente por su ID
exports.eliminarCliente = async (req, res, next) => {

    try {
        await Clientes.findByIdAndDelete({_id: req.params.idCliente});
        res.json({mensaje: 'El cliente se ha eliminado'})
    } catch (error) {
        console.error(error)
        next()
    }
}
