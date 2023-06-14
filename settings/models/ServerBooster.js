const mongoose = require("mongoose");
// Skema untuk pengguna booster
const boosterSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  userUsername: {
    type: String,
    required: true,
  },
  boostCount: {
    type: Number,
    required: false,
    default: 0,
  },
  boostLimit: {
    type: Number,
    required: false,
    default: 0,
  },
});

// Model untuk pengguna booster
module.exports = mongoose.model("Booster", boosterSchema);
