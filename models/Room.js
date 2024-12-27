import mongoose from 'mongoose';
import Joi from 'joi';

// Mongoose Room Schema Definition
const roomSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    location: { type: String, required: true },
    ownerName: { type: String, required: true },
    furnishing: {
        type: String,
        required: true,
        enum: [
            "Fully Furnished",
            "Partially Furnished",
            "Semi Furnished",
            "Unfurnished",
            "Furnishing Included",
            "Furnishing Negotiable",
            "Minimalist Furnished",
            "Luxury Furnished",
            "Vintage Furnished",
            "Modern Furnished",
            "Student Accommodation",
            "Family-Friendly Furnished",
            "Cozy Furnished",
            "Temporary Furnished",
            "Office Furnished"
        ],
    },
    accommodationType: {
        type: String,
        required: true,
        enum: [
            "Studio",
            "1BHK",
            "2BHK",
            "3BHK",
            "4BHK",
            "5BHK",
            "Duplex",
            "Penthouse",
            "Villa",
            "Shared Room",
            "Private Room",
            "Townhouse"
        ],
    },
    contactNumber: { type: String, required: true },
    roomDescription: { type: String, required: true },
    facilities: { type: [String], required: false },  // Array of strings
    amenities: { type: String, required: true },
    propertyAge: { type: Number, required: true },
    availableFrom: { type: Date, required: true },
    images: {
        type: [{
            url: { type: String, required: true },      // Cloudinary image URL
            public_id: { type: String, required: true }, // Cloudinary public ID
        }],
        required: true
    }
});

// Validation Schema with Joi

// Variable declarations for validation rules
const price = Joi.number()
    .positive()
    .required()
    .messages({
        'number.base': 'Price must be a number.',
        'number.positive': 'Price must be a positive number.',
        'any.required': 'Price is required.'
    });

const location = Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
        'string.base': 'Location must be a string.',
        'string.min': 'Location must be at least 3 characters long.',
        'string.max': 'Location must not exceed 100 characters.',
        'any.required': 'Location is required.'
    });

const ownerName = Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
        'string.base': 'Owner name must be a string.',
        'string.min': 'Owner name must be at least 2 characters long.',
        'string.max': 'Owner name must not exceed 50 characters.',
        'any.required': 'Owner name is required.'
    });

const furnishing = Joi.string()
    .valid(
        "Fully Furnished",
        "Partially Furnished",
        "Semi Furnished",
        "Unfurnished",
        "Furnishing Included",
        "Furnishing Negotiable",
        "Minimalist Furnished",
        "Luxury Furnished",
        "Vintage Furnished",
        "Modern Furnished",
        "Student Accommodation",
        "Family-Friendly Furnished",
        "Cozy Furnished",
        "Temporary Furnished",
        "Office Furnished"
    )
    .required()
    .messages({
        'any.only': 'Furnishing type is not valid.',
        'any.required': 'Furnishing type is required.'
    });

const accommodationType = Joi.string()
    .valid(
        "Studio",
        "1BHK",
        "2BHK",
        "3BHK",
        "4BHK",
        "5BHK",
        "Duplex",
        "Penthouse",
        "Villa",
        "Shared Room",
        "Private Room",
        "Townhouse"
    )
    .required()
    .messages({
        'any.only': 'Accommodation type is not valid.',
        'any.required': 'Accommodation type is required.'
    });

const contactNumber = Joi.string()
    .pattern(/^[0-9]{10}$/) // Adjust pattern as needed for your use case
    .required()
    .messages({
        'string.base': 'Contact number must be a string.',
        'string.pattern.base': 'Contact number must be a valid 10-digit number.',
        'any.required': 'Contact number is required.'
    });

const roomDescription = Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
        'string.base': 'Room description must be a string.',
        'string.min': 'Room description must be at least 10 characters long.',
        'string.max': 'Room description must not exceed 500 characters.',
        'any.required': 'Room description is required.'
    });

const facilities = Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
        'array.base': 'Facilities must be an array of strings.'
    });

const amenities = Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
        'string.base': 'Amenities must be a string.',
        'string.min': 'Amenities must be at least 3 characters long.',
        'string.max': 'Amenities must not exceed 200 characters.',
        'any.required': 'Amenities are required.'
    });

const propertyAge = Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
        'number.base': 'Property age must be a number.',
        'number.integer': 'Property age must be an integer.',
        'number.min': 'Property age must be 0 or greater.',
        'any.required': 'Property age is required.'
    });

const availableFrom = Joi.date()
    .greater('now') // Ensure the date is in the future
    .required()
    .messages({
        'date.base': 'Available from must be a valid date.',
        'date.greater': 'Available from must be a future date.',
        'any.required': 'Available from date is required.'
    });

const images = Joi.array()
    .items(Joi.object({
        url: Joi.string().uri().required().messages({
            'string.base': 'Image URL must be a string.',
            'string.uri': 'Image URL must be a valid URI.',
            'any.required': 'Image URL is required.'
        }),
        public_id: Joi.string().required().messages({
            'string.base': 'Image public_id must be a string.',
            'any.required': 'Image public_id is required.'
        }),
    }))
    .max(4) // Limit to a maximum of 4 images
    .required()
    .messages({
        'array.base': 'Images must be an array.',
        'array.max': 'You can upload a maximum of 4 images.',
        'any.required': 'Images are required.'
    });

// Combine all validations into a single schema
const validateRoom = (room) => {
    const schema = Joi.object({
        price,
        location,
        ownerName,
        furnishing,
        accommodationType,
        contactNumber,
        roomDescription,
        facilities,
        amenities,
        propertyAge,
        availableFrom,
        images,
    });

    return schema.validate(room, { abortEarly: false });
};

// Create the Mongoose model
const Room = mongoose.model('Room', roomSchema);

// Export the Room model and validation function
export { Room, validateRoom };
