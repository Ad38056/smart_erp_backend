const express = require("express");
const router = express.Router();

const {
    createSupplier,
    getSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");

const auth = require("../middleware/authMiddleware");
const roles = require("../middleware/rolesMiddleware");

router.get("/", auth, getSuppliers);
router.get("/:id", auth, getSupplier);
router.post("/", auth, roles("ADMIN"), createSupplier);
router.put("/:id", auth, roles("ADMIN"), updateSupplier);
router.delete("/:id", auth, roles("ADMIN"), deleteSupplier);

module.exports = router;
