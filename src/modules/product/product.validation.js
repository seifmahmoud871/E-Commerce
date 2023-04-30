import joi from "joi";
import { generalFields } from "../../middleware/validation.js"


export const createProduct = joi.object({

    name:joi.string().min(2).max(50).required(),
    file:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).length(1),
        subImage:joi.array().items(generalFields.file).min(1).max(5),
    }),
    description:joi.string().min(2).max(150000),
    stock:joi.number().positive().integer().min(1).required(),
    price:joi.number().integer().min(1).required(),
    discount:joi.number().min(1).max(100).required(),
    categoryId:generalFields.id, 
    subcategoryId:generalFields.id, 
    brandId:generalFields.id, 
    size:joi.array(),
    colors:joi.array()

    
    

}).required();


export const updateProduct = joi.object({

    productId:generalFields.id,
    name:joi.string().min(2).max(50),
    file:joi.object({
        mainImage:joi.array().items(generalFields.file).max(1),
        subImage:joi.array().items(generalFields.file).min(1).max(5),
    }),
    description:joi.string().min(2).max(150000),
    stock:joi.number().positive().integer().min(1),
    price:joi.number().integer().min(1),
    discount:joi.number().min(1).max(100),
    categoryId:generalFields.optionalId, 
    subcategoryId:generalFields.optionalId, 
    brandId:generalFields.optionalId, 
    size:joi.array(),
    colors:joi.array()
    

}).required();