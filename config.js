// Contains the default configuration for Bot & Plugins
// Any attribute not given in the configuration will take its default value

const botConfig = {
  authFolder: "auth",
  selfReply: false,
  logMessages: true,
};

const pluginsConfig = {
  mirror: {
    prefix: ".u",
  },
  yts: {
    prefix: ".ys",
  }
};

module.exports = { botConfig, pluginsConfig };
