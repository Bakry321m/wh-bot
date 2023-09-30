// Contains the default configuration for Bot & Plugins
// Any attribute not given in the configuration will take its default value

const botConfig = {
  authFolder: "auth",
  selfReply: false,
  logMessages: true,
};

const pluginsConfig = {
  mirror: {
    prefix: ".up",
  },
  yts: {
    prefix: ".yts",
  }
};

module.exports = { botConfig, pluginsConfig };
