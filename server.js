//mongodb setup
require("./config/db");

const app = require("express")();

const port = process.env.PORT || 8000;

const UserRouter = require("./api/User"),
  CourseRouter = require("./api/Course");

const bodyParser = require("express").json;

app.use(bodyParser());
app.use("/user", UserRouter);
app.use("/course", CourseRouter);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
