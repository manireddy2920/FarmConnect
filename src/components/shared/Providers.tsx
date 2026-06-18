'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useUIStore } from '@/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeApplier>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#2D6A4F',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: '500',
              },
              success: { iconTheme: { primary: '#E9C46A', secondary: '#2D6A4F' } },
            }}
          />
        </ThemeApplier>
      </QueryClientProvider>
    </SessionProvider>
  );
}
