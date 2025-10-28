import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  firstname: Joi.string().trim().min(2).required(),
  age: Joi.number().integer().min(0).max(120),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  avatar: Joi.string().uri().optional(), // "uri" vérifie que l'URL est valide 
});
