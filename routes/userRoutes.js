const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateProfile,
    changePassword,
    getUsers,
    updateUserRole
} = require("../controllers/userController");

const auth = require("../middleware/authMiddleware");
const roles = require("../middleware/rolesMiddleware");

router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);
router.put("/me/password", auth, changePassword);
router.get("/", auth, roles("ADMIN"), getUsers);
router.put("/:id/role", auth, roles("ADMIN"), updateUserRole);

module.exports = router;
