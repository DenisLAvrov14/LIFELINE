"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statistics_controller_1 = require("../controllers/statistics.controller");
const authenticateToken_1 = require("../middleware/authenticateToken");
const router = (0, express_1.Router)();
// Применяем middleware только к защищённым маршрутам
router.get(
  "/weekly-stats",
  authenticateToken_1.authenticateToken,
  statistics_controller_1.getFilteredStats,
);
exports.default = router;
