import type { RunUpdateProcessResponse } from '@hot-updater/react-native';

type Listener = () => void;

type State = { updateResult: RunUpdateProcessResponse | null };

let state: State = { updateResult: null };
const listeners = new Set<Listener>();

export const hotUpdaterStatusStore = {
  getSnapshot: (): State => state,
  setUpdateResult: (result: RunUpdateProcessResponse) => {
    state = { updateResult: result };
    listeners.forEach((l) => l());
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
};
