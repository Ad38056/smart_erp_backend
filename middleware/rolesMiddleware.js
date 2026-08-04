const rolesMiddleware = (...roles) => {

    return (req, res, next) => {

        // Check if user exists from auth middleware
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please login first."
            });
        }


        // Check user role permission
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You do not have permission."
            });
        }


        next();
    };

};


module.exports = rolesMiddleware;