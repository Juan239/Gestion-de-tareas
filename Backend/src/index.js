import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';

import { createServer } from 'http';
import { WebSocketServer } from 'ws';


import tareasRoutes from './routes/tareas.routes.js';

const app = express();

config();

const PORT = process.env.SERVER_PORT;

app.use(cors(
    {
        origin: '*', //Para prevenir problemas al probar la API voy a dejar que se pueda acceder desde cualquier origen
        methods: ['GET', 'POST', 'PUT', 'DELETE'],        
    }
));
app.use(express.json());

app.use(tareasRoutes)

const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);
    ws.send('Mensaje recibido en el servidor');
  });

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
  });
});

server.listen(PORT, () => {
    if(PORT === undefined){
        console.error("Error: La variable de entorno SERVER_PORT no está definida");
        process.exit(1);
    }
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export { wss };