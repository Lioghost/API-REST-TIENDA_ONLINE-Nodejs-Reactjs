const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pedidosSchema = new Schema({
    cliente: {
        type: Schema.ObjectId, //Cada Schema tiene un cliente, este cliente hace referencia hacia la otra coleccion
        ref: 'Clientes'  //Corresponde a cmo se haya nombrado el modelo 
    },
    pedido: [{       //Un pedido puede tener uno o multiples productos
        producto: {
            type: Schema.ObjectId, //Se hace referencia hacia otra coleccion, cuidar la manera en la que se accede a esta relacion al hacer la consulta debido a que presenta cierta grado de anidamiento 
            ref: 'Productos'
        },
        cantidad: Number  //La consultas anterior solo nos trae el producto, pero es necesario traer la cantidad
    }],
    total: {
        type: Number
    }
});

module.exports = mongoose.model('Pedidos', pedidosSchema)