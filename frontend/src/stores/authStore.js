import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,

      setLoading: (loading) => set({ loading }),

      login: (userData, token) => {
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          loading: false
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false
        });
      },

      checkAuth: () => {
        set((state) => ({
          isAuthenticated: !!state.token && !!state.user,
          loading: false
        }));
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;