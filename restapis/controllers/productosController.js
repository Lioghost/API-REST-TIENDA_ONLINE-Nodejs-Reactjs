const Productos = require('../models/Productos')
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs').promises

//Opciones de multer
const configuracionMulter = {
    //limits: {fileSize: 100000 },  //Corresponde a 100kbytes, debe ser la primera validación, para que asi en caso de cualquier error, pueda ser mostrado en las siguientes instrucciones que permiten errores
    storage: fileStorage = multer.diskStorage({  //Donde se van a almacenar los archivos que van subiendo
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../uploads/')
        }, 
        filename: (req, file, cb) => {
           //file contiene la infomracion del archivo que se sube
            const extension = file.mimetype.split('/')[1];  //Se divide el mimetype y se extrae la extension de las imagenes          
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            //el callback se ejecuta como true o false: true cuando la imagen se acepta
            cb(null, true); 
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');  //single() es el nombre del campo que se va a leer que va a contener el nombre del archivo

//Sube un archivo
exports.subirArchivo = (req, res, next) => {

    upload(req, res, function(error) {
        if(error) {
            res.json({mensaje: error})
        }
        return next()
    })
}

exports.nuevoProducto = async (req, res, next) => {

    const producto = new Productos(req.body)

    try {
        if(req.file.filename) {
            producto.imagen = req.file.filename
        }
        await producto.save()
        res.json({mensaje: 'Se agrego un nuevo producto'})
    } catch (error) {
        console.error(error)
        next()
    }
}

//Muestra todos los productos
exports.mostrarProductos = async (req, res, next) => {

    try {
        //Obtener todos los productos
        const productos = await Productos.find({}) //Se traen todos los productos
        res.json(productos)
    } catch (error) {
        console.error(error)
        next();     //next() para que no se quede atorado por algo
    }
}

//Muestra un producto en especifico
exports.mostrarProducto = async (req, res, next) => {

    const producto = await Productos.findById(req.params.idProducto);

    if(!producto) {
        res.json({mensaje: 'Ese Producto no Existe'})
        return next()
    }

    //Mostrar el producto
    res.json(producto);
}

//Actualiza un producto via id
exports.actualizarProducto = async (req, res, next) => {

    try {
        //Construir un nuevo producto, Se asigna la actualización, considerar que podria no haber un campo de imagen, es decir que unicamente se actualizaría la información 
        let productoAnterior = await Productos.findById(req.params.idProducto)
        let nuevoProducto = req.body;

        //Verificar si hay imagen nueva
        if(req.file) {  //Se coloca únicamente file, ya que si no existe el campo de file no ingresara al conficional if() y no actualizaria la imagen
            await fs.unlink(`uploads/${productoAnterior.imagen}`)   //Borra la imagen anterior de la carpeta uploads
            nuevoProducto.imagen = req.file.filename; 
        } else {
            nuevoProducto.imagen = productoAnterior.imagen;  //En casi de que no haya una nueva imagen se asigna la imagen subida con anterioridad al nuevo producto
        }

        let producto = await Productos.findByIdAndUpdate({_id: req.params.idProducto},
            nuevoProducto, {
                new: true   //mongoose almacena el valor previo a la actualizacion y el valor nuevo, con esta instruccion se le dice que traiga el nuevo
            })

        res.json(producto)

    } catch (error) {
        console.error(error);
        next()
    }
}

//Elimina un producto vía ID
exports.eliminarProducto = async (req, res, next) => {

    try {
        
        const producto = await Productos.findOneAndDelete({_id: req.params.idProducto });
        //Eliminar la imagen asociada
        /*unlink ayuda a eliminar un archivo o enlace simbolico, es propio de nodeJs*/
        //await fs.unlink(`/uploads/${producto.imagen}`)
        await fs.unlink(`uploads/${producto.imagen}`)
            
        res.json({mensaje: 'El Producto se ha Eliminado'})
    } catch (error) {
        console.error(error)
        next()
    }
}

exports.buscarProducto = async (req, res, next) => {

    try {
        //Obtener query 
        const { query } = req.params;
        const producto = await Productos.find({nombre: new RegExp(query, 'i')}) //Se coloca una expresion regular
        //a la busqueda para que no sea exacta la busqueda y permita mayusculas-minusculas
        res.json(producto)
    } catch (error) {
        console.error(error);
        next();
    }
}