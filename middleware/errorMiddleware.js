class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    // If the error is a string, convert it to an Error object
    if (typeof err === 'string') {
        err = new ErrorHandler(err, 500); // Wrap string error in ErrorHandler
    }

    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;

    if (err.name === 'CastError') {
        const message = `Resource Not Found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web Token Is Invalid, Try Again!`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === 'TokenExpiredError') {
        const message = `Json Web Token Is Expired, Try Again!`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;