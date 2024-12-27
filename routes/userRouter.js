import express from 'express';
import { getMenuItems, getRoommates, getUserByEmail, Outlets, registerUser } from '../controllers/userController.js';
import upload from '../config/multer.js'; // Import multer config

const router = express.Router();

router.get('/get-user-by-email/:email', getUserByEmail);

// Route for user registration with file upload
router.post('/register', upload.single('profilePicture'), registerUser);

router.get('/roomies', getRoommates);

router.get('/menu', getMenuItems);

router.get('/outlets', Outlets);

export default router;