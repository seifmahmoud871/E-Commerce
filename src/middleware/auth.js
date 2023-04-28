import { verifyToken } from "../utils/generateAndVerifyToken.js";
import userModel from "../../DB/model/User.model.js";
// import userModel from "../../DB/model/User.js";



export const auth=()=>{
    return async(req,res,next)=>{
        const {authorization} = req.headers;

        console.log({authorization});

        if(!authorization?.startsWith(process.env.BEARER_KEY)){
            return next(new Error("In-valid Bearer Key",{cause:400}))
        }

        const token = authorization.split(process.env.BEARER_KEY)[1];
        if(!token){
            return next(new Error("In-valid Token",{cause:400}))
        } 

        const decoded = verifyToken({token:token});

        console.log({decoded});
        if(!decoded?.id){
            return next(new Error("In-valid Token bayload",{cause:400}))
        }
        const user =await userModel.findById(decoded.id);
        if(!user){
            return next(new Error("Not Registered User",{cause:401}))
        }
        req.user=user;
        return next();
    }
   

}


// const auth = async (req, res, next) => {
//     try {
//         const { authorization } = req.headers;
       
       

//         if (!authorization?.startsWith(process.env.BEARER_KEY)) {
//             return res.json({ message: "In-valid bearer key" })
//         }
//         const token = authorization.split(process.env.BEARER_KEY)[1]
      
//         if (!token) {
//             return res.json({ message: "In-valid token" })
//         }

//         const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
//         if (!decoded?.id) {
//             return res.json({ message: "In-valid token payload" })
//         }
//         const authUser = await userModel.findById(decoded.id).select('userName email role')
//         if (!authUser) {
//             return res.json({ message: "Not register account" })
//         }
//         req.user = authUser;
//         return next()
//     } catch (error) {
//         return res.json({ message: "Catch error" , err:error?.message })
//     }
// }

