const express = require("express");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup");
const mongoose = require("mongoose");
const logger = require("./middleware/logger");
const home = require("./routes/home");
const courses = require("./routes/courses");
const { bool } = require("joi");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(logger);
app.use("/", home);
app.use("/api/courses", courses);

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
//console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan is enabled...");
}

mongoose
  .connect("mongodb://localhost/university")
  .then(() => debug("Connected to MongoDB..."))
  .catch((err) => debug("Error connecting to MongoDB...", err));

async function createCourse() {
  const course = new Course({
    name: "Angular Course",
    author: "Naveed",
    tags: ["angular", "typescript"],
    isPublished: true,
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}
//createCourse();

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course
    //.find({ price: { $gt: 10, $lte: 20}})
    //.find({ price: { $in: [10,20,50]}})
    //.find({ author: /^Mosh/})
    //.find({ author: /Mosh$/i})
    //.find({ author: /.*Mosh.*/i})
    //.or([{ auth: 'Mosh'},{isPublished: true}])
    //.skip((pageNumber - 1) * pageSize)
    //.limit(pageSize)
    .find({
      author: "Naveed",
      isPublished: true,
    })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

app.listen(port, () => console.log("Listening on port " + port));
