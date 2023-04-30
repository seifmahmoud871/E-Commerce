import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

 

export const createOrder=joi.object({

    note:joi.string().min(1),
    address:joi.string().min(1).required(),
    phone:joi.array().items(joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)).required()).min(1).max(3).required(),
    couponName:joi.string(),
    paymentType:joi.string().valid("cash","card"),
    product:joi.array().items(joi.object({
        productId:generalFields.id,
        quantity:joi.number().integer().min(1).required()
    }).required()).min(1)


}).required();