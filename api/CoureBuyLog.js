const express = require("express");
const { db } = require("../models/Course");
const router = express.Router();

// mongodb user model
const Course = require("../models/CourseBuy");

const checkFields = (fields) => (fields.indexOf("") === -1 ? true : false);

//course худалдаж авах хэсэг

router.post("/buy", (req, res) => {
  res.json({
    status: "SUCCESS",
    message: "Амжилттай нэмэгдлээ",
  });
});

//course buy list

router.get("/list", (req, res) => {
  let lists = db.collection("courses");

  res.json({
    status: "SUCCESS",
    list: lists.toArray(),
  });
});

module.exports = router;
