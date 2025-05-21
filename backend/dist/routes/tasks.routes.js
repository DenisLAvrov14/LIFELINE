"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_controller_1 = require("../controllers/tasks.controller");
const authenticateToken_1 = require("../middleware/authenticateToken");
const ensureUserExists_1 = require("../middleware/ensureUserExists");
const router = (0, express_1.Router)();
router.use(
  authenticateToken_1.authenticateToken,
  ensureUserExists_1.ensureUserExists,
);
router.post("/", tasks_controller_1.createTask);
router.put("/:id", tasks_controller_1.updateTask);
router.delete("/:id", tasks_controller_1.deleteTask);
router.put("/:id/done", tasks_controller_1.markTaskAsDone);
exports.default = router;
