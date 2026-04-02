import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { HotUpdater } from "@hot-updater/react-native";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

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
  baseURL: "https://hot-updater.borisyankov.workers.dev/api/check-update",
  updateStrategy: "appVersion",
  updateMode: "auto",
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
