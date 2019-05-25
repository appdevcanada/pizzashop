const User = require('../models/User')
module.exports = async function (req, res, next) {

    const user = await User.findById(req.user._id);
    if (!user.isStaff) {
        return res.status(403).send({
            errors: [{
                status: "Unauthorized",
                code: "403",
                title: "Forbidden",
                detail: "Missing admin status"
            }]
        });
    }
    next()
}