// Store utiltiy function related to chat

var generateChat = (from, text) =>  {
  return {
    from: from,
    text: text,
    createAt: new Date().getTime()
  }
}



var generateLoc = (from, lat, long) =>{
  return{
    from: from,
    url: `https://www.google.com/maps?q=${lat},${long}`
  }
}

// Export
module.exports = {generateChat, generateLoc};
