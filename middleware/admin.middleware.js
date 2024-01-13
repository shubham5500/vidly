module.exports.isAdmin = function(req, res, next) {

    // 401: Unauthorized (When a user sends invalid token).
    // 403: Forbidden (When user tries to access some resource which is not in their permission)
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) return res.status(403).send('Access denied. Not an admin');

    next();
}