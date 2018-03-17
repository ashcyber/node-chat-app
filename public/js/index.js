//***********CLIENT SIDE JavaScript *****************
// Initiate a connection
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


// fetch location chat from the server
socket.on('newChatLoc', function(loc){
  var li = `<li>
      <b>${loc.from} ${moment(loc.createAt).format('h:mm a')}</b> :
      <i> <a href='${loc.url}' target="_blank">MyLocation</a></i>
    </li>`;

    $('#chats').append(li);

  // var li = jQuery('<li></li>');
  // var a = jQuery(`<a target="_blank"><i>:CurrentLoc</i></a>`)
  // li.text(`${loc.from}`);
  // a.attr('href', loc.url);
  // li.append(a);
  // $('#chats').append(li);

});



// fetch chat message from the server
socket.on('newChat', function(chat) {
  var formatTime = moment(chat.createAt).format('h:mm a');
  console.log('newChat', chat);
  var li = `<li><b>${chat.from} ${formatTime} </b> :<i> ${chat.text}</i></li>`
  $('#chats').append(li);
})


var chatTextBox = jQuery('#chat_text');
$('#chat_form').submit(function(e){
  e.preventDefault();

  socket.emit('createChat', {
    from: 'ashcyber',
    text: chatTextBox.val()
  }, function(){
    chatTextBox.val('');
  });
})



var locBtn = $('#sub_btn_loc');
locBtn.click(function(e){
    e.preventDefault();

    // No geolocation
    if(!navigator.geolocation){
      return alert('Geolocation is not supported by the browser.');
    }

    locBtn.attr('disabled', 'disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function(pos){
      console.log('fetching location: ');
      locBtn.removeAttr('disabled');
      locBtn.html('<span class="glyphicon glyphicon-map-marker">&nbsp;MapMe</span>');
      socket.emit('createLocData', {
        lat: pos.coords.latitude,
        long: pos.coords.longitude
      });
      console.log('location: ' + pos.coords.latitude);

    },function(){
      // Error handler
      locBtn.html('<span class="glyphicon glyphicon-map-marker">&nbsp;MapMe</span>');
      locBtn.removeAttr('disabled');
      alert('Cannot fetch the location')
    });
})
