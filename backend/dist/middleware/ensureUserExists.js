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
    const userId = req.userId;
    const tokenPayload = req.keycloakToken;
    if (!userId || !tokenPayload) {
        console.error("User ID or token payload is missing");
        return res.status(401).json({ error: "Unauthorized: Token payload is missing" });
    }
    const preferredUsername = tokenPayload.preferred_username || "Unknown";
    const email = tokenPayload.email || "unknown@example.com";
    try {
        const query = `SELECT id FROM users WHERE id = $1`;
        const result = yield db_connection_1.default.query(query, [userId]);
        if (result.rowCount === 0) {
            const insertQuery = `
          INSERT INTO users (id, username, email)
          VALUES ($1, $2, $3)
        `;
            yield db_connection_1.default.query(insertQuery, [userId, preferredUsername, email]);
            console.log(`New user added: ${preferredUsername}`);
        }
        else {
            console.log(`User already exists: ${userId}`);
        }
        next();
    }
    catch (error) {
        console.error("Error checking or adding user:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.ensureUserExists = ensureUserExists;
