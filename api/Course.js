const express = require("express");
const { db } = require("../models/Course");
const router = express.Router();

// mongodb user model
const Course = require("../models/Course");

const checkFields = (fields) => (fields.indexOf("") === -1 ? true : false);

//create

router.post("/create", (req, res) => {
  let { title, info, price, icon, background, topics, link } = req.body;

  if (checkFields([title, info, icon, background, link])) {
    const newCourse = new Course({
      title,
      info,
      price,
      icon,
      background,
      topics,
      link,
    });

    newCourse
      .save()
      .then(() => {
        res.json({
          status: "SUCCESS",
          message: "Амжилтай хадгалагдлаа!",
        });
      })
      .catch((err) => {
        res.status(450).json({
          status: "FAILED",
          message: "Уучлаарай хадгалах явцад алдаа гарлаа!",
        });
      });
  } else {
    res.status(451).json({
      status: "FAILED",
      message: "Уучлаарай бүх талбараа бөглөнө үү!",
    });
  }
});

//course list

router.get("/list", (req, res) => {
  let lists = db.collection("courses");

  res.json({
    status: "SUCCESS",
    list: lists.toArray(),
  });
});

module.exports = router;
