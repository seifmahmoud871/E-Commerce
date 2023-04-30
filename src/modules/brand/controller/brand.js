import cloudinary from "../../../utils/cloudinary.js"
import brandModel from "../../../../DB/model/Brand.model.js"
import slugify from "slugify";


export const createBrand = async (req, res, next) => {

    const name = req.body.name.toLowerCase();
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` });
    console.log({ name, secure_url, public_id });
    const brand = await brandModel.create({
        name: name,
        image: { secure_url, public_id }, slug: slugify(name, "_"),
        createdBy: req.user._id,
    });

    return res.status(201).json({ message: "Done", brand });

}

export const updateBrand = async (req, res, next) => {


    const brand = await brandModel.findById(req.params.brandId);
    if (!brand) {

        return next(new Error({ message: "In-valid brandId", cause: 400 }));
    }

    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase();
        if (category.name == req.body.name) {
            return next(new Error({ message: "Sorry can not update brand with same name", cause: 400 }));
        }
        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error({ message: `Duplicate Brand ${req.body.name}`, cause: 409 }));
        }
        brand.name = req.body.name;
        brand.slug = slugify(req.body.name, '_');
    }
    console.log({ brand });
    if (req.file) {

        console.log(req.file);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` });
        console.log({ secure_url, public_id });
        if (brand.image?.public_id) {
            await cloudinary.uploader.destroy(brand.image.public_id);
        }
        brand.image = { secure_url, public_id };
        console.log("bye");
    }

    console.log({ brand });
    brand.updatedBy = req.user._id;
    await brand.save();

    return res.status(200).json({ message: "Done", brand })

}

export const getCategories = async (req, res, next) => {
    const brand = await brandModel.find({ isDeleted: false });

    return res.json({ message: "Done", brand });
}