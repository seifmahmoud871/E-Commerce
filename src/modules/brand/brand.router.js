import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as brandController from "./controller/brand.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./brand.validation.js";
const router = Router()


router.post('/', fileUpload(fileValidation.image).single("image"), validation(validators.createBrand), asyncHandler(brandController.createBrand));
router.put('/:brandId', fileUpload(fileValidation.image).single("image"), validation(validators.updateBrand), asyncHandler(brandController.updateBrand));
router.get('/', brandController.getCategories);

export default router