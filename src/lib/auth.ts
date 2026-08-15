export type AuthState = { authenticated: boolean };

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, { credentials: "include", ...init });
  let body: { authenticated?: boolean; error?: string } = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }
  if (!response.ok && response.status !== 401) {
    throw new Error(body.error || "تعذر إكمال طلب المصادقة");
  }
  return { response, body };
}

export async function getAuthState(): Promise<AuthState> {
  const { response, body } = await request("/api/auth");
  return { authenticated: response.ok && body.authenticated === true };
}

export async function login(password: string): Promise<void> {
  const { response, body } = await request("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok || body.authenticated !== true) throw new Error(body.error || "كلمة المرور غير صحيحة");
}

export async function logout(): Promise<void> {
  await request("/api/auth", { method: "DELETE" });
}
