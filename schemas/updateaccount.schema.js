import Joi from "joi";

export const updateAccountSchema = Joi.object({
  name: Joi.string().trim().min(2).optional(),
  firstname: Joi.string().trim().min(2).optional(),
  age: Joi.number().integer().min(0).max(120).optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).optional(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).optional(),
  avatar: Joi.string().optional(),
});
