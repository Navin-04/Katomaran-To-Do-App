import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const getSystemTheme = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyTheme = (theme: Theme): boolean => {
  let isDark: boolean;
  
  if (theme === 'system') {
    isDark = getSystemTheme();
  } else {
    isDark = theme === 'dark';
  }
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  return isDark;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,

      setTheme: (theme: Theme) => {
        const isDark = applyTheme(theme);
        set({ theme, isDark });
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        const isDark = applyTheme(newTheme);
        set({ theme: newTheme, isDark });
      },

      initializeTheme: () => {
        const { theme } = get();
        const isDark = applyTheme(theme);
        set({ isDark });

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
          const currentTheme = get().theme;
          if (currentTheme === 'system') {
            const isDark = applyTheme('system');
            set({ isDark });
          }
        };

        mediaQuery.addEventListener('change', handleChange);
        
        // Cleanup function would be called if this was in a useEffect
        return () => mediaQuery.removeEventListener('change', handleChange);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);