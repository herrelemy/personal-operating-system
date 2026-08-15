import { beforeEach, describe, expect, it } from "vitest";
import { createId, readLocal, writeLocal } from "./store";

const storage = new Map<string, string>();
globalThis.window = globalThis as unknown as Window & typeof globalThis;
globalThis.localStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
  key: (index: number) => Array.from(storage.keys())[index] ?? null,
  get length() { return storage.size; },
} as Storage;

describe("local store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips JSON values through localStorage", () => {
    const value = { title: "مهمة اختبار", completed: false };
    writeLocal("test-item", value);
    expect(readLocal("test-item", null)).toEqual(value);
  });

  it("returns the fallback for missing or invalid values", () => {
    expect(readLocal("missing", ["fallback"])).toEqual(["fallback"]);
    localStorage.setItem("broken", "not-json");
    expect(readLocal("broken", { safe: true })).toEqual({ safe: true });
  });

  it("creates non-empty identifiers", () => {
    const id = createId();
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);
  });
});
