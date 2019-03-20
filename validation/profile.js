const validator = require("validator");
const isEmpty = require("../validation/isvalid");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "handle must be  between 2 and 4 character";
  }
  if (validator.isEmpty(data.handle)) {
    errors.handle = "please enter the handle field";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "please enter the status field";
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = "please enter the valid skills";
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a website";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not a website";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not a website";
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not a website";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not a website";
    }
  }

  if (!isEmpty(data.linkdin)) {
    if (!validator.isURL(data.linkdin)) {
      errors.linkdin = "Not a website";
    }
  }

  return {
    errors,
    isvalid: isEmpty(errors)
  };
};
