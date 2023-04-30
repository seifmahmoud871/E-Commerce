import { Router } from "express";
import {fileUpload, fileValidation} from "../../utils/multer.js";
import * as couponController from "./controller/coupon.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./coupon.validation.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./coupon.endPoint.js";
const router = Router()

router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single("image"),validation(validators.createCoupon),asyncHandler(couponController.createCoupon));
router.put('/:couponId',auth(endPoint.update),fileUpload(fileValidation.image).single("image"),validation(validators.updateCoupon),asyncHandler(couponController.updateCoupon));
router.get('/',couponController.getCoupons);

export default router