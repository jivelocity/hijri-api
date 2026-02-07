import { Hono } from "hono";
import { getPrayerTimes } from "../controllers/prayer.controller";

export const prayerRoute = new Hono();

prayerRoute.get("/prayer-times", getPrayerTimes);
