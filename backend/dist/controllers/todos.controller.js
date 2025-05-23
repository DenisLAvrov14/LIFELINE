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
exports.deleteTodo = exports.updateTodo = exports.getTodos = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Получение всех задач (Todos)
const getTodos = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userId = req.userId;
      console.log("🔍 [getTodos] Запрос задач для userId:", userId);
      if (!userId) {
        console.error("❌ [getTodos] Ошибка: userId отсутствует в запросе");
        return res
          .status(400)
          .json({ error: "User ID is missing in request token" });
      }
      console.log("🛠 getTodos was called");
      const result = yield db_connection_1.default.query(
        `
SELECT
  id,
  user_id,
  description,
  "isDone",
  created_at   AS "createdAt",
  folder_id    AS "folderId",
  has_timer    AS "hasTimer",
  alarm_time   AS "alarmTime",
  is_quick_task AS "isQuickTask",
  category                      -- 👈 добавили
FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC

      `,
        [userId],
      );
      console.log("✅ [getTodos] Найдено задач:", result.rowCount);
      // Отдаём клиенту уже готовый camelCase JSON
      res.json(result.rows);
    } catch (error) {
      console.error("❌ [getTodos] Ошибка при получении задач:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });
exports.getTodos = getTodos;
// Обновление задачи (Todo)
const updateTodo = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, isDone } = req.body; // Используем isDone
    console.log(
      "Updating todo with ID:",
      id,
      "Description:",
      description,
      "Is Done:",
      isDone,
    );
    try {
      const result = yield db_connection_1.default.query(
        `UPDATE tasks 
       SET description = $1, "isDone" = $2 
       WHERE id = $3 
       RETURNING id, description, "isDone" AS "isDone", created_at AS "createdAt"`,
        [description, isDone, id],
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Todo not found" });
      }
      console.log("Update result:", result.rows[0]);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating todo:", error.message);
      res.status(500).send(error.message);
    }
  });
exports.updateTodo = updateTodo;
// Удаление задачи (Todo)
const deleteTodo = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
      yield db_connection_1.default.query("DELETE FROM tasks WHERE id = $1", [
        id,
      ]);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting todo:", error.message);
      res.status(500).send("Error deleting todo: " + error.message);
    }
  });
exports.deleteTodo = deleteTodo;
