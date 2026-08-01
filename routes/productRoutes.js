const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");


// Get all products
router.get("/", auth, getProducts);


// Get single product
router.get("/:id", auth, getProduct);


// Create product
router.post("/", auth, createProduct);


// Update product
router.put("/:id", auth, updateProduct);


// Delete product
router.delete("/:id", auth, deleteProduct);


module.exports = router;