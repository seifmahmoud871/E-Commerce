import { Router } from "express";
import * as cartController from "./controller/cart.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./cart.endPoint.js";
import {asyncHandler} from "../../utils/errorHandling.js"
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Cart Module"})
})

router.post('/',auth(endPoint.create),asyncHandler(cartController.createCart))




export default router