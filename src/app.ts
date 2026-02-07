import { Hono } from "hono";
import { hijriRoute } from "./api/hijri.route";
import { prayerRoute } from "./api/prayer.route";

export const app = new Hono();

app.get("/", (c) => c.json({ ok: true }));

app.route("/", hijriRoute);
app.route("/", prayerRoute);

app.onError((err, c) => {
  return c.json({ status: "error", message: err.message }, 400);
});

// untuk Vercel: default export app
export default app;
