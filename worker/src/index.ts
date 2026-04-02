import { Hono } from "hono";
import { Env } from "./drizzle";
import { getHotUpdater } from "./hotUpdater";

const app = new Hono<{ Bindings: Env }>();

app.on(["POST", "GET", "DELETE"], "/hot-updater/*", async (c) => {
  const hotUpdater = getHotUpdater(c.env);
  return hotUpdater.handler(c.req.raw);
});

export default app;
