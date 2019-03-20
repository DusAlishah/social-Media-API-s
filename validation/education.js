const validator = require("validator");
const isEmpty = require("../validation/isvalid");

module.exports = function validationForExperience(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.field = !isEmpty(data.field) ? data.field : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "school field is required";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "degree field is required";
  }

  if (validator.isEmpty(data.field)) {
    errors.field = "field field is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "from field is required";
  }

  return {
    errors,
    isvalid: isEmpty(errors)
  };
};
