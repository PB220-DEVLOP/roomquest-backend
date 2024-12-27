import mongoose from 'mongoose';
import Joi from 'joi';

// Define Roommate schema
const roommateSchema = new mongoose.Schema({
    roommateName: { type: String, required: true, minlength: 2, maxlength: 50 },
    roommateAge: { type: Number, required: true, min: 18, max: 100 },
    roommateGender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    roomType: { type: String, required: true },
    furnishing: { type: String, required: true },
    facilities: { type: [String], required: true },
    preferences: { type: [String], required: true },
    roomDesc: { type: String, required: true, minlength: 10, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    vacancy: { type: Number, required: true, min: 1, max: 20 },
    address: { type: String, required: true, minlength: 5, maxlength: 100 },
    profilePicture: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
    }
}, { timestamps: true });

const Roommate = mongoose.model('Roommate', roommateSchema);

// Joi validation schema
const validateRoommate = (data) => {
    const schema = Joi.object({
        roommateName: Joi.string().min(2).max(50).required(),
        roommateAge: Joi.number().min(18).max(100).required(),
        roommateGender: Joi.string().valid('Male', 'Female', 'Other').required(),
        roomType: Joi.string().required(),
        furnishing: Joi.string().required(),
        facilities: Joi.array().items(Joi.string()).min(1).required(),
        preferences: Joi.array().items(Joi.string()).min(1).required(),
        roomDesc: Joi.string().min(10).max(500).required(),
        price: Joi.number().min(0).required(),
        vacancy: Joi.number().min(1).max(20).required(),
        address: Joi.string().min(5).max(100).required(),
    });
    return schema.validate(data, { abortEarly: false });
};

export { Roommate, validateRoommate };
