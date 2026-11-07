"use client";

import { useSyncExternalStore } from "react";

export type Theme = "original" | "petal";
export const THEME_STORAGE_KEY = "torrays-theme";
export const THEME_CHANGE_EVENT = "torrays-theme-change";

export const NSFW_STORAGE_KEY = "torrays-nsfw";
export const NSFW_CHANGE_EVENT = "torrays-nsfw-change";

function readTheme(): Theme {
  if (typeof window === "undefined") return "original";
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "petal" ? "petal" : "original";
}

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "original");
  const setTheme = (next: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };
  return [theme, setTheme] as const;
}

function readNsfw(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(NSFW_STORAGE_KEY) === "true";
}

function subscribeNsfw(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(NSFW_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(NSFW_CHANGE_EVENT, onStoreChange);
  };
}

export function useNsfw() {
  const nsfw = useSyncExternalStore(subscribeNsfw, readNsfw, () => false);
  const toggleNsfw = () => {
    const next = !nsfw;
    window.localStorage.setItem(NSFW_STORAGE_KEY, String(next));
    window.dispatchEvent(new Event(NSFW_CHANGE_EVENT));
  };
  return [nsfw, toggleNsfw] as const;
}

