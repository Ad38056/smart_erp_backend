const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");

const auth = require("../middleware/authMiddleware");
const roles = require("../middleware/rolesMiddleware");

router.get("/", auth, getOrders);
router.get("/:id", auth, getOrder);
router.post("/", auth, roles("ADMIN"), createOrder);
router.put("/:id", auth, roles("ADMIN"), updateOrder);
router.delete("/:id", auth, roles("ADMIN"), deleteOrder);

module.exports = router;
