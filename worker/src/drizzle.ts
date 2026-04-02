import { drizzle } from "drizzle-orm/d1";

export interface Env {
  DB: D1Database;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
}

export const getDb = (env: Env) => drizzle(env.DB);
