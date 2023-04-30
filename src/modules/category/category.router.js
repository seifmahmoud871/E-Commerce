import { Router } from "express";
import {fileUpload, fileValidation} from "../../utils/multer.js";
import * as categoryController from "./controller/category.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./category.validation.js";
import subcategoryRouter from "../subcategory/subcategory.router.js"
import {auth,roles} from "../../middleware/auth.js";
import { endPoint } from "./category.endPoint.js";
const router = Router()


router.use('/:categoryId/subcategory',subcategoryRouter)

router.post('/',asyncHandler(auth(endPoint.create)),fileUpload(fileValidation.image).single("image"),validation(validators.createCategory),asyncHandler(categoryController.createCategory));
router.put('/:subcategoryId',asyncHandler(auth(endPoint.update)),fileUpload(fileValidation.image).single("image"),validation(validators.updateCategory),asyncHandler(categoryController.updateCategory));
router.get('/',asyncHandler(auth(Object.values(roles))),categoryController.getCategories);

export default router