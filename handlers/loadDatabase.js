const { white, green } = require("chalk");

module.exports = (client) => {
  require("./Database/loadDatabase.js")(client);
  console.log(
    white("[") +
      green("INFO") +
      white("] ") +
      green("Database ") +
      white("Events") +
      green(" Loaded!")
  );
};
