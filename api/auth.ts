import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

type Request = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string | string[]) => Response;
  end: () => void;
};

const COOKIE_NAME = "aba_life_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type PasswordHash = {
  salt: string;
  digest: string;
};

function getHeader(req: Request, name: string) {
  const value = req.headers[name] ?? req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function parseCookies(header?: string) {
  return (header || "").split(";").reduce<Record<string, string>>((cookies, item) => {
    const separator = item.indexOf("=");
    if (separator < 0) return cookies;
    const key = item.slice(0, separator).trim();
    const value = item.slice(separator + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function sign(value: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function createSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

function isValidSession(value?: string) {
  if (!value || !process.env.SESSION_SECRET) return false;
  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(expiresAt);
  if (!expected) return false;
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

function parsePasswordHash(value?: string): PasswordHash | null {
  if (!value) return null;
  const [algorithm, salt, digest] = value.split("$");
  if (algorithm !== "scrypt" || !salt || !digest) return null;
  return { salt, digest };
}

function verifyPassword(password: string) {
  const stored = parsePasswordHash(process.env.APP_PASSWORD_HASH);
  if (!stored) return false;
  const candidate = scryptSync(password, Buffer.from(stored.salt, "base64url"), 64);
  const expected = Buffer.from(stored.digest, "base64url");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function bodyOf(req: Request) {
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (req.body || {}) as Record<string, unknown>;
}

function setSessionCookie(res: Response, value: string, maxAge: number) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`);
}

export default function handler(req: Request, res: Response) {
  const cookies = parseCookies(getHeader(req, "cookie"));
  const authenticated = isValidSession(cookies[COOKIE_NAME]);

  if (req.method === "GET") {
    res.status(authenticated ? 200 : 401).json({ authenticated });
    return;
  }

  if (req.method === "DELETE") {
    setSessionCookie(res, "", 0);
    res.status(200).json({ authenticated: false });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const password = bodyOf(req).password;
  if (typeof password !== "string" || password.length < 1) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  if (!process.env.APP_PASSWORD_HASH || !process.env.SESSION_SECRET) {
    res.status(503).json({ error: "Authentication is not configured" });
    return;
  }

  if (!verifyPassword(password)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  setSessionCookie(res, createSession(), SESSION_TTL_SECONDS);
  res.status(200).json({ authenticated: true });
}
