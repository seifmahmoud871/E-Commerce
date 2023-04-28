import cloudinary from "../../../utils/cloudinary.js"
import couponModel from "../../../../DB/model/Coupon.model.js"
import slugify from "slugify";


export const createCoupon = async (req, res, next) => {

    const { name, amount } = req.body;
    console.log({name,amount});
    if (await couponModel.findOne({ name })) {
        return next(new Error("Duplicate Coupon name", { coase: 409 }));
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` });
        req.image = { secure_url, public_id };
    }

    const coupon = await couponModel.create({
        name: name,
        image: req.image, amount
    });

    return res.status(201).json({ message: "Done", coupon });

}

export const updateCoupon = async (req, res, next) => {

    const{name,amount}=req.body;
    const coupon = await couponModel.findById(req.params.couponId);
    if (!coupon) {
        return next(new Error({ message: "In-valid couponId", cause: 400 }));
    }

    if (name) {
        if (await couponModel.findOne({ name })) {
            return next(new Error("Duplicate Coupon name", { coase: 409 }));
        }
        else{
            coupon.name=name;
        }
    }
    console.log({ coupon });
    if (req.file) {

        console.log(req.file);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` });
        console.log({ secure_url, public_id });
        if(coupon.image?.public_id){
            await cloudinary.uploader.destroy(coupon.image.public_id);
        }
        coupon.image = { secure_url, public_id };
        console.log("bye");
    }

    if(amount){
        coupon.amount=amount;
    }
    console.log({ coupon });
    await coupon.save();

    return res.status(200).json({ message: "Done", coupon })

}

export const getCoupons = async (req, res, next) => {
    const coupon = await couponModel.find({});

    return res.json({ message: "Done", coupon });
}