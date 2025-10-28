import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }), //tlds = extension du nom de domaine (.fr, .com)
  password: Joi.string().required()
});

