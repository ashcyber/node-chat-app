// import modules classes...
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const {generateChat, generateLoc} = require('./utils/chat');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users.js');

// Loading the socketIO library
const socketIO = require('socket.io');

// inbuilt path module making it easy to access directories.
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// Using SocketIO
var server = http.createServer(app);
var io = socketIO(server);

// Creating the user instance
var users = new Users();

io.on('connection',(socket) => {
  // checks for the connection
  // The connection is initiated in the public/index.html
  console.log('New user connected');


  // On user Joining
  socket.on('join', (params, callback) => {
    if(!isRealString(params.displayname) || !isRealString(params.roomname)){
      return callback('Name and Room name are required.');
    }

    // Joining A specific room using join function
    socket.join(params.roomname);

    // Remove the user already present in other room
    users.removeUser(socket.id);

    // Add user list to the users
    users.addUser(socket.id, params.displayname, params.roomname);


    // emit the users to the chat.js page
    io.to(params.roomname).emit('updateUsers', users.getUsersInRoom(params.roomname));

    // Send message to the specific user connected
    socket.emit('newChat',
    generateChat('Admin', `Welcome to the ChatNode ${params.displayname}`));




    // Send message to everyone except the user connected in a particular room
    socket.broadcast.to(params.roomname).emit('newChat',
    generateChat('Admin', ` ${params.displayname} joined the ChatNode`));
    callback();
  });

  // Emit the location message to the room in which the user is connected
  // This event fires when chat.js sends createLocData message
  socket.on('createLocData', (loc) => {
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room_name).emit('newChatLoc', generateLoc(user.user_name, loc.lat, loc.long));
    }
  });

  //Create a chat event
  socket.on('createChat', (chat, callback) => {
    // IO emits to all the users
    // socket emits only to specific user
    var user = users.getUser(socket.id);

    if(user && isRealString(chat.text)){
      io.to(user.room_name).emit('newChat', generateChat(chat.from, chat.text));
    }

    // Calling the callback function given by the front end
    callback();
  })

  // room_name is User class varirable
  // roomname is params passed by the index.html file

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room_name).emit('updateUsers', users.getUsersInRoom(user.room_name));
      io.to(user.room_name).emit('newChat', generateChat('Admin', `${user.user_name} has left the room.`))
    }
  });

});


// app use static makes all the files in the public directory
// accessible to the client/it creates routes for the public files.
app.use(express.static(publicPath));


// listening to port usually 3000;
server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
