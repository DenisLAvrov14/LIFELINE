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
exports.getFilteredStats = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
const getFilteredStats = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // userId передаётся через middleware authenticateToken
      const userId = req.userId;
      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID is missing in request token" });
      }
      console.log(`Fetching stats for user: ${userId}`);
      const query = `
      SELECT 
          description,
          COUNT(*) AS task_count,
          SUM(total_time) AS total_time,
          MAX(completed_at) AS last_completed_at
      FROM 
          completed_tasks
      WHERE 
          user_id = $1::uuid
      GROUP BY 
          description
      ORDER BY 
          last_completed_at DESC;
    `;
      const result = yield db_connection_1.default.query(query, [userId]);
      if (result.rows.length === 0) {
        return res.status(200).json({
          message: "No completed tasks found for the specified user",
          data: [],
        });
      }
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching stats:", error.message);
      if (error.code) {
        console.error("Database error code:", error.code);
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });
exports.getFilteredStats = getFilteredStats;
