import { Router } from "express";
import * as userController from "./controller/user.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import * as validators from "./user.validation.js"
import { validation } from "../../middleware/validation.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"User Module"})
})




export default router