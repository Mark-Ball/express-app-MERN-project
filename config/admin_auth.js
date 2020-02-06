// middleware to check if user is admin
function adminAuth(req, res, next) {
    if (req.user.admin) {
        next();
    } else {
        res.sendStatus(401);
    }
}

module.exports = adminAuth;