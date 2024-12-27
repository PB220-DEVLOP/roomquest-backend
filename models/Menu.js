    import mongoose from 'mongoose';
    import Joi from 'joi'; // Import Joi for validation

    // Menu schema definition
    const menuSchema = new mongoose.Schema({
        outletId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outlet', // Assuming you have an Outlet model
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        deliveryTime: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        image: {
            url: {
                type: String,
                required: true,   // Cloudinary image URL
            },
            public_id: {
                type: String,
                required: true,   // Cloudinary public ID
            }
        }
    }, {
        timestamps: true
    });

    // Create the model
    const Menu = mongoose.model('Menu', menuSchema);

    // Joi validation schema for menu data
    const validateMenu = (menu) => {
        const schema = Joi.object({
            outletId: Joi.string().length(24).hex().required(), // Validating ObjectId as 24 character hexadecimal string
            name: Joi.string().min(3).max(100).required(),
            price: Joi.number().positive().required(),
            deliveryTime: Joi.string().min(3).max(100).required(),
            description: Joi.string().min(10).max(500).required(),
            rating: Joi.number().min(1).max(5).required(),
            image: Joi.object({
                url: Joi.string().uri().required(), // Cloudinary image URL validation
                public_id: Joi.string().required()  // Cloudinary public ID validation
            }).required()
        });

        return schema.validate(menu);
    };

    export { Menu, validateMenu };
