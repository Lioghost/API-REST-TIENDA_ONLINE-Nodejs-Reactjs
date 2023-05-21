const Pedidos = require('../models/Pedidos')

exports.nuevoPedido = async (req, res, next) => {

    const pedido = new Pedidos(req.body)

    try {
        await pedido.save();
        res.json({mensaje: 'Se agrego un nuevo pedido'})
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.mostrarPedidos = async (req, res, next) => {
    
    try {
        //Debido a que el modelo mantiene una relacion con otros modelos, se ejecuta populate() dos veces, recordar que la segunda relacion presenta
        //cierto grado de anidamiento, por lo que es necesario definir la ruta "path" y el "model"
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        })  //populate ayuda a traer las relaciones en el modelo

        res.json(pedidos)
    } catch (error) {
        console.error(error)
        next()
    }
}

exports.mostrarPedido = async (req, res, next) => {

    const pedido = await Pedidos.findById(req.params.idPedido).populate('cliente').populate({
        path: 'pedido.producto',
        model: 'Productos'
    })  //populate ayuda a traer las relaciones en el modelo

    if(!pedido) {
        res.json({mensaje: 'Ese pedido no existe'});
        return next();      //return para que no se ejecute la siguiente linea
    }

    //mostrar el pedido
    res.json(pedido)
}

//Actualizar el pedido via BD
exports.actualizarPedido = async (req, res, next) => {

    try {
        let pedido = await Pedidos.findOneAndUpdate({_id: req.params.idPedido}, req.body, {
            new: true
        }).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        })  //populate ayuda a traer las relaciones en el modelo

        res.json(pedido)
    } catch (error) {
        console.error(error)
        next()
    }
}

//Eliminar pedido
exports.eliminarPedido = async (req, res, next) => {

    try {
        const pedido = await Pedidos.findOneAndDelete({_id: req.params.idPedido}) //Va a buscar algun pedido por su "ID", si no lo encuentra cae en el catch
        res.json({mensaje: 'El pedido se ha eliminado'})
    } catch (error) {
        console.error(error)
        next()
    }   
}