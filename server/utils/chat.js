// Store utiltiy function related to chat

var generateChat = (from, text) =>  {
  return {
    from: from,
    text: text,
    createAt: new Date().getTime()
  }
}

// Export
module.exports = {generateChat};
