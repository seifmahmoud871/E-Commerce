import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as brandController from "./controller/brand.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./brand.validation.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./brand.endPoint.js";
const router = Router()


router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single("image"), validation(validators.createBrand), asyncHandler(brandController.createBrand));
router.put('/:brandId',auth(endPoint.update),fileUpload(fileValidation.image).single("image"), validation(validators.updateBrand), asyncHandler(brandController.updateBrand));
router.get('/', brandController.getCategories);

export default router