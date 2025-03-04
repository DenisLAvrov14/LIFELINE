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
exports.deleteTask =
  exports.getTasksByUser =
  exports.updateTask =
  exports.createTask =
    void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Создание задачи
const createTask = (task) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    INSERT INTO tasks (user_id, description, is_done, has_timer, alarm_time)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [
      task.user_id,
      task.description,
      task.is_done,
      task.has_timer,
      task.alarm_time,
    ];
    try {
      const result = yield db_connection_1.default.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error creating task:", err);
      throw err;
    }
  });
exports.createTask = createTask;
// Обновление задачи
const updateTask = (task) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    UPDATE tasks
    SET description = $1, is_done = $2, has_timer = $3, alarm_time = $4
    WHERE id = $5 AND user_id = $6
    RETURNING *;
  `;
    const values = [
      task.description,
      task.is_done,
      task.has_timer,
      task.alarm_time,
      task.id,
      task.user_id,
    ];
    try {
      const result = yield db_connection_1.default.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  });
exports.updateTask = updateTask;
// Получение всех задач пользователя
const getTasksByUser = (user_id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC;
  `;
    try {
      const result = yield db_connection_1.default.query(query, [user_id]);
      return result.rows;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      throw err;
    }
  });
exports.getTasksByUser = getTasksByUser;
// Удаление задачи
const deleteTask = (task_id, user_id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    DELETE FROM tasks WHERE id = $1 AND user_id = $2;
  `;
    try {
      yield db_connection_1.default.query(query, [task_id, user_id]);
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  });
exports.deleteTask = deleteTask;
