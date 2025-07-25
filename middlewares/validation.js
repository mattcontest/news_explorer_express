const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
      "string.email": 'The "email" fied must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "The minumum length of the 'name' field is 2 ",
      "string.max": "The maximum length of the 'name' field is 30 ",
      "string.empty": "The 'name' must be filled ",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' must be filled in ",
      "string.email": "The 'email' field must be valid ",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The 'password' must be filled in ",
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required().messages({
      "string.empty": "The 'source' must be filled in",
    }),
    link: Joi.string().required().custom(validateUrl).messages({
      "string.empty": "The 'link' field must be filled in",
      "string.uri": "The 'link' must be a valid URL",
    }),
    image: Joi.string().required().custom(validateUrl).messages({
      "string.empty": "The 'image' field must be filled in",
      "string.uri": "The 'image' must be a valid URL",
    }),
    text: Joi.string().required().messages({
      "string.empty": "The 'text' field must be filled in",
    }),

    owner: Joi.string().messages({
      "string.empty": "The 'owner' field must be filled in",
    }),
  }),
});

const validateArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().required().length(24),
  }),
});

module.exports = {
  validateAuthentication,
  validateUserBody,
  validateLogin,
  validateArticle,
  validateArticleId,
};
