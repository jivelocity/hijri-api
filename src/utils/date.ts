import moment from "moment-hijri";

export function parseDateParam(dateStr?: string): moment.Moment {
  const m = dateStr ? moment(dateStr, "YYYY-MM-DD", true) : moment();
  if (!m.isValid()) {
    throw new Error(
      'Invalid "date". Use format YYYY-MM-DD (contoh: 2026-02-07).',
    );
  }
  return m;
}
