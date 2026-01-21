import { create } from "zustand";

export const useUser = create((set) => ({
  isUserLogin: false,

  setIsUserLogin: (value) => set({ isUserLogin: value }),
}));

// experiment no-1
