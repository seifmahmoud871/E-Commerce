import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';


export const signupSchema=joi.object({
        userName:joi.string().alphanum().min(2).max(25).required(),
        email:generalFields.email,
        password:generalFields.password,
        cPassword:generalFields.cPassword.valid(joi.ref('password')).required(),
        flag:joi.boolean(),
    }).required();

export const loginSchema=joi.object({
    email:generalFields.email,
    password:generalFields.password,    
}).required();


export const sendCode=joi.object({
    email:generalFields.email.required(),
}).required();

export const forgetPassword=joi.object({

    email:generalFields.email,
    newPassword:generalFields.password,
    ConfirmPassword:generalFields.cPassword.valid(joi.ref('newPassword')).required(),
    code:joi.string().min(5).max(5).pattern(new RegExp(/^[0-9]{5}$/)).required()

}).required();