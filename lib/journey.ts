import type { Route } from "./routes";

const DAY_MS = 24 * 60 * 60 * 1000;

/** TIME_SCALE speeds up journeys for local testing; 1 means real days. */
export function journeyMs(route: Route): number {
  const scale = Number(process.env.TIME_SCALE) || 1;
  return (route.days * DAY_MS) / scale;
}

export function progress(sentAt: string, arrivesAt: string, now = Date.now()): number {
  const start = new Date(sentAt).getTime();
  const end = new Date(arrivesAt).getTime();
  return Math.min(1, Math.max(0, (now - start) / (end - start)));
}
