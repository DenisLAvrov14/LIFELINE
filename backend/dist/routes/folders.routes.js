"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folders_controller_1 = require("../controllers/folders.controller");
const authenticateToken_1 = require("../middleware/authenticateToken");
const router = express_1.default.Router();
router.get(
  "/",
  authenticateToken_1.authenticateToken,
  folders_controller_1.getFolders,
);
router.post(
  "/",
  authenticateToken_1.authenticateToken,
  folders_controller_1.createFolder,
);
router.put(
  "/:id",
  authenticateToken_1.authenticateToken,
  folders_controller_1.renameFolder,
);
router.delete(
  "/:id",
  authenticateToken_1.authenticateToken,
  folders_controller_1.deleteFolder,
);
exports.default = router;
