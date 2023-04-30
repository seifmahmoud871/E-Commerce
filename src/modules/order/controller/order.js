import cartModel from "../../../../DB/model/Cart.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";



export const createOrder = async (req, res, next) => {

    const { products, address, phone, couponName, note, paymentType } = req.body;

    if (!req.body.products) {
        const cart = await cartModel.findOne({ userId: req.user._id });

        if (!cart?.products?.length) {
            return next(new Error("Empty cart ", { cause: 404 }));
        }
        req.body.isCart = true
        req.body.products = cart.products;
    }



    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } });
        // getTime() =======> get time by ms
        if (!coupon || coupon.isDeleted || coupon.expiredDate.getTime() < Date.now()) {
            return next(new Error("Invalid or expired Coupon ", { cause: 404 }));
        }

        req.body.coupon = coupon;
    }

    const productIds = [];
    const finalProductList = [];
    let subtotal = 0;
    for (const product of products) {
        const checkedProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })

        if (!checkedProduct) {
            return next(new Error(`Invalid Product ${product?.productId}`, { cause: 404 }));
        }

        if (req.body.isCart) {
            product = product.toObject();
        }
        product.name = checkedProduct.name;
        product.unitPrice = checkedProduct.finalPrice;
        product.finalPrice = product.quantity * checkedProduct.finalPrice.toFixed(2);
        finalProductList.push(product);
        productIds.push(product.productId)
        subtotal += product.finalPrice

    }

    // const dummyOrder = {

    //     userId: req.user._id,
    //     address,
    //     phone,
    //     note,
    //     products: finalProductList,
    //     couponId: req.body.coupon?._id,
    //     subtotal,
    //     finalPrice: subtotal - (subtotal * ((req.body.coupon.amount || 0) / 100)).toFixed(2),
    //     paymentType,
    //     status:paymentType?"waitPayment":"placed"

    // }

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phone,
        note,
        products: finalProductList,
        couponId: req.body.coupon?._id,
        subtotal,
        finalPrice: subtotal - (subtotal * ((req.body.coupon.amount || 0) / 100)).toFixed(2),
        paymentType,
        status: paymentType ? "waitPayment" : "placed"

    })


    // Decrease Product stock

    for (const product of products) {

        productModel.findOneAndUpdate({ _id: product.productId }, {
            $inc: { stock: -parseInt(product.quantity) }
        })

    }

    // push user id to coupon used

    if (req.body.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })
    }

    // clear cart item
    if (req.body.isCart) {

        await cartModel.updateOne({userId:req.user._id},{products:[]})
    }
    else {
        await cartModel.updateOne({ userId: req.user._id }, {
            $pull: {
                products: {
                    productId: { $in: productIds }
                }
            }
        })
    }


    return res.status(201).json({ message: "Done", order });



}