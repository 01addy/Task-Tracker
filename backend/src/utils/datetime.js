// src/utils/datetime.js
import { DateTime } from "luxon";

export const TZ = "Asia/Kolkata";


export function parseIncomingDateAsUTC(input) {
  if (!input) return null;

  
  const maybeIsoWithZone = DateTime.fromISO(input, { setZone: true });
  if (maybeIsoWithZone.isValid && maybeIsoWithZone.offset !== 0) {
    
    return maybeIsoWithZone.toUTC().toJSDate();
  }



  let dt = DateTime.fromISO(input, { zone: TZ });
  if (!dt.isValid) {
    
    dt = DateTime.fromFormat(input, "yyyy-MM-dd HH:mm", { zone: TZ });
  }
  if (!dt.isValid) {
    
    const d = new Date(input);
    if (!isNaN(d.getTime())) {
      
      const dtLocal = DateTime.fromJSDate(d).setZone(TZ, { keepLocalTime: true });
      return dtLocal.toUTC().toJSDate();
    }
    return null;
  }
  return dt.toUTC().toJSDate();
}


export function toISTString(date, opts = { format: "yyyy-LL-dd HH:mm", includeOffsetIso: false }) {
  if (!date) return null;
  const dt = DateTime.fromJSDate(date, { zone: "utc" }).setZone(TZ);
  if (opts.includeOffsetIso) return dt.toISO();
  return dt.toFormat(opts.format); 
}
