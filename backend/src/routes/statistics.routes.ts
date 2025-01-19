import { Router } from "express";
import { getFilteredStats } from "../controllers/statistics.controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

// Применяем middleware только к защищённым маршрутам
router.get("/weekly-stats", authenticateToken, getFilteredStats);

export default router;
