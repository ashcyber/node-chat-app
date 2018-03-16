//***********CLIENT SIDE JavaScript *****************
// Initiate a connection request
var socket = io();

// Checking for connection with the server
// Not using ES6 notation because it may fail in certain..
// ..devices
socket.on('connect', function(){
  console.log('Connected to the server');
  // emit a chat create event from client
});

// When server is down
socket.on('disconnect', function() {
  console.log('Disconnected from the server');
});


// fetch chat message from the server
socket.on('newChat', function(chat) {
  console.log('newChat', chat);
})



//Sending Acknowledgements with callbacks
socket.emit('createChat', {
  from: 'Frank',
  text: 'Hi'
}, function(resp){
  console.log(`The message is received: ${resp}`)
});
