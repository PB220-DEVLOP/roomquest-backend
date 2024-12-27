export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken(); // Generate JWT token

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Set cookie expiration
        httpOnly: true, // Make cookie accessible only by the web server
    };

    res.status(statusCode).cookie('token', token, options).json({ success: true, message, user, token });
};
