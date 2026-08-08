const requiredFields = (req, res, next, fields) => {
    const missing = fields.filter((field) => {
        const value = req.body[field];
        return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
        return res.status(400).json({
            message: `Missing required fields: ${missing.join(", ")}`
        });
    }

    next();
};

const validateProduct = (req, res, next) => {
    const { name, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
        return res.status(400).json({
            message: "Name, price, and stock are required"
        });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
        return res.status(400).json({
            message: "Price and stock cannot be negative"
        });
    }

    next();
};

const validateCustomer = (req, res, next) => {
    requiredFields(req, res, next, ["name"]);
};

const validateSupplier = (req, res, next) => {
    requiredFields(req, res, next, ["name"]);
};

module.exports = {
    requiredFields,
    validateProduct,
    validateCustomer,
    validateSupplier
};
