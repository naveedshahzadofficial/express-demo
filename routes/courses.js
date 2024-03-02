const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Course, validate } = require("../models/course");

router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
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
  const { error } = validate(req.body);
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

module.exports = router;
