const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { createRepo, pushRepo, pullRepo } = require("../controllers/repoController");

router.post("/create",authMiddleware, createRepo);
router.post("/push",authMiddleware, pushRepo);
router.post("/pull",authMiddleware, pullRepo);

module.exports = router;