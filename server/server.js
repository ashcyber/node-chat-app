// IO
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const {generateChat} = require('./utils/chat');
// Loading the socketIO library
const socketIO = require('socket.io');

// inbuilt path module making it easy to access directories.
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// Using SocketIO
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket) => {
  // checks for the connection
  // The connection is initiated in the public/index.html
  console.log('New user connected');


  // Send message to the specific user connected
  socket.emit('newChat',
  generateChat('Admin', 'Welcome to the Chat App'));


  // Send message to everyone except the user connected
  socket.broadcast.emit('newChat',
  generateChat('Admin', 'New User Joined the App'));



  //Create a chat event
  socket.on('createChat', (chat) => {
    console.log('createChat', chat);
    // IO emits to all the users
    // socket emits only to specific user
    io.emit('newChat', generateChat(chat.from, chat.text));


  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
