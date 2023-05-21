const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/clienteController')
const productosController = require('../controllers/productosController')
const pedidosController = require('../controllers/pedidosController')
const usuariosController = require('../controllers/usuariosController')

//middle ara proteger las rutas
const auth = require('../middleware/auth')

module.exports = function() {
    //En una api es recomendable llevar un orden

    //Agrega nuevos clientes via POST
    router.post('/clientes',
        //auth,
        clienteController.nuevoCliente);

    //Obtener todos los clientes
    router.get('/clientes',
        auth,   //Se le podria poner este middle para revisar si existe la autorizacion de obtener todos los clientes
        clienteController.mostrarClientes
    );

    //Muestra un cliente en especifico (ID)
    router.get('/clientes/:idCliente',
        //auth,
        clienteController.mostrarCliente)

    //Actualizar cliente   put actualiza todo el registro
    router.put('/clientes/:idCliente', 
        //auth,
        clienteController.actualizarCliente)

    //Eliminar cliente
    router.delete('/clientes/:idCliente', 
        //auth,
        clienteController.eliminarCliente)

    //Productos
    //Nuevos productos
    router.post('/productos',
        //auth, //Primero revisamos que estan autenticados y despues les permitimos subir un producto 
        productosController.subirArchivo,  //Primero se sube el archivo, despues se almacena el producto con toda la configuración
        productosController.nuevoProducto
    );

    //Muestra todos los productos
    router.get('/productos', 
        auth,
        productosController.mostrarProductos);

    //muestra un producto en especifico
    router.get('/productos/:idProducto', 
        //auth,        
        productosController.mostrarProducto);

    //Actualizar Productos
    router.put('/productos/:idProducto',
        //auth,
        productosController.subirArchivo,
        productosController.actualizarProducto
    );

    //Eliminar productos
    router.delete('/productos/:idProducto', 
        //auth,
        productosController.eliminarProducto);

    //Busqueda de Productos
    router.post('/productos/busqueda/:query', 
        //auth,
        productosController.buscarProducto);

    //**PEDIDOS/
    //Agrega nuevos pedidos
    router.post('/pedidos/nuevo/:idPedido', 
        //auth,
        pedidosController.nuevoPedido)

    //mostrar todos los pedidos
    router.get('/pedidos', 
        //auth,
        pedidosController.mostrarPedidos)

    //mostrar un pedido por su ID
    router.get('/pedidos/:idPedido', 
        //auth,        
        pedidosController.mostrarPedido);

    //Actualizar pedidos
    router.put('/pedidos/:idPedido', 
        //auth,
        pedidosController.actualizarPedido);

    //Eliminar un pedido
    router.delete('/pedidos/:idPedido', 
        //auth,
        pedidosController.eliminarPedido);

    //Users Se crean algunos usuarios para probar con la verificación
    router.post('/crear-cuenta', 
        //auth,     
        usuariosController.registrarUsuario)

    router.post('/iniciar-sesion', usuariosController.autenticarUsuario)              

    return router;
}

