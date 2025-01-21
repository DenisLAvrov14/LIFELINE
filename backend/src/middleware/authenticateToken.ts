import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";

const JWKS_URL = process.env.JWKS_URL;
if (!JWKS_URL) {
  throw new Error("JWKS_URL is not defined. Check your .env file.");
}

let cachedPublicKey: string | null = null;

type JWKSResponse = {
  keys: Array<{
    kid: string;
    x5c: string[];
    use?: string;
    alg?: string;
  }>;
};

const getPublicKey = async (): Promise<string> => {
  if (cachedPublicKey) {
    return cachedPublicKey;
  }

  try {
    console.log(`Fetching JWKS from URL: ${JWKS_URL}`);
    const response = await axios.get<JWKSResponse>(JWKS_URL);

    console.log("JWKS response data:", response.data);
    const keys = response.data.keys;

    if (!keys || keys.length === 0) {
      throw new Error("No public keys found in JWKS.");
    }

    const signingKey = keys.find((key) => key.use === "sig");
    if (!signingKey) {
      throw new Error("No signing key found in JWKS.");
    }

    const { x5c } = signingKey;
    if (!x5c || x5c.length === 0) {
      throw new Error("No x5c field found in signing key.");
    }

    cachedPublicKey = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;
    console.log("Public key cached successfully.");
    return cachedPublicKey;
  } catch (error: any) {
    console.error("Error fetching JWKS:", error.message);
    throw new Error("Failed to fetch public key from JWKS.");
  }
};

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const publicKey = await getPublicKey();
    const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    if (typeof payload === 'object' && 'sub' in payload) {
      (req as any).userId = payload.sub; // ID пользователя
      (req as any).keycloakToken = payload; // Полезная нагрузка токена
    } else {
      throw new Error('Invalid token payload: missing sub field.');
    }

    console.log('Token verified successfully. Payload:', payload);
    next();
  } catch (error: any) {
    console.error('Invalid token:', error.message);
    return res.status(403).json({ error: error.message });
  }
};