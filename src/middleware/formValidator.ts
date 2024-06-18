// import { body } from "express-validator";

const { body } = require("express-validator");
export const loginValidator = [
  body("email", "Invalid does not Empty").not().isEmpty(),
  body("email", "Invalid email").isEmail(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
];

export const registerValidator = [
  body("username", "Invalid! Field must not by Empty").not().isEmpty(),
  body("email", "Invalid ! Email must not be Empty").not().isEmpty(),
  body("email", "Invalid email").isEmail(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
  body("firstName", "Invalid! Field must not by Empty").not().isEmpty(),
  body("lastName", "Invalid! Field must not by Empty").not().isEmpty(),
];

export const postValidator = [
  body("postCaption", "Invalid ! Caption required").not().isEmpty(),
  body("postDesc", "Maximum characters exceeded").isLength({
    max: 50,
  }),
];
