const express = require("express");
const router = express.Router();

const {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
} = require("../controllers/customerController");

const auth = require("../middleware/authMiddleware");
const roles = require("../middleware/rolesMiddleware");

router.get("/", auth, getCustomers);
router.get("/:id", auth, getCustomer);
router.post("/", auth, roles("ADMIN"), createCustomer);
router.put("/:id", auth, roles("ADMIN"), updateCustomer);
router.delete("/:id", auth, roles("ADMIN"), deleteCustomer);

module.exports = router;
