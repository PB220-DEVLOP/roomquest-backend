import express from 'express';
import upload from '../config/multer.js';
import { addMenu, addMess, getMenuItems, getMessById, messOutlets } from '../controllers/messController.js';

const router = express.Router();

router.post('/add-mess', upload.single('image'), addMess); // Ensure the name matches the form input
router.get('/mess-outlet/:id', getMessById);
router.get('/mess-outlets', messOutlets);
router.post('/add-menu', upload.single('image'), addMenu); // Use multer to handle image uploads
router.get('/menu', getMenuItems);
export default router;
