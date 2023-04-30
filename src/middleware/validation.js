import joi from 'joi'
import { Types } from 'mongoose'
const dataMethods = ["body", 'params', 'query', 'headers', 'file']

const validateObjectId = (value, helper) => {
    console.log({ value });
    console.log(helper);
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId')
}
export const generalFields = {

    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().required(),
    id: joi.string().custom(validateObjectId).required(),
    optionalId: joi.string().custom(validateObjectId),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()

    })
}

export const validation = (schema) => {

    return (req, res, next) => {

        console.log({schema});
        const inputs = { ...req.body, ...req.params, ...req.query };

        // if (req.headers.authorization) {
        //     inputs.authorization = req.headers.authorization;
        // }

        if (req.file || req.files) {
            inputs.file = req.file || req.files;
        }
        console.log({inputs});
        // console.log(schema.validate(inputs));
        const validationResult = schema.validate(inputs, { abortEarly: false });
        console.log("error: " ,validationResult.error);
        if (validationResult.error) {
            return res.status(400).json({
                message: "Validation Error",
                validationResult: validationResult.error.details,
            })
        }
        return next();
    }
}