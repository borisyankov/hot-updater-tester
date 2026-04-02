import { HotUpdater, useHotUpdaterStore } from '@hot-updater/react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSyncExternalStore } from 'react';

import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { hotUpdaterStatusStore } from '@/store/hot-updater-status';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { progress, isUpdateDownloaded } = useHotUpdaterStore();
  const { updateResult } = useSyncExternalStore(
    hotUpdaterStatusStore.subscribe,
    hotUpdaterStatusStore.getSnapshot,
  );

  const crashHistory = HotUpdater.getCrashHistory();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle" style={styles.heading}>
            Hot Updater
          </ThemedText>

          <ThemedText type="code" style={styles.sectionLabel}>bundle info</ThemedText>
          <ThemedView type="backgroundElement" style={styles.card}>
            <HintRow title="Bundle ID" hint={<ThemedText type="code">{HotUpdater.getBundleId()}</ThemedText>} />
            <HintRow title="Min Bundle ID" hint={<ThemedText type="code">{HotUpdater.getMinBundleId()}</ThemedText>} />
            <HintRow title="App Version" hint={<ThemedText type="code">{HotUpdater.getAppVersion() ?? 'N/A'}</ThemedText>} />
            <HintRow title="Fingerprint" hint={<ThemedText type="code">{HotUpdater.getFingerprintHash() ?? 'N/A'}</ThemedText>} />
          </ThemedView>

          <ThemedText type="code" style={styles.sectionLabel}>channel</ThemedText>
          <ThemedView type="backgroundElement" style={styles.card}>
            <HintRow title="Channel" hint={<ThemedText type="code">{HotUpdater.getChannel()}</ThemedText>} />
            <HintRow title="Default Channel" hint={<ThemedText type="code">{HotUpdater.getDefaultChannel()}</ThemedText>} />
            <HintRow title="Channel Switched" hint={<ThemedText type="code">{String(HotUpdater.isChannelSwitched())}</ThemedText>} />
          </ThemedView>

          <ThemedText type="code" style={styles.sectionLabel}>update state</ThemedText>
          <ThemedView type="backgroundElement" style={styles.card}>
            <HintRow title="Update Downloaded" hint={<ThemedText type="code">{String(isUpdateDownloaded)}</ThemedText>} />
            <HintRow title="Download Progress" hint={<ThemedText type="code">{Math.round(progress * 100)}%</ThemedText>} />
            <HintRow title="Crash History" hint={<ThemedText type="code">{crashHistory.length === 0 ? 'none' : crashHistory.join(', ')}</ThemedText>} />
          </ThemedView>

          <ThemedText type="code" style={styles.sectionLabel}>last update result</ThemedText>
          <ThemedView type="backgroundElement" style={styles.card}>
            {updateResult === null ? (
              <HintRow title="Status" hint={<ThemedText type="code">pending…</ThemedText>} />
            ) : (
              <>
                <HintRow title="Status" hint={<ThemedText type="code">{updateResult.status}</ThemedText>} />
                <HintRow title="Force Update" hint={<ThemedText type="code">{String(updateResult.shouldForceUpdate)}</ThemedText>} />
                <HintRow title="Bundle ID" hint={<ThemedText type="code">{updateResult.id}</ThemedText>} />
                <HintRow title="Message" hint={<ThemedText type="code">{updateResult.message ?? 'null'}</ThemedText>} />
              </>
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.two,
  },
  heading: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    paddingTop: Spacing.two,
  },
  card: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
