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
exports.deleteFolder =
  exports.renameFolder =
  exports.createFolder =
  exports.getFolders =
    void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Получить все папки пользователя
const getFolders = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userId = req.userId;
      const result = yield db_connection_1.default.query(
        `SELECT id, name, created_at FROM folders WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId],
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching folders:", error.message);
      res.status(500).json({ error: "Error fetching folders" });
    }
  });
exports.getFolders = getFolders;
// Создать новую папку
const createFolder = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userId = req.userId;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Folder name is required" });
      }
      const result = yield db_connection_1.default.query(
        `INSERT INTO folders (user_id, name) VALUES ($1, $2) RETURNING *`,
        [userId, name],
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating folder:", error.message);
      res.status(500).json({ error: "Error creating folder" });
    }
  });
exports.createFolder = createFolder;
// Переименовать папку
const renameFolder = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userId = req.userId;
      const folderId = req.params.id;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Folder name is required" });
      }
      const result = yield db_connection_1.default.query(
        `UPDATE folders SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
        [name, folderId, userId],
      );
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Folder not found or not authorized" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error renaming folder:", error.message);
      res.status(500).json({ error: "Error renaming folder" });
    }
  });
exports.renameFolder = renameFolder;
// Удалить папку
const deleteFolder = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userId = req.userId;
      const folderId = req.params.id;
      const result = yield db_connection_1.default.query(
        `DELETE FROM folders WHERE id = $1 AND user_id = $2 RETURNING *`,
        [folderId, userId],
      );
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Folder not found or not authorized" });
      }
      res.json({ message: "Folder deleted successfully" });
    } catch (error) {
      console.error("Error deleting folder:", error.message);
      res.status(500).json({ error: "Error deleting folder" });
    }
  });
exports.deleteFolder = deleteFolder;
