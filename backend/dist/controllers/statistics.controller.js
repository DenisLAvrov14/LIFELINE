"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyStats = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
const getWeeklyStats = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    try {
      console.log("Fetching weekly stats for user:", userId);
      const query = `
            SELECT 
                t.task_id,
                tasks.description,
                SUM(t.duration) AS total_time,
                COUNT(t.id) AS task_count
            FROM 
                task_times t
            JOIN 
                tasks ON t.task_id = tasks.id
            WHERE 
                t.user_id = $1 AND
                t.start_time >= date_trunc('week', now())
            GROUP BY 
                t.task_id, tasks.description
        `;
      const result = yield db_connection_1.default.query(query, [userId]);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No tasks found for this user this week" });
      }
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
exports.getWeeklyStats = getWeeklyStats;
