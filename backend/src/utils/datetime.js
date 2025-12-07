// src/utils/datetime.js
import { DateTime } from "luxon";

export const TZ = "Asia/Kolkata";

/**
 * Parse an incoming date string as IST and return a JS Date in UTC.
 * - Accepts many formats: ISO (with or without offset), 'yyyy-MM-dd HH:mm', etc.
 * - If input is already an ISO with timezone offset, it will honor that.
 *
 * Examples:
 *  parseIncomingDateAsUTC("2025-12-10T10:00") -> Date (UTC for 10:00 IST)
 *  parseIncomingDateAsUTC("2025-12-10 10:00") -> Date (UTC for 10:00 IST)
 */
export function parseIncomingDateAsUTC(input) {
  if (!input) return null;

  // If input contains a timezone offset (e.g. 2025-12-10T10:00+05:30 or Z), parse directly
  const maybeIsoWithZone = DateTime.fromISO(input, { setZone: true });
  if (maybeIsoWithZone.isValid && maybeIsoWithZone.offset !== 0) {
    // If it had an explicit zone or Z, convert to JS Date (UTC)
    return maybeIsoWithZone.toUTC().toJSDate();
  }

  // Otherwise parse in Asia/Kolkata explicitly.
  // Try common formats; let luxon guess with fromFormat fallback.
  let dt = DateTime.fromISO(input, { zone: TZ });
  if (!dt.isValid) {
    // try common with space
    dt = DateTime.fromFormat(input, "yyyy-MM-dd HH:mm", { zone: TZ });
  }
  if (!dt.isValid) {
    // last-resort: construct from JS Date and assume it's local input (not recommended)
    const d = new Date(input);
    if (!isNaN(d.getTime())) {
      // interpret this JS Date as if it were in TZ by shifting
      // create DateTime from JS Date and set zone to TZ without changing local time
      const dtLocal = DateTime.fromJSDate(d).setZone(TZ, { keepLocalTime: true });
      return dtLocal.toUTC().toJSDate();
    }
    return null;
  }
  return dt.toUTC().toJSDate();
}

/**
 * Convert stored UTC Date (JS Date) to string in IST for display.
 * Format: "yyyy-LL-dd HH:mm" and also return ISO with offset if needed.
 */
export function toISTString(date, opts = { format: "yyyy-LL-dd HH:mm", includeOffsetIso: false }) {
  if (!date) return null;
  const dt = DateTime.fromJSDate(date, { zone: "utc" }).setZone(TZ);
  if (opts.includeOffsetIso) return dt.toISO(); // e.g. 2025-12-10T10:00:00+05:30
  return dt.toFormat(opts.format); // e.g. 2025-12-10 10:00
}
