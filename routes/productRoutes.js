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
const { validateProduct } = require("../middleware/validation");

router.get("/", auth, getProducts);
router.get("/:id", auth, getProduct);
router.post("/", auth, roles("ADMIN"), validateProduct, createProduct);
router.put("/:id", auth, roles("ADMIN"), validateProduct, updateProduct);
router.delete("/:id", auth, roles("ADMIN"), deleteProduct);

module.exports = router;