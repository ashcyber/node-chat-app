const path = require('path');
const express = require('express');
const http = require('http');
const app = express();

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

  // Creating emit event from server to client
  socket.emit('newChat', {
    from: 'Server.js',
    text: 'hello, world'
  });


  //Create a chat event
  socket.on('createChat', (chat) => {
    console.log('createChat', chat);
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
