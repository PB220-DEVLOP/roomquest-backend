import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Failed to start server: ${err.message}`);
        
    } else {
        console.log(`Server running on port: ${PORT}`);
    }
});
