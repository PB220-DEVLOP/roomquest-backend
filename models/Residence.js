// models/OutletMenuItem.js
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/.*\.(jpeg|jpg|png|gif)$/.test(v); // Validate URL format for images
            },
            message: 'Invalid image URL format.'
        }
    },
    publicId: {
        type: String,
        required: true
    }
});

const outletMenuItemSchema = new mongoose.Schema({
    outletName: {
        type: String,
        required: [true, 'Outlet name is required.'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required.']
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: [true, 'Coordinates type is required.']
        },
        coordinates: {
            type: [Number],
            required: [true, 'Coordinates are required.'],
            validate: {
                validator: function (v) {
                    return v.length === 2; // Ensure there are exactly 2 coordinates
                },
                message: 'Coordinates must be an array of two numbers [longitude, latitude].'
            }
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required.'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(v); // Basic phone number validation
            },
            message: 'Phone number must be a valid format.'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
            },
            message: 'Email must be a valid email address.'
        }
    },
    openingHours: {
        type: String,
        required: [true, 'Opening hours are required.'],
        trim: true
    },
    menuItems: [{
        name: {
            type: String,
            required: false, // Make it optional for the menu item
            trim: true,
            minlength: [3, 'Menu item name must be at least 3 characters long.'],
            maxlength: [100, 'Menu item name must not exceed 100 characters.']
        },
        description: {
            type: String,
            maxlength: [500, 'Description must not exceed 500 characters.'],
            required: false // Make it optional for the menu item
        },
        price: {
            type: Number,
            required: false, // Make it optional for the menu item
            min: [0, 'Price must be a positive number.']
        },
        deliveryTime: {
            type: String,
            required: false, // Make it optional for the menu item
            minlength: [2, 'Delivery time must be at least 2 characters long.'],
            maxlength: [50, 'Delivery time must not exceed 50 characters.']
        },
        rating: {
            type: Number,
            min: [0, 'Rating must be at least 0.'],
            max: [5, 'Rating must not exceed 5.'],
            required: false // Make it optional for the menu item
        },
        images: [imageSchema] // Store images of menu items
    }]
});

// Create a geospatial index for the coordinates
outletMenuItemSchema.index({ coordinates: '2dsphere' });

const OutletMenuItem = mongoose.model('OutletMenuItem', outletMenuItemSchema);
export default OutletMenuItem;
