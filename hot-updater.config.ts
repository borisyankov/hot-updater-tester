import { r2Storage } from "@hot-updater/cloudflare";
import { expo } from "@hot-updater/expo";
import { standaloneRepository } from "@hot-updater/standalone";
import { config } from "dotenv";
import { defineConfig } from "hot-updater";

config({ path: ".env.hotupdater" });

export default defineConfig({
  build: expo(),
  storage: r2Storage({
    bucketName: process.env.OTA_CLOUDFLARE_R2_BUCKET_NAME!,
    accountId: process.env.OTA_CLOUDFLARE_ACCOUNT_ID!,
    cloudflareApiToken: process.env.OTA_CLOUDFLARE_API_TOKEN!,
  }),
  database: standaloneRepository({
    baseUrl: "http:/localhost:5173/apps/hot-updater-tester/hot-updater",
  }),
  updateStrategy: "appVersion",
});
