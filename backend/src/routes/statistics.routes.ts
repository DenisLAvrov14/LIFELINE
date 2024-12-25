import { Router } from 'express';
import { getWeeklyStats } from '../controllers/statistics.controller';

const router = Router();

// Маршрут для получения статистики задач
router.get('/', getWeeklyStats);

export default router;
