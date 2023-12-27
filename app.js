import express from "express";
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from "url";
import connectDb from "./config/db.js";
import router from "./routes/myroutes.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { addOnceMessage } from './controller/messageController.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();

const hostname = process.env.SERVERURL;
const port = process.env.SERVERPORT;
const connectedUsers = new Map();
app.use(morgan("dev"));

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/api/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
    }
  });
});
app.use("/public/images", express.static(path.join(__dirname, "public/images")));



io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('userConnected', (userId) => {
    // When a user connects, store their socket ID in the connectedUsers Map
    console.log(userId);
    connectedUsers.set(userId, socket.id);
});
  socket.on('sendMessage', (messageData) => {
    addOnceMessage(messageData)
          /*  .then((newMessage) => {
                // Emit an event back to the client or do something else with the new message
                socket.emit('receiveMessage', messageData);
                          })
            .catch((error) => {
                // Handle any error that occurs during message addition
                console.error(error);
                // Emit an error event or handle it as needed
            });*/
            const { sender, recipient, content } = messageData;
            const receiverSocketId = connectedUsers.get(sender);
        if (receiverSocketId) {
          console.log('ReceiverSocket')
            io.to(receiverSocketId).emit('receiveMessage', messageData);
           // socket.emit('receiveMessage', messageData);
        } else {
          
          socket.emit('receiveMessage', messageData);
        }
  
  
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
httpServer.listen(port, () => {
  console.log(`Server running on ${port}`);
});