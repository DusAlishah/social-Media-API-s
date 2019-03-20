const validator = require("validator");
const isEmpty = require("../validation/isvalid");

module.exports = function validateRegistorInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "name must be  between 2 and 30";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "please enter the name field";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "please enter the name field";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "please enter the valid email";
  }
  if (validator.equals(data.password, data.password2)) {
    errors.password2 = "password must match";
  }
  return {
    errors,
    isvalid: isEmpty(errors)
  };
};
