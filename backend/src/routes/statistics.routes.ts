import { Router } from "express";
import { getWeeklyStats } from "../controllers/statistics.controller";

const router = Router();

router.get("/weekly-stats", getWeeklyStats);

export default router;
