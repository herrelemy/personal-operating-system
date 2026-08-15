import { randomBytes, scryptSync } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import handler from "../api/auth";

type MockResponse = {
  statusCode: number;
  body: unknown;
  headers: Record<string, string | string[]>;
  status: (code: number) => MockResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string | string[]) => MockResponse;
  end: () => void;
};

function response(): MockResponse {
  const result: MockResponse = {
    statusCode: 200,
    body: undefined,
    headers: {},
    status(code) { result.statusCode = code; return result; },
    json(body) { result.body = body; },
    setHeader(name, value) { result.headers[name] = value; return result; },
    end() {},
  };
  return result;
}

function passwordHash(password: string) {
  const salt = randomBytes(16);
  const digest = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64url")}$${digest.toString("base64url")}`;
}

describe("private auth endpoint", () => {
  const password = "test-only-password";
  const previousHash = process.env.APP_PASSWORD_HASH;
  const previousSecret = process.env.SESSION_SECRET;

  beforeEach(() => {
    process.env.APP_PASSWORD_HASH = passwordHash(password);
    process.env.SESSION_SECRET = "test-session-secret";
  });

  afterEach(() => {
    process.env.APP_PASSWORD_HASH = previousHash;
    process.env.SESSION_SECRET = previousSecret;
  });

  it("rejects a wrong password and accepts the configured password", () => {
    const rejected = response();
    handler({ method: "POST", headers: {}, body: { password: "wrong" } }, rejected);
    expect(rejected.statusCode).toBe(401);

    const accepted = response();
    handler({ method: "POST", headers: {}, body: { password } }, accepted);
    expect(accepted.statusCode).toBe(200);
    expect(String(accepted.headers["Set-Cookie"])).toContain("HttpOnly");
  });

  it("recognizes and clears a valid session cookie", () => {
    const loginResponse = response();
    handler({ method: "POST", headers: {}, body: { password } }, loginResponse);
    const cookie = String(loginResponse.headers["Set-Cookie"]).split(";")[0];

    const sessionResponse = response();
    handler({ method: "GET", headers: { cookie } }, sessionResponse);
    expect(sessionResponse.statusCode).toBe(200);
    expect(sessionResponse.body).toEqual({ authenticated: true });

    const logoutResponse = response();
    handler({ method: "DELETE", headers: { cookie } }, logoutResponse);
    expect(logoutResponse.statusCode).toBe(200);
    expect(String(logoutResponse.headers["Set-Cookie"])).toContain("Max-Age=0");
  });
});
