import mongoose, { Schema, Types, model } from "mongoose";

const subcategorySchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
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
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    customId:{
        type:String,
        required:true
    }
}, {
    timestamps: true
});



const subcategoryModel = mongoose.models.Subcategory|| model('Subcategory', subcategorySchema);

export default subcategoryModel;