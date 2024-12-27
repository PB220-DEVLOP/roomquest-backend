import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.MONGODB_URI, { dbName: "ROOM_QUEST" })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => {
            console.error(`Error connecting to MongoDB: ${err.message}`);
            process.exit(1); // Exit process if connection fails
        });
};

export default dbConnection