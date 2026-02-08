import { Hono } from "hono";
import { getPrayerTimes } from "../controllers/prayer.controller.ts";

export const prayerRoute = new Hono();

prayerRoute.get("/prayer-times", getPrayerTimes);
