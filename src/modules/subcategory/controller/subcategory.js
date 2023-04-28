import cloudinary from "../../../utils/cloudinary.js"
import categoryModel from "../../../../DB/model/Category.model.js"
import slugify from "slugify";
import subcategoryModel from "../../../../DB/model/subcategories.js";
import { nanoid } from "nanoid";


export const createSubCategory = async (req, res, next) => {

    const { categoryId } = req.params;
    console.log({ categoryId });
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error("In-valid Category Id", { cause: 400 }));
    }

    const customId = nanoid();

    const { name } = req.body;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${categoryId}/${customId}` });
    console.log({ name, secure_url, public_id });
    const subcategory = await subcategoryModel.create({
        name: name,
        image: { secure_url, public_id }, slug: slugify(name, "_"), categoryId, customId
    });

    return res.status(201).json({ message: "Done", subcategory });

}

export const updateSubCategory = async (req, res, next) => {

    const{categoryId,subcategoryId}=req.params;
    
    const subcategory = await subcategoryModel.findOne({categoryId,_id:subcategoryId});
    if (!subcategory) {

        return next(new Error({ message: "In-valid SubcategoryId", cause: 400 }));
    }

    if (req.body.name) {
        subcategory.name = req.body.name;
        subcategory.slug = slugify(req.body.name, '_');
    }
    console.log({ subcategory });
    if (req.file) {
        console.log(req.file);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${categoryId}/${subcategory.customId}` });
        console.log({ secure_url, public_id });
        await cloudinary.uploader.destroy(subcategory.image.public_id);
        subcategory.image = { secure_url, public_id };
        console.log("bye");
    }

    console.log({ subcategory });
    await subcategory.save();

    return res.status(200).json({ message: "Done", subcategory })

}

export const getSubCategories = async (req, res, next) => {
    const subcategories = await subcategoryModel.find({});

    return res.json({ message: "Done", subcategories });
}