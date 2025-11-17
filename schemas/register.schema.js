import Joi from "joi";


export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  firstname: Joi.string().min(2).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).required(),
  password: Joi.string().pattern(/^[\p{L}\p{N}!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]{8,30}$/u).required(),
  avatar: Joi.string().allow('').optional(),
  age: Joi.number().integer().min(0).max(120).optional()
}).unknown(); 
