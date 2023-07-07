import express, { urlencoded } from 'express';
import products from "./routes/products.router.js"
import carts from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import {Server} from "socket.io"
import { createServer } from 'http';
import ProductManager from "./dao/filesystem/manager/ProductManager.js";
import mongoose from 'mongoose'
import Message from './dao/mongo/models/message.js';

const app = express();
const connection = await mongoose.connect("mongodb+srv://julianjuarez98jj:coder@cluster0.rizhfai.mongodb.net/?retryWrites=true&w=majority")
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new ProductManager();

app.use(express.json());
app.use(urlencoded({ extended: true }))
app.use('/api/products',products);
app.use('/api/carts',carts);


app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use("/",viewsRouter)
app.get('/filesystem', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
  });


  app.get('/chat', async (req, res) => {
    const messages = await Message.find().lean();
    res.render('chat', { messages });
  });

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('message', async (data) => {
    const { user, message } = data;

  if (!user || user.trim() === '') {
    console.log('Error: el campo "user" es requerido');
    return;
  }

    // Guardar el mensaje en la colección "messages" en MongoDB
    const newMessage = new Message({ user, message });
    await newMessage.save();

    // Emitir el evento "messageLogs" a todos los clientes conectados
    const messages = await Message.find().lean();
    io.emit('messageLogs', messages);
  });


  });

  httpServer.listen(8080, () => {
    console.log('Server is running on port 8080');
  });
  
export {io};


//RUTA PARA EL CHAT: localhost:8080/chat
/** EJEMPLO PARA PROBAR EL POST
 * {
    "title": "producto prueba 6",
    "description": "Este es un producto prueba 6",
    "code": "abc60",
    "price": 300,
    "stock": 8000,
    "category": "cloth",
    "thumbnail": "sim imagen"
  } */
// Ids de los carts para testear : 64a3a064b2d2e5ac49890d81  - 64a3a068b2d2e5ac49890d83  - 64a3aa880490f829160e5326  - 64a7339672d853e16a2d2deb

/*CONSULTAS AL ENDPOINT (reemplazar la x por el id)
para PRODUCTS
GET
localhost:8080/api/products
localhost:8080/api/products/x
POST
localhost:8080/api/products/
PUT Y DELETE
localhost:8080/api/products/x

para CARTS
POST
localhost:8080/api/carts
GET
localhost:8080/api/carts/X
POST de un product en un cart
localhost:8080/api/carts/x/product/x  */