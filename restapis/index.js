//La idae de un API es que pueda ser consumida desde otro servidor o tambien desde un telefono móvil

const express = require('express')
const router = require('./routes/indexRoutes')
const mongoose = require('mongoose')
require('dotenv').config({ path: 'variable.env'});

//Cors que permite que un cliente se conecte a otro servidor para el intercambio de recursos
const cors = require('cors')

//Conectar a mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
})

//Se crea el servidor
const app = express()

//Habilitar lectura de datos de formularios
//En versiones anteriores se usa "parser", sin embargo es obligatorio su uso, de los contrario no recibira nada
//Si son inputs de tipo archivos no los leerá, se debe instalar otra dependencia, uno muy cmún es "multer"
app.use(express.json())
app.use(express.urlencoded({extended: true}));

//Define aquella direcciones de solicitud 
//Definir un dominio(s) para recibir las peticiones
const whiteList = [process.env.FRONDEND_URL];
/*
const corsOptions = {   //objeto de configuración
    origin: (origin, callback) => { //Es un método que existe dentro de estas opciones  
        //console.log(origin)     
        //Revisar si la petición viene de un servidor que esta en whitelist, es decir aquella direccion que tiene permitido acceder mediante una solicitud
        const existe = whiteList.some(dominio => dominio === origin); //some revisa si en este arregle existe lo que viene siendo el origen
        if(existe) {    //Se revisa si esxite en la lista blanca
            callback(null, true);   //Si no tiene ningún error, entonces se puede ir al siguiente middleware
        } else {
            callback(new Error('No permitido por CORS'));   //Si no esta en el lista blaca se lanzá e siguiente error
        }
    }
}*/

//Habilitar cors
//app.use(cors(corsOptions));
app.use(cors());

app.use('/', router())

//Carpeta publica
app.use(express.static('uploads'))

app.listen(6001, () => {
    console.log('Servidor funcionando correctamente')
})


/*Esta api corre con una BD Local de MONGODB, para crearla se debe instalar MongoDB y configurar su ruta PATH, agregando la variable de entorno,
posteriormente se debe abrir una terminal y escribir los siguiente comandos "md \data"   "md \data\db" y finalmente para arrancar el servicio de 
mongo se teclea "mongod", se detienen con "ctrl c" y reinicia nuevamente con "monogod", esto se hacer para windows |||  mongod es el servicio,
|||  mongo corresponde a la sheel en la terminal*/

//mongoose:  npm i mongoose

//shortid: npm i shortid

//multer: npm i multer

//jsonwebtoken: npm i jsonwebtoken

//bcrypt: npm i bcrypt

