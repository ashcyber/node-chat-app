// Store utiltiy function related to chat

// Moment for time parsing
var moment = require('moment');

var generateChat = (from, text) =>  {
  return {
    from: from,
    text: text,
    createAt: moment().valueOf()
  }
}



var generateLoc = (from, lat, long) =>{
  return{
    from: from,
    url: `https://www.google.com/maps?q=${lat},${long}`,
    createAt: moment().valueOf()
  }
}

// Export
module.exports = {generateChat, generateLoc};
