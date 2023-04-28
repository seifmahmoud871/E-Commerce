import * as dotenv from 'dotenv'
dotenv.config()
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: "dhembx6yj",
    api_key: "932773214686622",
    api_secret: "lvOtIQlgz20aJ5zVZFTlfJn9pjc",
    secure: true
})

export default cloudinary.v2;