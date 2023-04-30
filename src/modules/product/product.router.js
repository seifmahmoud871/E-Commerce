import { Router } from "express";
// import { validation } from "../../middleware/validation.js";
import { fileValidation } from "../../utils/multer.js";
import * as productController from "./controller/product.js";
// import * as validators from "./product.validation.js"
import { endPoint } from "./product.endPoint.js";
import {asyncHandler} from "../../utils/errorHandling.js"
import {fileUpload} from "../../utils/multer.js"
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./product.validation.js"
const router = Router()




router.get('/',productController.getProduct)

router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).fields(
    [
        {name:"mainImage",maxCount:1},
        {name:"subImages",maxCount:5}
    ]
),validation(validators.createProduct),asyncHandler(productController.createProduct));

router.put('/:productId',auth(endPoint.update),fileUpload(fileValidation.image).fields(
    [
        {name:"mainImage",maxCount:1},
        {name:"subImages",maxCount:5}
    ]
),validation(validators.updateProduct),asyncHandler(productController.updateProduct));

// auth(endPoint.create),fileUpload(fileValidation.image).single("image"),validation(validators.createProduct),


export default router