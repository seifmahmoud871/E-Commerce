import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const createSubCategory=joi.object({
    name:joi.string().min(2).max(50).required(),
    file:generalFields.file.required(),
    categoryId:generalFields.id,
}).required()


export const updateSubCategory=joi.object({
    name:joi.string().min(2).max(50),
    file:generalFields.file,
    categoryId:generalFields.id, 
    subcategoryId:generalFields.id
}).required()