import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const createCoupon=joi.object({
    name:joi.string().min(2).max(50).required(),
    file:generalFields.file,
    amount:joi.number().positive().min(1).max(100).required()
}).required()


export const updateCoupon=joi.object({
    couponId:generalFields.id,
    name:joi.string().min(2).max(50),
    file:generalFields.file,
    amount:joi.number().positive().min(1).max(100),
}).required()