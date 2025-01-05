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
const express_1 = require("express");
const db_connection_1 = __importDefault(require("../services/db.connection"));
const router = (0, express_1.Router)();
const createUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.body;
    if (!username || !email) {
      res.status(400).send("Invalid data: Missing required fields");
      return;
    }
    const query = `
    INSERT INTO users (username, email)
    VALUES ($1, $2)
    RETURNING *;
  `;
    try {
      const result = yield db_connection_1.default.query(query, [
        username,
        email,
      ]);
      const createdUser = result.rows[0]; // Получаем созданного пользователя с UUID
      res.status(201).json(createdUser);
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).send("Error creating user");
    }
  });
router.post("/users", createUser);
exports.default = router;
