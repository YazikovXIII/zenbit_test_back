const joi = require("joi");
const schema = joi.object({
  name: joi.string().required().messages({
    "any.required": "Missing required name field",
  }),
  email: joi.string().required().messages({
    "any.required": "Missing required email field",
  }),
  phone: joi.string().required().messages({
    "any.required": "Missing required phone field",
  }),
});
const patchSchema = joi.object({
  favorite: joi.boolean(),
});

module.exports = {
  schema,
  patchSchema,
};
