const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  password: String,
  age: Number,
  phone: String,
  registerNum: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
