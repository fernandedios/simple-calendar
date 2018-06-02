const jwt = require('jsonwebtoken');
const { secretKey } = require('../keys');

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Token authentication error'
                });
            }
            else {
                req.decoded = decoded;
                next();
            }
        })
    }
    else {
        res.status(403).json({
            success: false,
            message: 'Token is missing'
        });
    }
};
