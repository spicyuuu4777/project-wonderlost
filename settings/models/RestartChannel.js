const mongoose = require("mongoose");

const restartChannelSchema = mongoose.Schema({
  channelId: {
    type: String,
    required: true,
    unique: true,
  },
});

const RestartChannel = mongoose.model("RestartChannel", restartChannelSchema);

module.exports = RestartChannel;
