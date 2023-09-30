const fs = require('fs');
const https = require('https');
const { 
fbdl1,
fbdl2
} = require('vihangayt-fbdl')

class yts {
  #getText;
  #sendMessage;
  #sendmsg;
  #prefix;

  constructor(config = {}) {
    this.#prefix = config.prefix || ".yts";
  }

  init(socket, getText, sendMessage, sendmsg) {
    this.#getText = getText;
    this.#sendMessage = sendMessage;
    this.#sendmsg = sendmsg;
  }

  async process(key, message) {
    const text = this.#getText(key, message);
  
    if (!text.toLowerCase().startsWith(this.#prefix)) return;
  
    const query = text.slice(this.#prefix.length).trim();
    const searchResults = await this.fb(query);

    if (searchResults.length > 0) {
      const resultMessage = this.formatSearchResults(searchResults);
      this.sendMessage(key, message, resultMessage);
    } else {
      console.log('No videos found.');
    }
  }
  
  async fb(query) {
 
let res = await fbdl1(url)
console.log(res)
   
  }
  


  sendMessage(key, message, resultMessage) {
    this.#sendMessage(
      key.remoteJid,
      { body: resultMessage },
      { quoted: { key, message } }
    );
  }
}

module.exports = yts;
