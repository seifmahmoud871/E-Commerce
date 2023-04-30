import { verifyToken } from "../utils/generateAndVerifyToken.js";
import userModel from "../../DB/model/User.model.js";
// import userModel from "../../DB/model/User.js";

export const roles={
    Admin:"Admin",
    User:"User",
    HR:"HR"
}


export const auth=(accessRoles=[])=>{
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
        if(parseInt(user.changePasswordTime?.getTime()/1000)>decoded.iat){
            return next(new Error("Expired Token",{cause:400}))
        }

       
        if(!accessRoles.includes(user.role)){
            return next(new Error("Not Authorized User",{cause:403}))
        }

        req.user=user;
        return next();
    }
   
    

}

