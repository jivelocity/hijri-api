import type { Context } from "hono";
import { buildHijriItem } from "../services/hijri.service";
import { parseDateParam } from "../utils/date";

export function getHijri(c: Context) {
  const dateStr = c.req.query("date");
  const m = parseDateParam(dateStr); // return moment object (atau throw)

  const data = [buildHijriItem(m)];
  return c.json(data);
}
