import categoryModel from "../../../../DB/model/Category.model.js"
import subcategoryModel from "../../../../DB/model/Subcategories.js"
import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js"
import slugify from "slugify";
import { nanoid } from "nanoid";
import productModel from "../../../../DB/model/Product.model.js";

export const createProduct = async (req, res, next) => {

    const { name, categoryId, subcategoryId, brandId, price, discount } = req.body;
    console.log({ name, categoryId, subcategoryId, brandId, price, discount });
    if (!await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
        return next(new Error("In-valide category or subcategory Id", { cause: 400 }));
    }
    if (!await brandModel.findById(brandId)) {
        return next(new Error("Brand Not Found", { cause: 400 }));
    }

    req.body.slug = slugify(name, "_");

    req.body.finalPrice = Number.parseFloat(price - (price * ((discount || 0) / 100))).toFixed(2);
    req.body.customId = nanoid();
    console.log(req.body.customId);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}` });

    req.body.mainImage = { secure_url, public_id };
    console.log(req.files.subImages);
    if (req.files.subImages) {
        req.body.subImages = [];
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` });
            req.body.subImages.push({ secure_url, public_id });
        }
    }

    req.body.createdBy = req.user._id;
    const product = await productModel.create(req.body);

    if (!product) {
        return next(new Error("Fail to create this product", { cause: 400 }));
    }

    return res.status(201).json({ message: "Done", product })
}

export  const updateProduct =async (req,res,next)=>{

    const {productId}=req.params;
    const { name, categoryId, subcategoryId, brandId, price, discount } = req.body;
    const product = await productModel.findById(productId);

    if(!product){
        return next(new Error("Product Not Found",{cause:400}));
    }

    if(categoryId&& subcategoryId){
        if (!await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
            return next(new Error("In-valide category or subcategory Id", { cause: 400 }));
        }
    }

    if(brandId){
        if (!await brandModel.findById(brandId)) {
            return next(new Error("Brand Not Found", { cause: 400 }));
        }
    }
    
    if(name){
        product.name = name; 
        product.slug=slugify(name,"_");
    }
    
    if(price&&discount){
        product.price=price;
        product.discount=discount;
        product.finalPrice= Number.parseFloat(price-(price*(discount||0)/100)).toFixed(2);
    }else if(price){
        product.price=price;
        product.finalPrice= Number.parseFloat(price-(price*(product.discount)/100)).toFixed(2);
    }else if(discount){
        product.discount=discount;
        product.finalPrice= Number.parseFloat(product.price-(product.price*(discount)/100)).toFixed(2);
    }
    
    if(req.files?.mainImage?.length){
        const {secure_url,public_id} = cloudinary.uploader.upload(req.file.mainImage[0],{ folder: `${process.env.APP_NAME}/product/${product.customId}/subImages` }) 
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        product.mainImage={secure_url,public_id};

    }

   
    if (req.files?.subImages?.length) {
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${product.customId}/subImages` });
            // await cloudinary.uploader.destroy(product..public_id)
            req.body.subImages.push({ secure_url, public_id });
        }
    }

    product.updatedBy=req.user._id;
    await product.save();

    return res.status(201).json({ message: "Done", product })


}


export const getProduct=async(req,res,next)=>{

    const products=await productModel.find({});

    return res.json({message:"Done",products});
}