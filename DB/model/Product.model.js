import mongoose, { Schema, Types, model } from "mongoose";

const productSchema = new Schema({

    customId:String,
    name: {
        type: String,
        required: true,
        trim:true,
        lowercase:true
    },
    slug: {
        type: String,
        required: true,
        trim:true,
        lowercase:true
    },
    description:{
        type: String,
    },
    stock:{
        type:Number,
        default:1,
        required: true,
    },
    price:{
        type:Number,
        default:1,
        required: true,
    },
    descount:{
        type:Number,
        default:0,
    },
    finalPrice:{
        type:Number,
        default:1,
        required: true,
    },
    colors:[{
        type:String,
    }],
    size:{
        type:[String],
        enum:['s','m','l','xl']
    },
    mainImage: {
        type: Object,
        required: true
    },
    subImages: {
        type: [Object],
        required: true
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:true,
    },
    subcategoryId:{
        type:Types.ObjectId,
        ref:'Subcategory',
        required:true,
    },
    brandId :{
        type:Types.ObjectId,
        ref:'Brand',
        required:true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: false,
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: false,
    },
    userWishList:[{
        type: Types.ObjectId,
        ref: 'User',
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
});



const productModel = mongoose.models.Product || model('Product', productSchema);

export default productModel;