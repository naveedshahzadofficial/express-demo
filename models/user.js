const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 255 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 3, maxLength: 1024 },
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id.toString(), name: this.name, email: this.email },
    config.get("jwtPrivateKey")
  );
};
const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3).max(255),
  });
  return schema.validate(user);
};

const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3).max(255),
  });
  return schema.validate(user);
};

const generateAuthToken = (user) => {
  return jwt.sign(
    { _id: user._id.toString(), name: user.name, email: user.email },
    config.get("jwtPrivateKey")
  );
};

exports.User = User;
exports.validate = validateUser;
exports.validateLogin = validateLogin;
