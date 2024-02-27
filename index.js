const express = require("express");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup");
const logger = require("./middleware/logger");
const home = require("./routes/home");
const courses = require("./routes/courses");
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

app.listen(port, () => console.log("Listening on port " + port));
