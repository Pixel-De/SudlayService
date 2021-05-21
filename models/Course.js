const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: String,
  info: String,
  price: Number,
  icon: String,
  background: String,
  topics: [
    {
      type: String,
    },
  ],
  link: String,
});

const Course = mongoose.model("course", CourseSchema);

module.exports = Course;
