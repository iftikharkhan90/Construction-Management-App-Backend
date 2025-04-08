import joi from "joi";

export const signUpValidationSchema = joi.object({
        name: joi.string().required().label("Name"),
        email: joi.string().required().email().label("Email"),
        password: joi.string()
            .min(8)
            .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/) 
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one letter and one number.',
            }),
        })

export  const loginValidationSchema = joi.object({
    email: joi.string().required().email().message('Email is incorrext').label("Email"),
        password: joi.string()
            .min(8)
            .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/) 
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one letter and one number.',
            }),    
        })