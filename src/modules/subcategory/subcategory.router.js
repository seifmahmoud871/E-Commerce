import { Router } from "express";
import {fileUpload, fileValidation} from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as subCategoryController from "./controller/subcategory.js"
import * as validators from "./subcategory.validation.js"
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./subcategory.endPoint.js";
const router = Router({mergeParams:true});


router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single("image"),validation(validators.createSubCategory),asyncHandler(subCategoryController.createSubCategory));
router.put('/:subcategoryId',auth(endPoint.update),fileUpload(fileValidation.image).single("image"),validation(validators.updateSubCategory),asyncHandler(subCategoryController.updateSubCategory));
router.get('/',subCategoryController.getSubCategories);

export default router;