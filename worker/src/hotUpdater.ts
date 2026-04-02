import { createHotUpdater } from "@hot-updater/server";
import { drizzleAdapter } from "@hot-updater/server/adapters/drizzle";
import { s3Storage } from "@hot-updater/aws";
import { Env, getDb } from "./drizzle";

export const getHotUpdater = (env: Env) =>
  createHotUpdater({
    database: drizzleAdapter({ db: getDb(env), provider: "sqlite" }),
    storages: [
      s3Storage({
        region: "auto",
        endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
        bucketName: "hot-updater-bundles",
      }),
    ],
    basePath: "/hot-updater",
  });
