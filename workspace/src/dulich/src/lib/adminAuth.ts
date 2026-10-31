import crypto from "crypto";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "nep_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const authFilePath = path.join(process.cwd(), "data", "admin-auth.json");

interface StoredAdminCredentials {
  username: string;
  passwordSalt: string;
  passwordHash: string;
  secretKey: string;
  updatedAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function getOrInitAdminCredentials(): StoredAdminCredentials {
  try {
    if (fs.existsSync(authFilePath)) {
      const raw = fs.readFileSync(authFilePath, "utf8");
      const parsed = JSON.parse(raw) as StoredAdminCredentials;
      if (
        parsed.username &&
        parsed.passwordSalt &&
        parsed.passwordHash &&
        parsed.secretKey
      ) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read admin-auth.json, initializing default:", err);
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const secretKey = crypto.randomBytes(32).toString("hex");
  const defaultCreds: StoredAdminCredentials = {
    username: "admin",
    passwordSalt: salt,
    passwordHash: hashPassword("nep2026", salt),
    secretKey,
    updatedAt: new Date().toISOString(),
  };

  try {
    const dir = path.dirname(authFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(authFilePath, JSON.stringify(defaultCreds, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist default admin-auth.json:", err);
  }

  return defaultCreds;
}

export function verifyPassword(
  inputUsername: string,
  inputPassword: string
): boolean {
  const creds = getOrInitAdminCredentials();
  const normalizedUser = inputUsername.trim();
  if (normalizedUser !== creds.username) {
    return false;
  }

  const candidateHash = hashPassword(inputPassword, creds.passwordSalt);
  const a = Buffer.from(candidateHash, "hex");
  const b = Buffer.from(creds.passwordHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function updateAdminCredentials(
  newUsername: string,
  newPassword: string
): boolean {
  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const secretKey = crypto.randomBytes(32).toString("hex");
    const updated: StoredAdminCredentials = {
      username: newUsername.trim() || "admin",
      passwordSalt: salt,
      passwordHash: hashPassword(newPassword, salt),
      secretKey,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(authFilePath, JSON.stringify(updated, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to update admin credentials:", err);
    return false;
  }
}

export function createSessionToken(username: string): string {
  const creds = getOrInitAdminCredentials();
  const payload = {
    u: username,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", creds.secretKey)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined | null
): { valid: boolean; username?: string } {
  if (!token || !token.includes(".")) {
    return { valid: false };
  }

  try {
    const [payloadB64, sig] = token.split(".");
    const creds = getOrInitAdminCredentials();
    const expectedSig = crypto
      .createHmac("sha256", creds.secretKey)
      .update(payloadB64)
      .digest("base64url");

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (
      sigBuf.length !== expBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expBuf)
    ) {
      return { valid: false };
    }

    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as { u: string; exp: number };

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, username: payload.u };
  } catch {
    return { valid: false };
  }
}

export async function getServerAdminSession(): Promise<{
  authenticated: boolean;
  username?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const verified = verifySessionToken(token);
    return {
      authenticated: verified.valid,
      username: verified.username,
    };
  } catch {
    return { authenticated: false };
  }
}
