const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const router = express.Router();

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 255 },
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
      type: Number,
      required: function () {
        return this.isPublished;
      },
    },
  })
);

router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});

router.post("/", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let course = new Course({
    name: req.body.name,
    author: req.body.author,
    tags: req.body.tags,
    isPublished: req.body.isPublished,
    price: req.body.price,
  });
  try {
    course = await course.save();
    res.send(course);
  } catch (ex) {
    return res.status(501).send(ex.message);
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send(`Course id is invalid:  ${req.params.id}`);
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).send(`Course not found for id ${req.params.id}`);
  res.send(course);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send(`Course id is invalid:  ${req.params.id}`);
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      author: req.body.author,
      tags: req.body.tags,
      isPublished: req.body.isPublished,
      price: req.body.price,
    },
    { new: true }
  );
  if (!course)
    return res.status(404).send(`Course not found for id ${req.params.id}`);
  res.send(course);
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send(`Course id is invalid:  ${req.params.id}`);

  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course)
    return res.status(404).send(`Course not found for id ${req.params.id}`);
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    author: Joi.string(),
    tags: Joi.array(),
    isPublished: Joi.boolean(),
    price: Joi.number(),
  });
  return schema.validate(course);
}

module.exports = router;
