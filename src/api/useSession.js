import { useSyncExternalStore } from "react";
import { api } from "./client.js";

const initial = { user: null, loading: true, error: "" };
let snapshot = initial,
  inflight,
  queued = false;
const listeners = new Set();
const emit = () => {
  for (const listener of listeners) listener();
};
const reload = () => {
  if (inflight) return;
  inflight = api("/auth/me")
    .then((data) => {
      snapshot = { ...data, loading: false, error: "" };
    })
    .catch((error) => {
      snapshot = { ...snapshot, loading: false, error: error.message };
    })
    .finally(() => {
      inflight = null;
      emit();
      if (queued) {
        queued = false;
        reload();
      }
    });
};
const onSession = () => {
  if (inflight) queued = true;
  else reload();
};
function subscribe(listener) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("stroy-session", onSession);
    reload();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener("stroy-session", onSession);
  };
}
export function useSession() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => initial,
  );
}
