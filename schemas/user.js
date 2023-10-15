const joi = require("joi");

const regSchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "Missing required email field",
  }),
  password: joi.string().required().messages({
    "any.required": "Missing required password field",
  }),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "Missing required email field",
  }),
  password: joi.string().required().messages({
    "any.required": "Missing required password field",
  }),
});

const subscriptionSchema = joi.object({
  subscription: joi
    .string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.only": "Invalid subscription value",
      "any.required": "Subscription is required",
    }),
});

module.exports = {
  regSchema,
  loginSchema,
  subscriptionSchema,
};
