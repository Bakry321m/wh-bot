const Bot = require("./Bot");
const Mirror = require("./plugins/Mirror");
const yts = require("./plugins/yts");
const { botConfig, pluginsConfig } = require("./config");

const http = require('http');

const PORT = 3000;

const requestHandler = (request, response) => {
  response.end('Replit is still running');
};

const server = http.createServer(requestHandler);

server.listen(PORT, (err) => {
  if (err) {
    return console.error('Error starting server:', err);
  }

  console.log('Server is running on port', PORT);
});

const plugins = [
  new Mirror(pluginsConfig.mirror),
  new yts(pluginsConfig.yts),
];

const bot = new Bot(plugins, botConfig);

(async () => {
  await bot.connect();
  await bot.run();
})();