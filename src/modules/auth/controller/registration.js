import userModel from "../../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../../utils/generateAndVerifyToken.js";
import { compare, hashText } from "../../../utils/HashAndCompare.js";
import sendEmail from "../../../utils/email.js";
import { customAlphabet } from "nanoid";




export const authModule = (req, res, next) => {

    return res.json({ message: "authModule" });
}


export const signUp = async (req, res, next) => {

    const { userName, email, password } = req.body;
    console.log({ userName, email, password });
    const user = await userModel.findOne({ email });
    if (user) {
        return next(new Error("Email Exist", { cause: 404 }));
    }
    console.log("hiii");
    const token = generateToken({ payload: { email }, expiresIn: 60 * 5, signater: process.env.EMAIL_TOKEN })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    console.log("hiii2222222");
    const refreshToken = generateToken({ payload: { email }, expiresIn: 60 * 60 * 24 * 30, signater: process.env.EMAIL_TOKEN })
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    <td>
    <br>
    <br>
    <br>
    <a href="${refreshLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Send New Verification</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
    console.log("hiii33333333");
    if (! await sendEmail({ to: email, subject: "Confirm Email", html })) {
        return next(new Error("Rejected Email", { cause: 400 }))
    }
    console.log("hiii444444444");
    const hashPassword = hashText({ plaintext: password });
    console.log({ hashPassword });
    const newUser = await userModel.create({ userName, email, password: hashPassword });
    console.log("hiii5555555");
    return res.json({ message: "Done", newUser });


}



export const login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log({ email, password });

    const user = await userModel.findOne({ email });

    if (!user) {
        return next(new Error('Email not exist', { cause: 404 }));

    }
    if (!user.confirmEmail) {
        return next(new Error('Email not Confirmed', { cause: 404 }));
    }
    const match = compare({ plaintext: password, hashValue: user.password });
    if (!match) {
        return next(new Error('In-valid login data', { cause: 404 }));
    }
    const access_token = generateToken({ payload: { id: user._id, isLoggedIn: true, role: user.role }, expiresIn: 60 * 30 });
    const refresh_token = generateToken({ payload: { id: user._id, isLoggedIn: true, role: user.role }, expiresIn: 60 * 60 * 24 * 365 });
    user.status = "online";
    await user.save();
    return res.status(200).json({ message: "Done", access_token, refresh_token });
}



export const confirmEmail = async (req, res, next) => {
    console.log("hiiiiii");
    const { token } = req.params;
    const { email } = verifyToken({ signater: process.env.EMAIL_TOKEN, token: token });
    const user = await userModel.updateOne({ email: email }, { confirmEmail: true });

    return user.modifiedCount ? res.json({ message: "Done" }).status(200) : res.json.send("Not register account").status(404);

}

export const newConfirmEmail = async (req, res, next) => {
    const { token } = req.params;
    const { email } = verifyToken({ signater: process.env.EMAIL_TOKEN, token: token });
    const newToken = generateToken({ payload: { email }, expiresIn: 60 * 2, signater: process.env.EMAIL_TOKEN })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`

    const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    <td>
    <br>
    <br>
    <br>
    <a href="${refreshLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Send New Verification</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
    if (!await sendEmail({ to: email, subject: "Confirm Email", html })) {
        return next(new Error("Rejected Email", { cause: 400 }))
    }
    return res.status(200).send(`<p>Done Please check your email</p>`)
}


export const sendCode = async (req, res, next) => {


    const { email } = req.body;
    console.log({ email });
    const nanoId = customAlphabet('123456789', 5);
    const code = nanoId();
    const user = await userModel.findOneAndUpdate({ email }, { forgetCode: code }, { new: true });
    console.log({ user });
    if (!user) {
        return next(new Error("Email not reguestered", { cause: 404 }));
    }
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Forget Password</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${code}</p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`

    if (! await sendEmail({ to: email, subject: "Forget Password", html })) {
        return next(new Error("Rejected Email", { cause: 400 }))
    }

    return res.status(200).json({ message: "Done", user });

}



export const forgetPassword = async (req, res, next) => {


    const { email, code, newPassword } = req.body;

    console.log({ email, code, newPassword });

    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error("Email not reguestered", { cause: 404 }));
    }

    if (user.forgetCode != code || !code) {
        return next(new Error("In-valid Reset Code", { cause: 404 }));
    }

    user.password = hashText({ plaintext: newPassword });
    user.forgetCode = null;
    user.changePasswordTime = Date.now();
    await user.save();

    return res.status(200).json({ message: "Done" })

}