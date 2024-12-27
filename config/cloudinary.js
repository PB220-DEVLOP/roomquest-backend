// config/cloudinary.js
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables from .env file
dotenv.config({ path: './config/config.env' }); // Update path if .env is not in config

// Debug environment variables
console.log('Loaded Environment Variables:', {
    CLOUDINARY_CLOUD: process.env.CLOUDINARY_CLOUD,
    CLOUDINARY_API: process.env.CLOUDINARY_API,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
});

// Check for required environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD', 'CLOUDINARY_API', 'CLOUDINARY_SECRET'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Error: Environment variable ${varName} is not defined.`);
        process.exit(1); // Exit the process if a required variable is missing
    }
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// Function to upload image to Cloudinary
const uploadImage = async (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folder, // Specify the folder for the upload
                resource_type: 'auto' // Automatically detect the resource type (image, video, etc.)
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result); // Resolve with the result from Cloudinary
            }
        ).end(fileBuffer); // End the stream with the file buffer
    });
};

// Export uploadImage function
export { uploadImage };
