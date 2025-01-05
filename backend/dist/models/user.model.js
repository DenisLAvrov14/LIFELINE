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
exports.createUser = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Создание пользователя
const createUser = (newUser) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    INSERT INTO users (username, email)
    VALUES ($1, $2)
    RETURNING *;
  `;
    try {
      const result = yield db_connection_1.default.query(query, [
        newUser.username,
        newUser.email,
      ]);
      return result.rows[0]; // Возвращаем созданного пользователя, включая UUID
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  });
exports.createUser = createUser;
