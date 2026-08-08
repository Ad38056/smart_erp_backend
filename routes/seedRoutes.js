const express = require("express");
const router = express.Router();

const { seedDemoData } = require("../controllers/seedController");
const auth = require("../middleware/authMiddleware");
const roles = require("../middleware/rolesMiddleware");

router.post("/", auth, roles("ADMIN"), seedDemoData);

module.exports = router;
