//***********CLIENT SIDE JavaScript *****************
// Initiate a connection
var socket = io();
var scrollval = 10;

// URL Parsing function
(function($){
  $.deparam = $.deparam || function(uri){
    if(uri === undefined){
      uri = window.location.search;
    }
    var queryString = {};
    uri.replace(
      new RegExp(
        "([^?=&]+)(=([^&#]*))?", "g"),
        function($0, $1, $2, $3) {
        	queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
        }
      );
      return queryString;
    };
})(jQuery);


// Checking for connection with the server
// Not using ES6 notation because it may fail in certain..
// ..devices
socket.on('connect', function(){
  // Parse params using custom function
  var params = jQuery.deparam(window.location.search);

  // emit a join event
  // send params as arguments
  // return an acknowledge function
  socket.emit('join', params , function(err){
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('success');
    }
  });
});

// When server is down
socket.on('disconnect', function() {
  console.log('Disconnected from the server');
});

// fetch location chat from the server
socket.on('newChatLoc', function(loc){
    var a = jQuery(`<a target="_blank"><i>:CurrentLoc</i></a>`);
    a.attr('href', loc.url);


    // Using Mustache to render a template in the chat box
    // It is used to make the application scalable and easier to manage
    var template = jQuery('#loc_chat_template').html();
    var html = Mustache.render(template, {
      url: loc.url,
      from: loc.from,
      createAt: moment(loc.createAt).format('h:mm a')
    });
    jQuery('#chats').append(html);
    var elem = jQuery('#top_section');
    elem.animate({ scrollTop: scrollval+=50 }, "fast");
});
// fetch chat message from the server
socket.on('newChat', function(chat) {

  // Similar to location using moustache for chats
  var formatTime = moment(chat.createAt).format('h:mm a');
  var template = jQuery('#chat_template').html();
  var html = Mustache.render(template, {
    text: chat.text,
    from: chat.from,
    createAt: formatTime
  });
  jQuery('#chats').append(html);
  var elem = jQuery('#top_section');
  elem.animate({ scrollTop: scrollval+=50 }, "fast");
})


var chatTextBox = jQuery('#chat_text');
$('#chat_form').submit(function(e){
  e.preventDefault();

  socket.emit('createChat', {
    from: jQuery.deparam(document.location.search).displayname,
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
