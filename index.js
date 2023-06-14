const MainClient = require("./Bot.js");
const client = new MainClient();

client.connect();

module.exports = client;
