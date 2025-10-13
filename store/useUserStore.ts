import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  username: string | null;
  setUsername: (username: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (username: string) => set({ username }),
      clearUser: () => set({ username: null }),
    }),
    {
      name: 'github-tracker-storage',
    }
  )
);

