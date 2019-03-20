const validator = require("validator");
const isEmpty = require("../validation/isvalid");

module.exports = function validationForExperience(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }
  if (validator.isEmpty(data.company)) {
    errors.company = "company field is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "from field is required";
  }

  return {
    errors,
    isvalid: isEmpty(errors)
  };
};
