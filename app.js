import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import dbConnection from './database/dbConnection.js';
import userRouter from './routes/userRouter.js';
import residencyRouter from './routes/residencyRouter.js';
import messRouter from './routes/messRouter.js';

dotenv.config({ path: './config/config.env' });

const app = express();

// Helmet should be applied first to set security-related headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "blob:"],
                scriptSrcElem: ["'self'", "blob:"],
                workerSrc: ["'self'", "blob:"],
                childSrc: ["'self'", "blob:"],
                connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
                imgSrc: ["'self'", "data:"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        crossOriginEmbedderPolicy: false,
    })
);

// Other middlewares
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
}));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/residence', residencyRouter);
app.use('/api/v1/mess', messRouter);

// Database connection
dbConnection();

// Error handling middleware
app.use(errorMiddleware);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

export default app;
