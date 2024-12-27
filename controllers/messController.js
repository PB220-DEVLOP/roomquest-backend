import mongoose from 'mongoose';
import { uploadImage } from '../config/cloudinary.js';
import { Outlet, validateOutlet } from '../models/Outlet.js';
import { Menu, validateMenu } from '../models/Menu.js';

export const addMess = async (req, res) => {
    console.log('Incoming request body:', req.body);
    console.log('Incoming file:', req.file); // Log the incoming file for debugging

    // Validate the request body
    const { error } = validateOutlet(req.body);
    if (error) {
        console.error('Validation error:', error.details);
        return res.status(400).send(error.details.map(err => err.message));
    }

    const { outletName, location, phone, email, openingHours, userType, description, coordinates } = req.body;

    // Extract coordinates directly from the coordinates object
    const lat = parseFloat(coordinates.lat); // Access lat from coordinates
    const lng = parseFloat(coordinates.lng); // Access lng from coordinates

    // Check if lat or lng is NaN
    if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid coordinates provided:', { lat, lng });
        return res.status(400).send('Invalid coordinates provided.'); // Return error response
    }

    const coordinateValues = { lat, lng };

    try {
        const outletType = userType === 'Multi-Mess Manager' ? 'Mess' : 'Residence';

        // Upload the image to Cloudinary
        const folderPath = 'space-venture/mess/outlets'; // Folder path for storage
        const imageResult = await uploadImage(req.file.buffer, folderPath);

        const outlet = new Outlet({
            outletName,
            location,
            phone,
            email,
            openingHours,
            coordinates: coordinateValues, // Use the new coordinateValues
            userType,
            outletType,
            description,
            image: {
                url: imageResult.secure_url,
                public_id: imageResult.public_id,
            },
        });

        await outlet.save();
        res.status(201).send(outlet);
    } catch (err) {
        console.error('Error adding outlet:', err);
        res.status(500).send('Server error');
    }
};

export const messOutlets = async (req, res) => {
    try {
        const outlets = await Outlet.find(); // Fetch all outlets from the database
        res.status(200).json(outlets); // Send the outlets data as a response
    } catch (error) {
        console.error('Error fetching outlets:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getMessById = async (req, res) => {
    try {
        const { id } = req.params; // Get the outlet ID from the request parameters

        // Validate the ID
        if (!id || !mongoose.isValidObjectId(id)) { // Check if the ID is a valid ObjectId
            return res.status(400).json({ message: 'Invalid outlet ID provided.' });
        }

        const outlet = await Outlet.findById(id).select('outletName location phone email openingHours coordinates image'); // Select only relevant fields

        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found.' }); // Handle case where outlet is not found
        }

        res.status(200).json(outlet); // Send the found outlet data as a response
    } catch (error) {
        console.error('Error fetching outlet:', error);
        res.status(500).json({ message: 'Server error.' }); // Handle server errors
    }
};

// console.log("Received body data:", req.body); // Check request body
// console.log("Received file:", req.file); // Check file upload


// Controller to handle adding a menu item
export const addMenu = async (req, res) => {
    try {
        const { name, price, deliveryTime, description, rating, outletId } = req.body;
        const file = req.file;  // The file sent from frontend via multer

        // Check if all required fields are provided
        if (!name || !price || !deliveryTime || !description || !rating || !file) {
            return res.status(400).json({ message: 'Please fill in all fields and upload an image.' });
        }

        // Step 1: Upload the image to Cloudinary
        const cloudinaryResult = await uploadImage(file.buffer, 'space-venture/mess/menu'); // Upload the image to Cloudinary
        const { url, public_id } = cloudinaryResult;

        // Step 2: Create the menu item in the database
        const newMenu = new Menu({
            outletId,
            name,
            price,
            deliveryTime,
            description,
            rating,
            image: {
                url,
                public_id
            }
        });

        // Step 3: Save the new menu item to the database
        await newMenu.save();

        res.status(201).json({ success: true, message: 'Menu added successfully', data: newMenu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the menu', error: error.message });
    }
};

// Controller function to fetch all menu items
export const getMenuItems = async (req, res) => {
    try {
        // Fetching all menu items from MongoDB
        const menuItems = await Menu.find(); // You can modify this query to include filters if needed

        // If no menu items are found
        if (menuItems.length === 0) {
            return res.status(404).json({ message: 'No menu items found' });
        }

        // Sending the fetched menu items in the response
        res.status(200).json(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};