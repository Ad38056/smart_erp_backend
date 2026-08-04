const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");
const roles = require("../middleware/rolesMiddleware");


// Anyone logged in can view products
router.get("/", auth, getProducts);


// Get single product
router.get("/:id", auth, getProduct);


// Only ADMIN can create product
router.post(
    "/",
    auth,
    roles("ADMIN"),
    createProduct
);


// Only ADMIN can update product
router.put(
    "/:id",
    auth,
    roles("ADMIN"),
    updateProduct
);


// Only ADMIN can delete product
router.delete(
    "/:id",
    auth,
    roles("ADMIN"),
    deleteProduct
);


module.exports = router;