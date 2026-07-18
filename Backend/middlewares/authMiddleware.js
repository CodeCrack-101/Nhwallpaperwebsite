const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied.' });
    }

    try {
        // Token verify karein
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // User ID request me attach ho jayegi
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is not valid.' });
    }
};