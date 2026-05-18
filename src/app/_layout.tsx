import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { HotUpdater } from "@hot-updater/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Platform, Text, useColorScheme, View } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { hotUpdaterStatusStore } from "@/store/hot-updater-status";

const OTA_BASE_URL =
  "https://ota.borisyankov.workers.dev/apps/hot-updater-tester/hot-updater";
const OTA_REPORT_URL = `${OTA_BASE_URL}/report`;
const INSTALLATION_ID_KEY = "ota.installationId";

type ReportingEvent = {
  crashedUpdateId?: string;
  message?: string;
  metadata?: Record<string, unknown>;
  outcome: string;
  targetUpdateId?: string;
  type: "launch" | "update_check" | "update_error";
};

function createEventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function getInstallationId() {
  const existing = await AsyncStorage.getItem(INSTALLATION_ID_KEY);
  if (existing) return existing;
  const next = createEventId();
  await AsyncStorage.setItem(INSTALLATION_ID_KEY, next);
  return next;
}

function getReportingPlatform() {
  return Platform.OS === "ios" || Platform.OS === "android"
    ? Platform.OS
    : undefined;
}

async function reportOtaEvent(event: ReportingEvent) {
  const installationId = await getInstallationId();
  await fetch(OTA_REPORT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      schemaVersion: 1,
      provider: "hot-updater",
      installationId,
      sessionId: createEventId(),
      events: [
        {
          eventId: createEventId(),
          occurredAt: new Date().toISOString(),
          platform: getReportingPlatform(),
          channel: HotUpdater.getChannel(),
          appVersion: HotUpdater.getAppVersion() ?? undefined,
          currentUpdateId: HotUpdater.getBundleId(),
          ...event,
        },
      ],
    }),
  });
}

function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default HotUpdater.wrap({
  baseURL: OTA_BASE_URL,
  updateStrategy: "fingerprint",
  updateMode: "auto",
  onNotifyAppReady: ({ status, crashedBundleId }) => {
    void reportOtaEvent({
      type: "launch",
      outcome: status === "RECOVERED" ? "recovered" : "stable",
      crashedUpdateId: crashedBundleId,
    }).catch(() => {});
  },
  onUpdateProcessCompleted: (response) => {
    hotUpdaterStatusStore.setUpdateResult(response);
    void reportOtaEvent({
      type: "update_check",
      outcome: response.status.toLowerCase(),
      targetUpdateId: response.id,
      metadata: {
        shouldForceUpdate: response.shouldForceUpdate,
        message: response.message,
      },
    }).catch(() => {});
  },
  onError: (error) => {
    void reportOtaEvent({
      type: "update_error",
      outcome: "error",
      message: error instanceof Error ? error.message : String(error),
    }).catch(() => {});
  },
  fallbackComponent: ({ progress, status }) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {status === "UPDATING" ? "Updating..." : "Checking for update..."}
      </Text>
      {progress > 0 && (
        <Text style={{ marginTop: 8, fontSize: 16 }}>
          {Math.round(progress * 100)}%
        </Text>
      )}
    </View>
  ),
})(TabLayout);
