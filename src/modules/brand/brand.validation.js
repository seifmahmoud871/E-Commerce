import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const createBrand=joi.object({
    name:joi.string().min(2).max(50).required(),
    file:generalFields.file.required(),
}).required()


export const updateBrand=joi.object({
    name:joi.string().min(2).max(50),
    file:generalFields.file,
    brandId:generalFields.id, 
}).required()