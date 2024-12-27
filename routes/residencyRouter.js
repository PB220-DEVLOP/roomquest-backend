import express from 'express';
import { addOutlet, addRoommate, getAllRooms, getOutletById, getOutlets, registerRoom } from '../controllers/residenceController.js';
import upload from '../config/multer.js';

const router = express.Router();

// Route for adding an outlet
router.post('/add-outlet', upload.single('image'), addOutlet);
router.get('/outlet/:id', getOutletById);
router.get('/outlets', getOutlets); // Route to fetch all outlets 
router.post('/register-room', upload.array('images', 4), registerRoom);
router.get('/rooms', getAllRooms);
router.post('/add-roommate', upload.single('profilePicture'), addRoommate);

// You can add more outlet-related routes here, for example:
// router.get('/api/v1/outlets', getAllOutlets); // To get all outlets
// router.get('/api/v1/outlets/:id', getOutletById); // To get a single outlet by ID
// router.put('/api/v1/outlets/:id', updateOutlet); // To update an outlet
// router.delete('/api/v1/outlets/:id', deleteOutlet); // To delete an outlet

export default router;
