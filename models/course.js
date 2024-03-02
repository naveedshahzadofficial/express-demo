const mongoose = require("mongoose");
const Joi = require("joi");

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

function validateObjectId(objectId) {
  const schema = Joi.object({
    id: Joi.objectId().required(),
  });
  return schema.validate({ id: objectId });
}

exports.Course = Course;
exports.validate = validateCourse;
exports.validateObjectId = validateObjectId;
