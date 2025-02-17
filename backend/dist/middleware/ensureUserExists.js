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
exports.ensureUserExists = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
const ensureUserExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.userId;
    const tokenPayload = req.keycloakToken;
    if (!userId || !tokenPayload) {
        console.error("❌ [ensureUserExists] Ошибка: User ID или токен отсутствуют");
        return res.status(401).json({ error: "Unauthorized: Token payload is missing" });
    }
    const preferredUsername = tokenPayload.preferred_username || "Unknown";
    const email = tokenPayload.email || "unknown@example.com";
    try {
        // 🔍 Проверяем сначала ID
        const queryById = `SELECT id FROM users WHERE id = $1`;
        const resultById = yield db_connection_1.default.query(queryById, [userId]);
        if (((_a = resultById.rowCount) !== null && _a !== void 0 ? _a : 0) > 0) {
            console.log(`🟢 [ensureUserExists] Пользователь найден по ID: ${userId}`);
            return next(); // Пользователь уже есть, продолжаем
        }
        // 🔍 Проверяем email (вдруг ID разный, но email совпадает)
        const queryByEmail = `SELECT id FROM users WHERE email = $1`;
        const resultByEmail = yield db_connection_1.default.query(queryByEmail, [email]);
        if (((_b = resultByEmail.rowCount) !== null && _b !== void 0 ? _b : 0) > 0) {
            console.log(`🟢 [ensureUserExists] Пользователь найден по email: ${email}`);
            return next(); // Email уже есть, продолжаем
        }
        // 🔄 Если пользователь не найден — создаем его
        console.log(`🟡 [ensureUserExists] Добавляем нового пользователя: ${preferredUsername} (${email})`);
        const insertQuery = `
            INSERT INTO users (id, username, email)
            VALUES ($1, $2, $3)
        `;
        yield db_connection_1.default.query(insertQuery, [userId, preferredUsername, email]);
        console.log(`✅ [ensureUserExists] Новый пользователь добавлен: ${preferredUsername}`);
        next();
    }
    catch (error) {
        console.error("❌ [ensureUserExists] Ошибка при проверке или добавлении пользователя:", error.message);
        return res.status(500).json({ error: error.message });
    }
});
exports.ensureUserExists = ensureUserExists;
