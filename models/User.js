import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi'; // Import Joi

// Define the User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.isGoogleSignUp; // Only required if not signing up via Google
        },
    },
    phone: {
        type: String,
        required: function () {
            return !this.isGoogleSignUp; // Only required if not signing up via Google
        },
    },
    userType: {
        type: String,
        required: [true, 'User type is required'],
        enum: ['User', 'Multi-Mess Manager', 'Residency Owner'], // Define valid user types
    },
    address: {
        type: String,
        required: function () {
            return !this.isGoogleSignUp; // Only required if not signing up via Google
        },
        trim: true,
    },
    organization: {
        type: String,
        required: function () {
            return !this.isGoogleSignUp; // Only required if not signing up via Google
        },
        trim: true,
    },
    dob: {
        type: Date,
        required: function () {
            return !this.isGoogleSignUp; // Only required if not signing up via Google
        },
    },
    profilePicture: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    isGoogleSignUp: {
        type: Boolean,
        default: false, // Default to false, unless specified for Google sign-up
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Validation Schema with Joi
const userValidationSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .pattern(/^[A-Za-z\s]+$/, { name: 'letters and spaces' })
        .messages({
            'string.empty': 'Name is required.',
            'string.pattern.name': 'Name can only contain letters and spaces.',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Please provide a valid email.',
        }),
    password: Joi.string()
        .when(Joi.ref('isGoogleSignUp'), {
            is: false,
            then: Joi.string()
                .min(8)
                .pattern(/[a-z]/, 'lowercase')
                .pattern(/[A-Z]/, 'uppercase')
                .pattern(/[0-9]/, 'digit')
                .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
                .required()
                .messages({
                    'string.empty': 'Password is required.',
                    'string.min': 'Password must be at least 8 characters long.',
                    'string.pattern.name': 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.',
                }),
            otherwise: Joi.forbidden(),
        }),
    phone: Joi.string()
        .when(Joi.ref('isGoogleSignUp'), {
            is: false,
            then: Joi.string()
                .required()
                .pattern(/^\d{10}$/, { name: '10-digit phone number' })
                .messages({
                    'string.empty': 'Phone number is required.',
                    'string.pattern.name': 'Phone number must be 10 digits.',
                }),
            otherwise: Joi.forbidden(),
        }),
    userType: Joi.string()
        .valid('User', 'Multi-Mess Manager', 'Residency Owner')
        .required()
        .messages({
            'string.empty': 'User type is required.',
            'any.only': 'User type must be one of [User, Multi-Mess Manager, Residency Owner].',
        }),
    address: Joi.string()
        .when(Joi.ref('isGoogleSignUp'), {
            is: false,
            then: Joi.string()
                .min(25)
                .max(325)
                .required()
                .messages({
                    'string.empty': 'Address is required.',
                    'string.min': 'Address must be at least 25 characters long.',
                    'string.max': 'Address must be at most 325 characters long.',
                }),
            otherwise: Joi.forbidden(),
        }),
    organization: Joi.string()
        .when(Joi.ref('isGoogleSignUp'), {
            is: false,
            then: Joi.string()
                .trim()
                .required()
                .pattern(/^[A-Za-z\s]+$/, { name: 'letters and spaces' })
                .messages({
                    'string.empty': 'Organization is required.',
                    'string.pattern.name': 'Organization can only contain letters and spaces.',
                }),
            otherwise: Joi.forbidden(),
        }),
    dob: Joi.date()
        .when(Joi.ref('isGoogleSignUp'), {
            is: false,
            then: Joi.date().less('now').required()
                .messages({
                    'date.base': 'Invalid date format.',
                    'date.less': 'Date of birth must be in the past.',
                }),
            otherwise: Joi.forbidden(),
        }),
    profilePicture: Joi.object().keys({
        url: Joi.string().uri().required().messages({
            'string.empty': 'Profile picture URL is required.',
            'string.uri': 'Invalid URL format.',
        }),
        public_id: Joi.string().required().messages({
            'string.empty': 'Public ID is required.',
        }),
    }),
});

// Hashing password before saving to the database
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isGoogleSignUp) {
        return next(); // Skip password hashing if it's Google sign-up
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Comparing Password
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token Generating
UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Validate function
UserSchema.statics.validateUser = function (data) {
    return userValidationSchema.validate(data);
};

// Export the User model
export default mongoose.model('User', UserSchema);
