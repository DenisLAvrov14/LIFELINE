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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const JWKS_URL = process.env.JWKS_URL;
if (!JWKS_URL) {
    throw new Error('JWKS_URL is not defined. Check your .env file.');
}
let cachedPublicKey = null;
// Функция для получения публичного ключа
const getPublicKey = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedPublicKey) {
        return cachedPublicKey;
    }
    try {
        console.log(`Fetching JWKS from URL: ${JWKS_URL}`); // Debug log
        const response = yield axios_1.default.get(JWKS_URL);
        console.log('JWKS response data:', response.data); // Debug log
        const keys = response.data.keys;
        if (!keys || keys.length === 0) {
            throw new Error('No public keys found in JWKS.');
        }
        // Ищем ключ с `use: 'sig'`
        const signingKey = keys.find((key) => key.use === 'sig');
        if (!signingKey) {
            throw new Error('No signing key found in JWKS.');
        }
        const { x5c } = signingKey;
        if (!x5c || x5c.length === 0) {
            throw new Error('No x5c field found in signing key.');
        }
        cachedPublicKey = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;
        console.log('Public key cached successfully.'); // Debug log
        return cachedPublicKey;
    }
    catch (error) {
        console.error('Error fetching JWKS:', error.message);
        throw new Error('Failed to fetch public key from JWKS.');
    }
});
// Middleware для проверки токена
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    try {
        const publicKey = yield getPublicKey();
        // Верификация токена
        const payload = jsonwebtoken_1.default.verify(token, publicKey, { algorithms: ['RS256'] });
        // Извлекаем `sub` (идентификатор пользователя) из payload токена и сохраняем его в `req.userId`
        if (typeof payload === 'object' && 'sub' in payload) {
            req.userId = payload.sub; // Сохраняем userId
        }
        else {
            throw new Error('Invalid token payload: missing sub field.');
        }
        console.log('Token verified successfully. Payload:', payload); // Debug log
        next();
    }
    catch (error) {
        console.error('Invalid token:', error.message);
        return res.status(403).json({ error: error.message });
    }
});
exports.authenticateToken = authenticateToken;
