import express from "express";
import http from "http";
import {Server} from "socket.io";
import {Chess} from "chess.js";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.dirname(new URL(import.meta.url).pathname); // Get the directory name
const port = 3000;

const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
})

server.listen(port, () => {
    console.log("listening on port " + port);
})






// chatgpt code for broadcast

// server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    // Broadcast the message to all other clients
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
// });

// client


<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      /* Basic styling for the chat */
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        padding: 8px;
        margin-bottom: 10px;
        background-color: #f1f1f1;
        border-radius: 4px;
      }
      input {
        padding: 10px;
        margin-right: 10px;
        width: 80%;
      }
      button {
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <input id="m" autocomplete="off" /><button>Send</button>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();
      document.querySelector('button').onclick = function() {
        var input = document.getElementById('m');
        socket.emit('chat message', input.value);
        input.value = '';
      };

      socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        item.textContent = msg;
        document.getElementById('messages').appendChild(item);
      });
    </script>
  </body>
</html>




// custom namespace code here:

// server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Default namespace
io.on('connection', (socket) => {
  console.log('a user connected to the default namespace');
  socket.on('disconnect', () => {
    console.log('user disconnected from the default namespace');
  });
});

// Custom namespace
const customNamespace = io.of('/custom-namespace');
customNamespace.on('connection', (socket) => {
  console.log('a user connected to the custom namespace');
  socket.on('custom-event', (data) => {
    console.log('custom-event received with data:', data);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected from the custom namespace');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});



// client
<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO Namespaces</title>
  </head>
  <body>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      // Connect to the default namespace
      var socket = io();

      // Connect to the custom namespace
      var customSocket = io('/custom-namespace');

      // Listen for events on the custom namespace
      customSocket.on('custom-event', function(data) {
        console.log('Received custom-event with data:', data);
      });

      // Emit an event to the custom namespace
      customSocket.emit('custom-event', { my: 'data' });
    </script>
  </body>
</html>


// ROOMS code here:
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  // Join a room
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Leave a room
  socket.on('leave room', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});








<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO Rooms</title>
  </head>
  <body>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();

      // Join a room
      function joinRoom(room) {
        socket.emit('join room', room);
      }

      // Leave a room
      function leaveRoom(room) {
        socket.emit('leave room', room);
      }

      // Example usage
      joinRoom('room1');
      leaveRoom('room1');
    </script>
  </body>
</html>







io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('leave room', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  // Broadcast to a specific room
  socket.on('message', (data) => {
    const { room, message } = data;
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});





<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO Rooms</title>
  </head>
  <body>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();

      socket.on('message', function(msg) {
        console.log('Received message:', msg);
      });

      function joinRoom(room) {
        socket.emit('join room', room);
      }

      function leaveRoom(room) {
        socket.emit('leave room', room);
      }

      function sendMessage(room, message) {
        socket.emit('message', { room, message });
      }

      // Example usage
      joinRoom('room1');
      sendMessage('room1', 'Hello Room 1!');
    </script>
  </body>
</html>
