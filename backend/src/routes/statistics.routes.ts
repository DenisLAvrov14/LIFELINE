import { Router } from "express";
import { getFilteredStats } from "../controllers/statistics.controller";

const router = Router();

router.get("/weekly-stats", getFilteredStats);

export default router;
