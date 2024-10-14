var config = {};

// Host and port of local server. Leave as default unless you have a port conflict.
config.hostname = "127.0.0.1";
config.port = 3000;

// Controls quality of screenshots created. Valid values 1-100, with 100 taking up the most filespace.
config.screenshotQuality = 60;

// Controls how often screenshots are taken.
// A value of 1 means a screenshot is taken every chat message.
// A value of 5 means a screenshot is taken every 5 messages.
config.screenshotFrequency = 3;

module.exports = config;