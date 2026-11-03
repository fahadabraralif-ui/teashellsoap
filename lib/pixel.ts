type Fbq = (...args: unknown[]) => void;

/** Fire a Meta Pixel event if the pixel is loaded; no-op otherwise. */
export function track(event: string, params?: Record<string, unknown>, eventID?: string) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (!fbq) return;
  if (eventID) fbq("track", event, params ?? {}, { eventID });
  else fbq("track", event, params ?? {});
}
