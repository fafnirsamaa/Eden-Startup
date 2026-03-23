import { create } from 'zustand'

/**
 * Global garden state — slots, notifications, and override controls.
 * Persisted slices can be added via `zustand/middleware` persist.
 */
export const useGardenStore = create((set, get) => ({
  /** @type {import('../types/index').Slot[]} */
  slots: [],

  /** @type {import('../types/index').Notification[]} */
  notifications: [],

  /** View mode for the dashboard */
  dashboardView: 'grid', // 'grid' | 'list'

  setSlots: (slots) => set({ slots }),

  updateSlot: (id, patch) =>
    set((state) => ({
      slots: state.slots.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  setDashboardView: (view) => set({ dashboardView: view }),

  /** Manual override — pause automation for a slot */
  toggleOverride: (slotId) =>
    set((state) => ({
      slots: state.slots.map((s) =>
        s.id === slotId ? { ...s, overrideActive: !s.overrideActive } : s
      ),
    })),

  get unreadCount() {
    return get().notifications.filter((n) => !n.read).length
  },
}))
