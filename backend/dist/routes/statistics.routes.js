"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statistics_controller_1 = require("../controllers/statistics.controller");
const router = (0, express_1.Router)();
router.get("/weekly-stats", statistics_controller_1.getWeeklyStats);
exports.default = router;
