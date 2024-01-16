const config = require('config');
const jwt = require('jsonwebtoken');

function authorize(req, res, next) {
    const token = req.header('x-auth-header');
    if (!token) {
        return res.status(401).send('Access Denied, no token provided.')
    }
    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedPayload;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized')
    }
}

module.exports.authorize = authorize;