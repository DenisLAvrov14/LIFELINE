"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todos_controller_1 = require("../controllers/todos.controller");
const authenticateToken_1 = require("../middleware/authenticateToken");
const ensureUserExists_1 = require("../middleware/ensureUserExists");
const router = (0, express_1.Router)();
router.get(
  "/",
  authenticateToken_1.authenticateToken,
  ensureUserExists_1.ensureUserExists,
  todos_controller_1.getTodos,
);
router.put("/:id", todos_controller_1.updateTodo);
router.delete("/:id", todos_controller_1.deleteTodo);
exports.default = router;
