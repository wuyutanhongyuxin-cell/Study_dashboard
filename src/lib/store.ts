import { create } from 'zustand';
import type { SubjectId } from './constants';

interface TimerState {
  isRunning: boolean;
  subject: SubjectId | null;
  startTime: number | null;
  elapsed: number; // seconds
}

interface AppStore {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Timer
  timer: TimerState;
  startTimer: (subject: SubjectId) => void;
  stopTimer: () => void;
  tickTimer: () => void;

  // Active chat
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  timer: {
    isRunning: false,
    subject: null,
    startTime: null,
    elapsed: 0,
  },

  startTimer: (subject) =>
    set({
      timer: {
        isRunning: true,
        subject,
        startTime: Date.now(),
        elapsed: 0,
      },
    }),

  stopTimer: () => {
    const { timer } = get();
    if (!timer.isRunning || !timer.subject || !timer.startTime) return;
    const duration = Math.floor((Date.now() - timer.startTime) / 60000);

    // Save session via API
    fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: timer.subject,
        startTime: new Date(timer.startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration,
      }),
    });

    set({
      timer: { isRunning: false, subject: null, startTime: null, elapsed: 0 },
    });
  },

  tickTimer: () => {
    const { timer } = get();
    if (!timer.isRunning || !timer.startTime) return;
    set({
      timer: { ...timer, elapsed: Math.floor((Date.now() - timer.startTime) / 1000) },
    });
  },

  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
}));
