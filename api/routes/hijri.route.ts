import { Hono } from "hono";
import { getHijri } from "../controllers/hijri.controller";

export const hijriRoute = new Hono();

hijriRoute.get("/hijri", getHijri);
