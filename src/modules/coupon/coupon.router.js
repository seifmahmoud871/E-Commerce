import { Router } from "express";
import {fileUpload, fileValidation} from "../../utils/multer.js";
import * as couponController from "./controller/coupon.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./coupon.validation.js";
const router = Router()

router.post('/',fileUpload(fileValidation.image).single("image"),validation(validators.createCoupon),asyncHandler(couponController.createCoupon));
router.put('/:couponId',fileUpload(fileValidation.image).single("image"),validation(validators.updateCoupon),asyncHandler(couponController.updateCoupon));
router.get('/',couponController.getCoupons);

export default router