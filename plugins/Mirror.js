const fs = require('fs');
const https = require('https');
const ytdl = require('ytdl-core');

class Mirror {
  #getText;
  #sendMessage;
  #sendmsg;
  #prefix;

  constructor(config = {}) {
    this.#prefix = config.prefix || ".up";
  }

  init(socket, getText, sendMessage, sendmsg) {
    this.#getText = getText;
    this.#sendMessage = sendMessage;
    this.#sendmsg = sendmsg;
  }


  async process(key, message) {
    const text = this.#getText(key, message);

    if (!text.toLowerCase().startsWith(this.#prefix)) return;

    const url = text.slice(this.#prefix.length).trim();
    const filename = await this.getVideoName(url);

    if (!filename) {
      console.log('Invalid URL or error getting video name.');

      this.#sendMessage(
        key.remoteJid,
        { body: 'Invalid URL or error getting video name.' },
        { quoted: { key, message } }
      );

      return;
    }

    try {
      const destination = `./${filename}`;

      await this.downloadVideo(url, destination, filename, key, message);

      const videoSize = fs.statSync(destination).size;
      const maxSizeInBytes = 150 * 1024 * 1024; // 150MB

      if (videoSize === 0) {
        console.log('Error downloading the video. Please check the URL.');

        this.#sendMessage(
          key.remoteJid,
          { body: 'Error downloading the video. Please check the URL.' },
          { quoted: { key, message } }
        );

        fs.unlinkSync(destination);
        return;
      }

      if (videoSize > maxSizeInBytes) {
        console.log('Video size exceeds the maximum allowed limit.');

        this.#sendMessage(
          key.remoteJid,
          { body: 'Video size exceeds the maximum allowed limit.' },
          { quoted: { key, message } }
        );

        fs.unlinkSync(destination);
        return;
      }

      const videoStream = fs.createReadStream(destination);

      this.#sendmsg(
        key.remoteJid,
        {
          document: videoStream,
          caption: filename,
        },
        url,  // Pass the original URL here
        { quoted: { key, message } }
      );
    } catch (error) {
      console.error('Error processing video:', error);

      this.#sendMessage(
        key.remoteJid,
        { body: 'Error processing the video.' },
        { quoted: { key, message } }
      );
    }
  }

  
  
  async downloadVideo(url, destination, filename) {
    try {
      const videoStream = ytdl(url, { filter: 'audioandvideo', format: 'mp4', quality: 'highest' });
      const writeStream = fs.createWriteStream(destination);

      return new Promise((resolve, reject) => {
        videoStream.pipe(writeStream)
          .on('finish', () => {
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    } catch (error) {
      console.error('Error downloading the video:', error);
      throw error;
    }
  }

  // ... (same as before)

  async getVideoName(url) {
    try {
      const info = await ytdl.getInfo(url);
      const videoTitle = info.videoDetails.title;
      return videoTitle;
    } catch (error) {
      console.error('Error retrieving video information:', error);
      return null;
    }
  }
}

module.exports = Mirror;