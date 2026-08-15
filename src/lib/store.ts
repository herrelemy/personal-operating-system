import { useCallback, useEffect, useState } from "react";

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useLocalList<T>(key: string, fallback: T[]) {
  const [items, setItems] = useState<T[]>(() => readLocal<T[]>(key, fallback));
  useEffect(() => writeLocal(key, items), [key, items]);
  const update = useCallback((next: T[] | ((current: T[]) => T[])) => setItems(next), []);
  return [items, update] as const;
}

export function todayLabel() {
  return new Intl.DateTimeFormat("ar-EG", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
}
