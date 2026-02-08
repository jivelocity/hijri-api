import { Hono } from "hono";
import { hijriRoute } from "../api/routes/hijri.route";
import { prayerRoute } from "../api/routes/prayer.route";

const app = new Hono();

app.route("/", hijriRoute);
app.route("/", prayerRoute);

app.onError((err, c) => c.json({ status: "error", message: err.message }, 400));

export default app;
