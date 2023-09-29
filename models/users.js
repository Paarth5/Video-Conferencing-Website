const mongoose = require("mongoose");
const passport = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
  },
});
userSchema.plugin(passport);

module.exports = mongoose.model("Users", userSchema);
