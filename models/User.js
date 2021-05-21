const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  password: String,
  age: Number,
  phone: String,
  registerNum: String,
  points: Number,
  course: [
    {
      type: Schema.Types.ObjectId,
      ref: "course",
    },
  ],
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
