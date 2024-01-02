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

const corsOptions = {
  origin: 'http:/192.168.1.4:3000',
};

dotenv.config();

const hostname = process.env.SERVERURL;
const port = process.env.SERVERPORT;
var connectedUsers = new Map();
app.use(morgan("dev"));
app.use(cors(corsOptions));
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
  console.log(connectedUsers)
  socket.on('userConnected', (userId) => {
    // When a user connects, store their socket ID in the connectedUsers Map
    console.log(userId);
    connectedUsers.set(userId, socket.id);
   
});
  socket.on('sendMessage', (messageData) => {
    try {
      const parsedData = JSON.parse(messageData);
      // Assuming `addOnceMessage` function requires `req` and `res` parameters
      const fakeReq = { body: parsedData }; // Creating a fake req object
      var fakeRes = {
        json: (data) => {
          console.log(data); // Output the result or handle as needed
        },
        status: () => ({ json: (error) => console.error(error) }),
      }; // Creating a fake res object
 
      fakeRes=addOnceMessage(fakeReq, fakeRes) .then((newMessage) => {
        console.log(newMessage);
     
      const { sender, recipient, content } = parsedData;
      const receiverSocketId = connectedUsers.get(parsedData.recipient);
  if (receiverSocketId) {
    console.log('ReceiverSocket')
      io.to(receiverSocketId).emit('receiveMessage', messageData);
      socket.emit('receiveMessage', messageData);
      console.log("innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
     // socket.emit('receiveMessage', messageData);
  } else {
   // console.log(parsedData.recipient)
    console.log("noooooooooooooooooooo")
    socket.emit('receiveMessage', messageData);
  }
})
.catch((error) => {
  console.error(error);
  // Handle errors that occurred during message addition
  // You might want to emit an error event or handle it as needed
});

// Invoking addOnceMessage function
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      console.log('Received messageData:', messageData);
    }
   // addOnceMessage(messageData[0])
          /*  .then((newMessage) => {
                // Emit an event back to the client or do something else with the new message
                socket.emit('receiveMessage', messageData);
                          })
            .catch((error) => {
                // Handle any error that occurs during message addition
                console.error(error);
                // Emit an error event or handle it as needed
            });*/
         
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    connectedUsers.forEach((value, key) => {
      if (value === socket.id) {
        connectedUsers.delete(key);
      }
    });
  });
});
httpServer.listen(port, () => {
  console.log(`Server running on :${port}`);
});