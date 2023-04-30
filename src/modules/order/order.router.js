import { Router } from "express";
import * as orderController from "./controller/order.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import {auth} from "../../middleware/auth.js";
import {endPoint} from "./order.endPoint.js"
import { validation } from "../../middleware/validation.js";
import * as validators from "./order.validation.js"
const router = Router();





router.post('/',auth(endPoint.create),validation(validators.createOrder),asyncHandler(orderController.createOrder));




export default router