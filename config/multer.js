// config/multer.js
import multer from 'multer';

// Set up storage configuration for multer
const storage = multer.memoryStorage(); // Store file in memory

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Define allowed file types
    const isValid = allowedTypes.test(file.mimetype); // Check if the file type is valid
    if (isValid) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.')); // Reject the file
    }
};

// Create multer instance with limits and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB
    fileFilter: fileFilter, // Use the file filter
});

// Export multer upload instance
export default upload;
