import { create } from 'zustand';

interface AuthState {
    user: any | null;
    setUser: (user: any | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),
}));

interface AppState {
    isNavOpen: boolean;
    setNavOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isNavOpen: false,
    setNavOpen: (open) => set({ isNavOpen: open }),
}));
