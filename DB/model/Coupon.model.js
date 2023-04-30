import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique:true,
        trim:true,
        lowercase:true
    },
    image: {
        type: Object,
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
    usedBy: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    amount:{
        type:Number,
        default:1,
        required:true
    },
    expiredDate:{
        type:Date,
        required:true
    }
}, {
    timestamps: true,
});




const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema);

export default couponModel;