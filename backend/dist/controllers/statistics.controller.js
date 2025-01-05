"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyStats = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
const getWeeklyStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        console.log("Fetching weekly stats for user:", userId);
        const query = `
      SELECT 
          task_id,
          description,
          COUNT(task_id) AS task_count,
          SUM(total_time) AS total_time,
          MAX(completed_at) AS last_completed_at
      FROM 
          completed_tasks
      WHERE 
          user_id = $1::uuid AND
          completed_at >= date_trunc('week', now())
      GROUP BY 
          task_id, description
      ORDER BY 
          last_completed_at DESC;
    `;
        const result = yield db_connection_1.default.query(query, [userId]);
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "No completed tasks found for this user this week" });
        }
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getWeeklyStats = getWeeklyStats;
