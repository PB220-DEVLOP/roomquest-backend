import mongoose from 'mongoose';
import Joi from 'joi';

const outletSchema = new mongoose.Schema({
    outletName: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    openingHours: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    description: { type: String, required: true },
    outletType: {
        type: String,
        required: true,
        enum: ['Mess', 'Residence'],
    },
    userType: {
        type: String,
        required: true,
        enum: ['Multi-Mess Manager', 'Residency Owner'],
    },
    image: {
        url: { type: String, required: true },        // Cloudinary image URL
        public_id: { type: String, required: true },   // Cloudinary public ID
    },
});

// Validation schema with Joi
const validateOutlet = (outlet) => {
    const schema = Joi.object({
        outletName: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                'string.min': 'Outlet name must be at least 3 characters long.',
                'string.max': 'Outlet name must not exceed 50 characters.',
                'any.required': 'Outlet name is required.',
            }),
        location: Joi.string()
            .required()
            .messages({
                'any.required': 'Location is required.',
            }),
        phone: Joi.string()
            .pattern(/^[0-9]+$/)
            .length(10)
            .required()
            .messages({
                'string.pattern.base': 'Phone number must contain only digits.',
                'string.length': 'Phone number must be exactly 10 digits long.',
                'any.required': 'Phone number is required.',
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Email must be a valid email address.',
                'any.required': 'Email is required.',
            }),
        openingHours: Joi.string()
            .min(5)
            .max(100)
            .required()
            .messages({
                'string.min': 'Opening hours must be at least 5 characters long.',
                'string.max': 'Opening hours must not exceed 100 characters.',
                'any.required': 'Opening hours are required.',
            }),
        coordinates: Joi.object({
            lat: Joi.number()
                .min(-90)
                .max(90)
                .required()
                .messages({
                    'number.min': 'Latitude must be between -90 and 90.',
                    'number.max': 'Latitude must be between -90 and 90.',
                    'any.required': 'Latitude is required.',
                }),
            lng: Joi.number()
                .min(-180)
                .max(180)
                .required()
                .messages({
                    'number.min': 'Longitude must be between -180 and 180.',
                    'number.max': 'Longitude must be between -180 and 180.',
                    'any.required': 'Longitude is required.',
                }),
        }).optional().messages({
            'any.required': 'Coordinates are required.',
        }),
        userType: Joi.string()
            .valid('Multi-Mess Manager', 'Residency Owner')
            .required()
            .messages({
                'any.only': 'User type must be either Multi-Mess Manager or Residency Owner.',
                'any.required': 'User type is required.',
            }),
        outletType: Joi.string()
            .when('userType', {
                is: 'Multi-Mess Manager',
                then: Joi.valid('Mess').required(),
                otherwise: Joi.valid('Residence').required(),
            })
            .messages({
                'any.only': 'Outlet type must be Mess for Multi-Mess Manager and Residence for Residency Owner.',
                'any.required': 'Outlet type is required.',
            }),
        description: Joi.string()
            .required()
            .messages({
                'any.required': 'Description is required.',
            }),
    });

    return schema.validate(outlet, { abortEarly: false });
};

const Outlet = mongoose.model('Outlet', outletSchema);
export { Outlet, validateOutlet };
