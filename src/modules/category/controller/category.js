import cloudinary from "../../../utils/cloudinary.js"
import categoryModel from "../../../../DB/model/Category.model.js"
import slugify from "slugify";


export const createCategory=async(req,res,next)=>{

     
    const name= req.body.name.toLowerCase();
    console.log({name});
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`});
    console.log({name,secure_url,public_id});
    const category = await categoryModel.create({name:name,
        image:{secure_url,public_id},slug:slugify(name,"_"),createdBy:req.user._id});

    return res.status(201).json({message:"Done",category});
    
}

export const updateCategory =async (req,res,next)=>{

   
        const category=await categoryModel.findById(req.params.categoryId);
        if(!category){
            
            return next(new Error({message:"In-valid categoryId",cause:400}));
        }
       
        if(req.body.name){
            req.body.name=req.body.name.toLowerCase();
            if(category.name==req.body.name){
                return next(new Error({message:"Sorry can not update category with same name",cause:400}));
            }
            if(await categoryModel.findOne({name:req.body.name})){
                return next(new Error({ message: `Duplicate category ${req.body.name}`, cause: 409 }));
            }
            category.name=req.body.name;
            category.slug= slugify(req.body.name,'_');
        }
        console.log({category});
        if(req.file){
 
            console.log(req.file);
            const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`});
            console.log({secure_url,public_id});
            await cloudinary.uploader.destroy(category.image.public_id);
            category.image={secure_url,public_id};
            console.log("bye");
        }
        category.createdBy=req.user._id;
        console.log({category});
       await category.save();
    
       return res.status(200).json({message:"Done",category})
  
}

export const getCategories=async(req,res,next)=>{
    const category=await categoryModel.find({}).populate([
        {
            path:"subcategory"
        }
    ]);

    return res.json({message:"Done",category});
}