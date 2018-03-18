// IO
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const {generateChat, generateLoc} = require('./utils/chat');
const {isRealString} = require('./utils/validation');


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


  // On user Joining
  socket.on('join', (params, callback) => {
    if(!isRealString(params.displayname) || !isRealString(params.roomname)){
      callback('Name and Room name are required.');
    }

    // Joining A specific room using join function
    socket.join(params.roomname);


    // Send message to the specific user connected
    socket.emit('newChat',
    generateChat('Admin', `Welcome to the ChatNode ${params.displayname}`));


    // Send message to everyone except the user connected in a particular room
    socket.broadcast.to(params.roomname).emit('newChat',
    generateChat('Admin', ` ${params.displayname} joined the ChatNode`));

    callback();
  });




  //Get Location from user
  socket.on('createLocData', (loc) => {
    io.emit('newChatLoc', generateLoc('Admin', loc.lat, loc.long));
  });


  //Create a chat event
  socket.on('createChat', (chat, callback) => {
    console.log('createChat', chat);
    // IO emits to all the users
    // socket emits only to specific user
    io.emit('newChat', generateChat(chat.from, chat.text));

    // Calling the callback function given by the front end
    callback();
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
