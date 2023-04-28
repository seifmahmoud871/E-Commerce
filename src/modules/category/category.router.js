import { Router } from "express";
import {fileUpload, fileValidation} from "../../utils/multer.js";
import * as categoryController from "./controller/category.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./category.validation.js";
import subcategoryRouter from "../subcategory/subcategory.router.js"
import {auth} from "../../middleware/auth.js";
const router = Router()


router.use('/:categoryId/subcategory',subcategoryRouter)

router.post('/',asyncHandler(auth()),fileUpload(fileValidation.image).single("image"),validation(validators.createCategory),asyncHandler(categoryController.createCategory));
router.put('/:subcategoryId',asyncHandler(auth()),fileUpload(fileValidation.image).single("image"),validation(validators.updateCategory),asyncHandler(categoryController.updateCategory));
router.get('/',categoryController.getCategories);

export default router