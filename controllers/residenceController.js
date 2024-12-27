import mongoose from 'mongoose';
import { Outlet, validateOutlet } from '../models/Outlet.js'
import { Room, validateRoom } from '../models/Room.js';
import { uploadImage } from '../config/cloudinary.js';
import { Roommate, validateRoommate } from '../models/Roommate.js';

export const addOutlet = async (req, res) => {
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
        const folderPath = 'space-venture/residency/outlets'; // Folder path for storage
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

export const getOutlets = async (req, res) => {
    try {
        const outlets = await Outlet.find(); // Fetch all outlets from the database
        res.status(200).json(outlets); // Send the outlets data as a response
    } catch (error) {
        console.error('Error fetching outlets:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getOutletById = async (req, res) => {
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

export const registerRoom = async (req, res) => {
    try {
        // 1. Check if any files were uploaded
        if (!req.files || req.files.length === 0) {
            console.log("No images uploaded in the request.");
            return res.status(400).json({ message: 'No images uploaded.' });
        }

        // 2. Log received files
        console.log("Files received:", req.files);

        // 3. Attempt to upload each image to Cloudinary
        const images = await Promise.all(req.files.map(async (file) => {
            try {
                console.log("Attempting to upload image to Cloudinary:", file.originalname);
                const uploadResult = await uploadImage(file.buffer, 'space-venture/residency/rooms');

                // Log successful upload
                console.log("Image uploaded successfully:", uploadResult.secure_url);

                return {
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                };
            } catch (uploadError) {
                console.error('Image upload failed for file:', file.originalname, uploadError);
                throw new Error('Image upload failed');
            }
        }));

        // 4. Prepare room data from the request body
        const roomData = {
            price: req.body.price,
            location: req.body.location,
            ownerName: req.body.ownerName,
            furnishing: req.body.furnishing,
            accommodationType: req.body.accommodationType,
            contactNumber: req.body.contactNumber,
            roomDescription: req.body.roomDescription,
            facilities: req.body.facilities || [],  // Default to empty array if facilities are not provided
            amenities: req.body.amenities,
            propertyAge: req.body.propertyAge,
            availableFrom: req.body.availableFrom,
            images // Add the uploaded images array to room data
        };

        // 5. Validate room data using Joi validation
        const { error } = validateRoom(roomData);
        if (error) {
            console.log("Validation error in room data:", error.details);
            return res.status(400).json({ message: 'Validation error', details: error.details });
        }

        // 6. Create and save the new room document in MongoDB
        const room = new Room(roomData);
        await room.save();

        console.log("Room registered successfully:", room._id);
        return res.status(201).json({ message: 'Room registered successfully!', room });
    } catch (error) {
        console.error('Error in registerRoom controller:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Controller to get all rooms
export const getAllRooms = async (req, res) => {
    try {
        // Fetch all rooms from the database
        const rooms = await Room.find();  // You can add filters or sorting if needed

        // Respond with the fetched data
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const addRoommate = async (req, res) => {
    // Validate request body
    const { error } = validateRoommate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details.map((detail) => detail.message),
        });
    }

    // Cloudinary image upload
    let imageUploadResult;
    try {
        if (req.file) {
            imageUploadResult = await uploadImage(req.file.buffer, 'space-venture/residency/roommies');
        } else {
            return res.status(400).json({ error: 'Profile picture is required' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
    }

    // Create roommate record
    try {
        const roommateData = {
            ...req.body,
            profilePicture: {
                url: imageUploadResult.secure_url,
                public_id: imageUploadResult.public_id,
            },
        };

        const roommate = new Roommate(roommateData);
        await roommate.save();
        res.status(201).json({ message: 'Roommate added successfully', data: roommate });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add roommate' });
    }
};
