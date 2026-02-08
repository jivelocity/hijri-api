import { Hono } from "hono";
import { getHijri } from "../controllers/hijri.controller.ts";

export const hijriRoute = new Hono();

hijriRoute.get("/hijri", getHijri);
