// function adminAuth(req, res, next) {
//     req.user.admin ? next() : res.sendStatus(401);
// }

const adminAuth = (req, res, next) => req.user.admin ? next() : res.sendStatus(401);

module.exports = adminAuth;