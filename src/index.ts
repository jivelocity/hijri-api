import { Hono } from "hono";
import { hijriRoute } from "./routes/hijri.route.ts";
import { prayerRoute } from "./routes/prayer.route.ts";

export const app = new Hono();

app.get("/", (c) => c.json({ ok: true }));

app.route("/", hijriRoute);
app.route("/", prayerRoute);

app.onError((err, c) => {
  return c.json({ status: "error", message: err.message }, 400);
});

// untuk Vercel: default export app
export default app;
