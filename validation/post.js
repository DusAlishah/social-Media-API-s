const validator = require("validator");
const isEmpty = require(".././validation/isvalid");

module.exports = function validationForPost(data) {
  const errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "the length should be greater and smaller than 10 to 300";
  }

  if (validator.isEmpty(data.text)) {
    errors.Emptytext = "Enter the comment  in the provided field";
  }

  return {
    errors,
    isvalid: isEmpty(errors)
  };
};
