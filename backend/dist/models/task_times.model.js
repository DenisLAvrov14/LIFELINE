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
exports.updateTimerModel =
  exports.updateTaskTimeModel =
  exports.getTaskTimes =
  exports.updateTaskTime =
  exports.createTaskTime =
    void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Создание записи времени задачи
const createTaskTime = (taskTime) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { task_id, user_id, start_time, end_time, duration } = taskTime;
    const query = `
    INSERT INTO task_times (task_id, user_id, start_time, end_time, duration)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [task_id, user_id, start_time, end_time, duration];
    const { rows } = yield db_connection_1.default.query(query, values);
    return rows[0];
  });
exports.createTaskTime = createTaskTime;
// Обновление записи времени задачи
const updateTaskTime = (taskTime) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id, task_id, user_id, start_time, end_time, duration } = taskTime;
    const query = `
    UPDATE task_times 
    SET task_id = $1, user_id = $2, start_time = $3, end_time = $4, duration = $5
    WHERE id = $6
    RETURNING *;
  `;
    const values = [task_id, user_id, start_time, end_time, duration, id];
    const { rows } = yield db_connection_1.default.query(query, values);
    return rows[0];
  });
exports.updateTaskTime = updateTaskTime;
// Получение всех записей времени для определенного пользователя
const getTaskTimes = (user_id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT * 
    FROM task_times 
    WHERE user_id = $1;
  `;
    const values = [user_id];
    const { rows } = yield db_connection_1.default.query(query, values);
    return rows;
  });
exports.getTaskTimes = getTaskTimes;
const updateTaskTimeModel = (taskTime) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id, task_id, user_id, start_time, end_time, duration } = taskTime;
    const query = `
    UPDATE task_times 
    SET start_time = $1, end_time = $2, duration = $3
    WHERE id = $4
    RETURNING *;
  `;
    const values = [start_time, end_time, duration, id];
    const { rows } = yield db_connection_1.default.query(query, values);
    return rows[0];
  });
exports.updateTaskTimeModel = updateTaskTimeModel;
const updateTimerModel = (_a) =>
  __awaiter(
    void 0,
    [_a],
    void 0,
    function* ({ task_id, elapsed_time, is_running }) {
      const query = `
    UPDATE task_times 
    SET duration = $1, end_time = CASE WHEN $2 = false THEN NOW() ELSE end_time END
    WHERE task_id = $3 AND end_time IS NULL
    RETURNING *;
  `;
      const values = [elapsed_time, is_running, task_id];
      const { rows } = yield db_connection_1.default.query(query, values);
      return rows[0];
    },
  );
exports.updateTimerModel = updateTimerModel;
