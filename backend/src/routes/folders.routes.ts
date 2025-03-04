import express from "express";
import {
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
} from "../controllers/folders.controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/", authenticateToken, getFolders);
router.post("/", authenticateToken, createFolder);
router.put("/:id", authenticateToken, renameFolder);
router.delete("/:id", authenticateToken, deleteFolder);

export default router;
